// function get_hsl_color (percentage, maxHue = 120, minHue = 0) {
// 	const hue = percentage * (maxHue - minHue) + minHue
// 	// return `hsl(${hue}, 100%, 50%)`
// 	return [ hue, 100, 50 ]
// }

// function get_rgb_color (weight, color1 = [ 255, 213, 0 ], color2 = [ 15, 0, 112 ]) {
// 	var w1 = weight
// 	var w2 = 1 - w1
// 	var rgb = [
// 		Math.round(color1[0] * w1 + color2[0] * w2),
// 		Math.round(color1[1] * w1 + color2[1] * w2),
// 		Math.round(color1[2] * w1 + color2[2] * w2)
// 	]
// 	console.log('rgb', rgb)
// 	return rgb
// 	// return `rgb(${r}, ${g}, ${b})`
// }

// function rgb_to_hex (rgb) {
// 	var hex = Number(rgb).toString(16)
// 	if (hex.length < 2) {
// 		hex = '0' + hex
// 	}
// 	return hex
// }

// function get_hex_color (weight) {
// 	let hex_string = ''
// 	for (const rgb_value of get_rgb_color(weight)) {
// 		hex_string += rgb_to_hex(rgb_value)
// 	}
// 	return parseInt(hex_string, 16)
// }

function get_hex_color (weight) {
	const color_1 = [ 255, 213, 0 ]
	const color_2 = [ 15, 0, 112 ]
	const w2 = 1 - weight
	const r = Math.round(color_1[1] * weight + color_2[1] * w2)
	const g = Math.round(color_1[0] * weight + color_2[0] * w2)
	const b = Math.round(color_1[2] * weight + color_2[2] * w2)
	return (~~r << 16) | (~~g << 8) | ~~b
}

function rgb_to_hex (r, g, b) {
	return (~~r << 16) | (~~g << 8) | ~~b
}

// function get_hex_color (val) {
// 	const min = 0
// 	const max = 1
// 	const colors = [ [ 255, 0, 0 ], [ 0, 255, 0 ] ]
// 	const i_f = (val - min) / (max - min) * (colors.length - 1)
// 	const i = ~~i_f
// 	const f = i_f % 1
// 	// console.log('[js] i_f, i, f :', i_f, i, f)
// 	// console.log('[js] EPSILON :', Number.EPSILON)
// 	if (f < Number.EPSILON) {
// 		// console.log('[js] rgb {epsilon} : ', ...colors[i])
// 		return rgb_to_hex(colors[i][0], colors[i][1], colors[i][2])
// 	}
// 	else {
// 		const color_1 = colors[i]
// 		const color_2 = colors[i + 1]
// 		const r = ~~(color_1[0] + f * (color_2[0] - color_1[0]))
// 		const g = ~~(color_1[1] + f * (color_2[1] - color_1[1]))
// 		const b = ~~(color_1[2] + f * (color_2[2] - color_1[2]))
// 		// console.log('[js] rgb :', r, g, b)
// 		return rgb_to_hex(r, g, b)
// 	}
// }

function iteration (z, c) {
	const real = z[0] ** 2 + z[1] ** 2 * -1 + c[0]
	const imaginary = 2 * z[0] * z[1] + c[1]
	return [ real, imaginary ]
}

export default function mandelbrot (boundary, iterations, c_re, c_im) {
	let z = [ 0, 0 ]
	for (let i = 0; i < iterations; i++) {
		z = iteration(z, [ c_re, c_im ])
		if (Math.abs(z[0]) > boundary || Math.abs(z[1]) > boundary) {
			// return hslToHex(get_hsl_color(i / iterations * 100))
			return get_hex_color(i / iterations * 15)
		}
	}
	return 0xff000000
}

// export default mandelbrot

// if __name__ == '__main__':
//     minval, maxval = 1, 3
//     steps = 10
//     delta = float(maxval-minval) / steps
//     colors = [(0, 0, 255), (0, 255, 0), (255, 0, 0)]  # [BLUE, GREEN, RED]
//     print('  Val       R    G    B')
//     for i in range(steps+1):
//         val = minval + i*delta
//         r, g, b = convert_to_rgb(minval, maxval, val, colors)
//         print('{:.3f} -> ({:3d}, {:3d}, {:3d})'.format(val, r, g, b))

// const a = 0.257
// console.log('[js] hex color :', get_hex_color(a))
