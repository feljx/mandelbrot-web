import { Config } from './config'
import { Task } from './queue'
import mandel_ts from '../mandel/mandel'

interface Message {
	config: Config
	mod: WebAssembly.Module
}

let config: Config
let mod: WebAssembly.Module

function calc (ev: MessageEvent) {
	const task: Task = ev.data
	const pixel_bytes = mandel_ts(
		config.px_width,
		config.px_height,
		task.px_ax_len,
		config.iter_max,
		task.top,
		task.left,
		task.bot,
		task.right
	)
	task.bytes = pixel_bytes
	// @ts-ignore
	self.postMessage(task, [ task.bytes.buffer ])
}

self.onmessage = function handle_first_message (ev: MessageEvent) {
	// assign global config
	;[ config, mod ] = ev.data
	// replace message handler
	self.onmessage = calc
}

// // instantiate wasm module
// WebAssembly.instantiate(data.module_buffer, {}).then(function (instance) {
// 	const m = (instance as unknown) as WebAssembly.Instance
// 	calc_mandelbrot_c = m.exports.calc_mandelbrot as mandelbrot_c
// 	const memory = m.exports.memory as WebAssembly.Memory

// 	const bytes = config.pixel_num * 4
// 	const page = 1024 * 64
// 	const extra_pages = Math.ceil(bytes / page)

// 	memory.grow(extra_pages)

// 	const base_ptr = calc_mandelbrot_c(
// 		config.real_width,
// 		config.real_height,
// 		config.pixel_length,
// 		config.iterations,
// 		worker_num,
// 		worker_idx
// 	)
// 	const pixels = new Uint32Array(memory.buffer.slice(base_ptr, base_ptr + bytes))
// 	// @ts-ignore
// 	self.postMessage(pixels)
// })
