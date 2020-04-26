// import Mandelbrot from './mandelbrot.js'
import mandelbrot from './mandel.js'

function get_wasm_pointer (module) {
	const [ boundary, iterations, complex_number ] = [ 2, 5000, [ 0.2, -0.55 ] ]
	module._mandelbrot(boundary, iterations, complex_number)
}

function get_wasm_data (module, pointer, type) {
	return module.getValue(pointer, type)
}

function get_result (module, type) {
	const p = get_wasm_pointer(module)
	const data = get_wasm_data(module, p, type)
	module._free(p)
	return data
}

// Mandelbrot().then(function (module) {
// 	window.m = module
// 	const res = get_result(module, 'i64')
// 	console.log(res)
// })

const boundary = 2
const iterations = 5000
const complex_number = [ 0.2, -0.55 ]

fetch('foo.wasm')
	.then(function (response) {
		return WebAssembly.instantiateStreaming(response, {})
	})
	.then(function (module) {
		window.m = module
		console.time()
		const js_res = mandelbrot(boundary, iterations, complex_number)
		console.timeEnd()
		console.time()
		const wasm_res = module.instance.exports.mandelbrot(
			boundary,
			iterations,
			...complex_number
		)
		const wasm_iterations = module.instance.exports.mandelbrot2(
			boundary,
			iterations,
			...complex_number
		)
		console.timeEnd()
		console.log('[js] result:', js_res)
		console.log('[c]  result:', wasm_res, wasm_iterations)
	})
