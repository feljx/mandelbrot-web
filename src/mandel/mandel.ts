// Convert rgb values to hex value
function rgb_to_hex (r: number, g: number, b: number) {
	return 0xff000000 | ((r << 16) | (g << 8) | b)
}
const color_fractal = [ 80, 242, 196 ]
const color_infinity = [ 11, 18, 43 ]

function get_hex_color (x: number) {
	// const p = 255 * x
	// const [ r, g, b ] = [ p ** 1, p ** 1, p ** 1 ]
	const [ r, g, b ] = [
		color_fractal[0] * x,
		color_fractal[1] * x,
		color_fractal[2] * x
	]

	return [ r, g, b, 0xff ]
}

const red = [ 181, 103, 117 ]
const purple = [ 108, 103, 181 ]
const blue = [ 110, 140, 196 ]
const green = [ 47, 196, 162 ]
const colors = [ blue, purple, blue, blue, green, red ]
const scale_length = 1 / colors.length

// THE PROPER WAY TO CALCULATE COLOR
// IS TO GO IN FIXED LENGTH STEPS THAT REPRESENT
// A COLOR SPECTRUM
// SO INSTEAD OF CALCULATING A SIMPLE RATIO WITH iter AND max_iter, MAP ITER STEPS TO COLOR
function HexColor (iter: number, iter_max: number) {
	const mandelbrot_ratio = iter / iter_max
	const scale = mandelbrot_ratio / scale_length
	const scale_color_index = ~~scale
	const color_start = colors[scale_color_index - 1] || colors[0]
	const color_end = colors[scale_color_index] || colors[3]
	const delta_factor = Number((scale + '').split('.')[1] || 0)
	const color_delta = [
		(color_end[0] - color_start[0]) * delta_factor,
		(color_end[1] - color_start[1]) * delta_factor,
		(color_end[2] - color_start[2]) * delta_factor
	]
	const [ r, g, b ] = [
		color_start[0] + color_delta[0],
		color_start[1] + color_delta[1],
		color_start[2] + color_delta[2]
	]
	return [ r, g, b, 0xff ]
}

// const get_hex_color = get_color_fn(color_infinity, color_fractal)

function get_color_fn (color_1: number[], color_2: number[]) {
	return function (n: number) {
		// if (n < 0.5 && n > 0.5) {
		// 	n = n * n * 2
		// }
		const dr = color_2[0] - color_1[0]
		const dg = color_2[1] - color_1[1]
		const db = color_2[2] - color_1[2]
		const [ r, g, b ] = [
			dr * n + color_1[0],
			dg * n + color_1[1],
			db * n + color_1[2]
		]
		/* return rgb_to_hex(b, g, r) */
		return [ r, g, b, 0xff ]
	}
}

function coord_to_idx (width, x, y) {
	return x + y * width
}

function set_red (width, x, y, byte_array) {
	const idx = coord_to_idx(width, x, y)
	byte_array[idx] = 0xff
	byte_array[idx + 1] = 0x00
	byte_array[idx + 2] = 0x00
	byte_array[idx + 3] = 0xff
}

function calc_mandelbrot (
	total_width: number,
	total_height: number,
	pixel_length: number,
	max_iter: number,
	top: number,
	left: number,
	bot: number,
	right: number
) {
	// MOVEMENT OFFSETS
	const OFFSET_X = 0.16305 * (2 / pixel_length)
	const OFFSET_Y = 0.199974 * (2 / pixel_length)

	/* number of pixels is pixels between vertex coordinates */
	const pixel_num = (right - left) * (bot - top)

	// OPTIMIZATION LOOKAHEAD
	let is_black = true
	const step = 3
	// outer columns (constant x inside loop, iterate through all columns in column)
	for (let y = top + OFFSET_Y; y < bot + OFFSET_Y; y += step) {
		const xs = [ left + OFFSET_X, right - 1 + OFFSET_X ]
		for (const x of xs) {
			/* initial z = 0.0 + 0.0i */
			let z_re = 0.0
			let z_im = 0.0
			/* initial squares are both 0.0 */
			let z_re_sq = 0.0
			let z_im_sq = 0.0
			/* c constant is determined using pixel coordinate */
			const c_re = (x + 0.5 - total_width / 2.0) * pixel_length
			const c_im = (total_height / 2.0 - y + 0.5) * pixel_length
			/* do max_iter iterations per pixel coordinate */
			let iter = 0
			/* while sum of z is below infinity boundary 4 */
			while (z_re_sq + z_im_sq <= 4.0) {
				if (iter == max_iter) break
				z_im = z_re * z_im
				z_im += z_im
				z_im += c_im
				z_re = z_re_sq - z_im_sq + c_re
				z_re_sq = z_re * z_re
				z_im_sq = z_im * z_im
				iter += 1
			}
			// if max_iter surpassed -> pixel is in Mandelbrot set
			if (iter < max_iter) {
				is_black = false
				break
			}
		}
	}

	// outer columns (constant y inside loop, iterate through all columns in column)
	for (let x = left + OFFSET_X; x < right + OFFSET_X; x += step) {
		const ys = [ top + OFFSET_Y, bot - 1 + OFFSET_Y ]
		for (const y of ys) {
			/* initial z = 0.0 + 0.0i */
			let z_re = 0.0
			let z_im = 0.0
			/* initial squares are both 0.0 */
			let z_re_sq = 0.0
			let z_im_sq = 0.0
			/* c constant is determined using pixel coordinate */
			const c_re = (x + 0.5 - total_width / 2.0) * pixel_length
			const c_im = (total_height / 2.0 - y + 0.5) * pixel_length
			/* do max_iter iterations per pixel coordinate */
			let iter = 0
			/* while sum of z is below infinity boundary 4 */
			while (z_re_sq + z_im_sq <= 4.0) {
				if (iter == max_iter) break
				z_im = z_re * z_im
				z_im += z_im
				z_im += c_im
				z_re = z_re_sq - z_im_sq + c_re
				z_re_sq = z_re * z_re
				z_im_sq = z_im * z_im
				iter += 1
			}
			// if max_iter surpassed -> pixel is in Mandelbrot set
			if (iter < max_iter) {
				is_black = false
				break
			}
		}
	}
	// if no outline pixel violated the iteration check
	if (is_black) {
		// return array of black pixels
		const uint32_view = new Uint32Array(pixel_num).fill(0xff000000)
		return new Uint8ClampedArray(uint32_view.buffer)
	}

	// MAIN (full) ITERATION
	const pixel_bytes = new Uint8ClampedArray(pixel_num * 4)
	// MINI OPTIMIZATION
	// complex constants
	const c_re_0 = (0 + 0.5 - total_width / 2) * pixel_length
	const c_im_0 = (total_height / 2 - 0 + 0.5) * pixel_length
	const dre = (1 + 0.5 - total_width / 2) * pixel_length - c_re_0
	const dim = (total_height / 2 - 1 + 0.5) * pixel_length - c_im_0
	let pixel_idx = 0
	/* loop through pixels in task */
	for (let y = top + OFFSET_Y; y < bot + OFFSET_Y; y++) {
		for (let x = left + OFFSET_X; x < right + OFFSET_X; x++) {
			/* initial z = 0.0 + 0.0i */
			let z_re = 0.0
			let z_im = 0.0
			/* initial squares are both 0.0 */
			let z_re_sq = 0.0
			let z_im_sq = 0.0
			/* c constant is determined using pixel coordinate */
			const c_re = c_re_0 + dre * x
			const c_im = c_im_0 + dim * y
			/* do max_iter iterations per pixel coordinate */
			let iter = 0
			/* while sum of z is below infinity boundary 4 */
			while (z_re_sq + z_im_sq <= 4.0) {
				if (iter == max_iter) break
				z_im = z_re * z_im
				z_im += z_im
				z_im += c_im
				z_re = z_re_sq - z_im_sq + c_re
				z_re_sq = z_re * z_re
				z_im_sq = z_im * z_im
				iter += 1
			}
			/* if max iterations were passed, pixel is within mandelbrot set */
			/* pixels within are black 0xff000000, pixels outside are colored relative to number of iterations */
			// const scaling_factor = iter * 12 / max_iter
			const rgba =
				iter >= max_iter
					? [ 0x00, 0x00, 0x00, 0xff ]
					: HexColor(iter + 330, max_iter)
			pixel_bytes[pixel_idx * 4] = rgba[0]
			pixel_bytes[pixel_idx * 4 + 1] = rgba[1]
			pixel_bytes[pixel_idx * 4 + 2] = rgba[2]
			pixel_bytes[pixel_idx * 4 + 3] = rgba[3]
			pixel_idx += 1
		}
	}

	return pixel_bytes
}

export default calc_mandelbrot
