import { ConfigI } from './config'
import calc_mandelbrot_ts from './mandelbrot'
import { Task } from './queue'

interface WorkerData {
	readonly message: string
	readonly module_buffer?: WebAssembly.Module
	readonly config?: ConfigI
	readonly pixel_length?: number
	readonly worker_num?: number
	readonly worker_idx?: number
	readonly idx_start?: number
	readonly idx_end?: number
}

type mandelbrot_c = (
	width: number,
	height: number,
	pixel_length: number,
	max_iter: number,
	worker_num: number,
	worker_idx: number
) => number

let config: ConfigI

function calc (ev: MessageEvent) {
	const task: Task = ev.data
	const pixel_bytes = calc_mandelbrot_ts(
		config.real_width,
		config.real_height,
		task.pixel_length,
		config.iterations,
		task.top,
		task.left,
		task.bot,
		task.right
	)
	task.bytes = pixel_bytes

	// @ts-ignore
	self.postMessage(task, [ task.bytes.buffer ])
}

function handle_first_message (ev: MessageEvent) {
	const _config: ConfigI = ev.data
	config = _config
	self.onmessage = calc
}

self.onmessage = handle_first_message

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
