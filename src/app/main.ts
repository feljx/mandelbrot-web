import { Config, instance as config } from './config'
import { Queue, QueueR } from './queue'


// @ts-ignore
import mandelbrot_url from 'url:../mandel/mandel.wasm'
import { zoom_throttled } from './io'

// DEBUG
console.log(mandelbrot_url)
console.log(config)

export class Task {
	bytes: Uint8ClampedArray
	constructor(
		public readonly px_len: number,
		public readonly top: number,
		public readonly left: number,
		public readonly bot: number,
		public readonly right: number) { }
}

interface TaskMessage {
	readonly task: Task
	readonly px_len: number
}

// GLOBALS
const wasm_has_compiled = WebAssembly.compileStreaming(fetch(mandelbrot_url))
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const task_queue = new QueueR()
const workers: Worker[] = []
let render_done: boolean
// const pixel_data = context.createImageData(config.px_width, config.px_height)
// const pixel_buffer = new Uint32Array(pixel_data.data.buffer)

// CANVAS INIT
canvas.width = config.px_width
canvas.height = config.px_height
canvas.style.width = `${window.innerWidth}px`
canvas.style.height = `${window.innerHeight}px`

// LOAD WORKERS
function load_workers(mod: WebAssembly.Module) {
	for (let i = 0; i < config.worker_num; i++) {
		const worker = new Worker('./worker.ts', { type: 'module' })

		// WORKER CALLBACK
		worker.addEventListener('message', function (ev) {
			const task: Task = ev.data
			if (task.px_len === config.px_len) {
				window.requestAnimationFrame(function () {
					context.putImageData(
						new ImageData(
							task.bytes,
							task.right - task.left,
							task.bot - task.top
						),
						task.left,
						task.top
					)
				})
			}

			// if task queue is not empty
			if (task_queue.peek()) {
				const task = task_queue.deq()
				worker.postMessage(task)
			}
			else {
				// set global render_done variable to true
				if (!render_done) {
					render_done = true
					console.timeEnd()
				}
			}
		})

		// TODO: remove set_zoom method from config class
		worker.postMessage([config, mod])
		workers.push(worker)
	}
}

// RENDER
function px_idx_to_coord() { }

function px_coord_to_idx() { }

function render() {
	// Measure time for each render
	console.time()
	// set global state calc_done to false
	render_done = false

	// clear task queue
	task_queue.clear()

	// create tasks for queue
	const task_length = Math.floor(config.px_height / config.task_num)
	const task_num_x = Math.ceil(config.px_width / task_length)
	const task_num_y = Math.ceil(config.px_height / task_length)
	for (let y = 0; y < task_num_y - 1; y++) {
		for (let x = 0; x < task_num_x - 1; x++) {
			/*	top = first pixel y at task_length index
				left = first pixel x at task_length index
				bot = last pixel y before next task
				right = last pixel x before next	*/
			const new_task = new Task(
				config.px_len,
				y * task_length - 1,
				x * task_length - 1,
				(y + 1) * task_length - 1,
				(x + 1) * task_length - 1
			)
			task_queue.enq(new_task)
		}
	}
	// LAST COLUMN EXCEPT LAST TASK
	for (let y = 0; y < task_num_y - 1; y++) {
		const new_task = new Task(
			config.px_len,
			y * task_length - 1,
			config.px_width - task_length,
			(y + 1) * task_length - 1,
			config.px_width
		)
		task_queue.enq(new_task)
	}
	// LAST ROW EXCEPT LAST TASK
	for (let x = 0; x < task_num_x - 1; x++) {
		const new_task = new Task(
			config.px_len,
			config.px_height - task_length,
			x * task_length - 1,
			config.px_height,
			(x + 1) * task_length - 1
		)
		task_queue.enq(new_task)
	}
	// LAST TASK
	const last_task = new Task(
		config.px_len,
		(task_num_y - 1) * task_length - 1,
		(task_num_x - 1) * task_length - 1,
		config.px_height,
		config.px_width
	)
	task_queue.enq(last_task)
	task_queue.shuffle()

	// START QUEUE
	for (const worker of workers) {
		if (task_queue.peek()) {
			worker.postMessage(task_queue.deq())
		}
	}
}


// EVENT LISTENERS
window.addEventListener('wheel', zoom_throttled(render))


// MAIN ENTRY POINT
wasm_has_compiled.then(function (mod) {
	load_workers(mod)
	render()
})
