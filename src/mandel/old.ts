// Convert rgb values to hex value
function rgb_to_hex (r: number, g: number, b: number) {
	return 0xff000000 | ((r << 16) | (g << 8) | b)
}

// Get hex color value for
// function get_hex_color (n: number) {
// 	// config
// 	const min = 0
// 	const max = 1
// 	const colors = [ [ 90, 0, 0 ], [ 160, 230, 235 ] ]
// 	// algorithm
// 	const i_f = (n - min) / (max - min) * (2 - 1) // number of colors - 1
// 	let i = Math.floor(i_f)
// 	const f = i_f - i
// 	if (i > 1) i = 1
// 	if (f < 1e-37) {
// 		return rgb_to_hex(colors[i][0], colors[i][1], colors[i][2])
// 	}
// 	else {
// 		const color_1 = colors[0]
// 		const color_2 = colors[1]
// 		try {
// 			return rgb_to_hex(
// 				~~(color_1[0] + f * (color_2[0] - color_1[0])),
// 				~~(color_1[1] + f * (color_2[1] - color_1[1])),
// 				~~(color_1[2] + f * (color_2[2] - color_1[2]))
// 			)
// 		} catch (error) {
// 			console.log(i)
// 			console.trace(color_1, color_2)
// 			throw error
// 		}
// 	}
// }

const get_hex_color = get_color_fn([ 15, 26, 56 ], [ 255, 240, 200 ])

function get_color_fn (color_1: number[], color_2: number[]) {
	return function (n: number) {
		// if (n < 0.7 && n > 0.5) {
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
		return rgb_to_hex(b, g, r)
	}
}

function mini_mandelbrot () {}

// function calc_square (pixel_index: number, chunk_height: number, task_data: Uint32Array) {
// 	// algorithm
// 	let z_re = 0.0
// 	let z_im = 0.0

// 	let z_re_sq = z_re * z_re
// 	let z_im_sq = z_im * z_im
// 	let c_re = (x + 0.5 - width / 2.0) * pixel_length
// 	let c_im = (height / 2.0 - y + 0.5) * pixel_length
// 	let iter = 0
// 	while (z_re_sq + z_im_sq <= 4.0) {
// 		if (iter == max_iter) break
// 		z_im = z_re * z_im
// 		z_im += z_im
// 		z_im += c_im
// 		z_re = z_re_sq - z_im_sq + c_re
// 		z_re_sq = z_re * z_re
// 		z_im_sq = z_im * z_im
// 		iter += 1
// 	}
// 	if (iter >= max_iter) {
// 		// pixel belongs to mandelbrot set = black
// 		task_data[arr_idx] = 0xff000000
// 	}
// 	else {
// 		// pixel outside of mandelbrot set = colorized
// 		task_data[arr_idx] = get_hex_color(iter / max_iter * 40)
// 	}
// }

function calc_mandelbrot (
	width: number,
	height: number,
	pixel_length: number,
	max_iter: number,
	task_idx: number,
	task_size: number,
	task_data: Uint32Array
) {
	// const chunk_height = Math.floor(task_size / width)
	// calc_square(chunk_height, task_data)

	// loop through pixels in chunk
	for (let arr_idx = 0; arr_idx < task_size; arr_idx++) {
		const pixel_idx = task_idx + arr_idx
		const x = pixel_idx % width
		const y = Math.floor(pixel_idx / width)

		// algorithm
		let z_re = 0.0
		let z_im = 0.0

		let z_re_sq = z_re * z_re
		let z_im_sq = z_im * z_im
		let c_re = (x + 0.5 - width / 2.0) * pixel_length
		let c_im = (height / 2.0 - y + 0.5) * pixel_length
		let iter = 0
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

		if (iter >= max_iter) {
			// pixel belongs to mandelbrot set = black
			return 0xff000000
		}
		else {
			// pixel outside of mandelbrot set = colorized
			return get_hex_color(iter / max_iter * 40)
		}
	}
	// debug
	// base_pointer[0] = get_hex_color()
	return task_data
}

export default calc_mandelbrot
