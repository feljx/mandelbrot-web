// @ts-ignore
import mandelbrot_url from 'url:../mandel/mandel.wasm'
import { Config, instance as config } from './config'
import { Task, QueueR, create_tasks } from './queue'
import { zoom_throttled } from './io'

// DEBUG
console.log(mandelbrot_url)
console.log(config)
const TIMING = false

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
function load_workers (mod: WebAssembly.Module) {
	// create workers
	for (let i = 0; i < config.worker_num; i++) {
		const worker = new Worker('./worker.ts', { type: 'module' })

		// WORKER CALLBACK
		// EXECUTE TASKS
		function handle_msg (ev) {
			const task: Task = ev.data
			// if
			if (task.px_ax_len === config.px_ax_len) {
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
					// DEBUG: end render time stopwatch
					TIMING && console.timeEnd()
				}
			}
		}

		worker.addEventListener('message', handle_msg)
		// TODO: remove set_zoom method from config class
		worker.postMessage([ config, mod ])
		workers.push(worker)
	}
}

// RENDER
function px_idx_to_coord () {}
function px_coord_to_idx () {}

function render () {
	// DEBUG: Measure time for each render
	TIMING && console.time()
	// set global state calc_done to false
	render_done = false
	// clear task queue
	task_queue.clear()
	// ENQUEUE TASKS
	task_queue.enq(create_tasks())
	// SHUFFLE QUEUE
	task_queue.shuffle()
	// START QUEUE
	for (const worker of workers) {
		if (task_queue.peek()) {
			worker.postMessage(task_queue.deq())
		}
	}
}

// EVENT LISTENERS
window.addEventListener('wheel', zoom_throttled(render), { passive: false })

// const test_evs = [ 'pointermove', 'pointerdown' ]
// for (const evname of test_evs) {
// 	window.addEventListener(
// 		evname,
// 		(ev: TouchEvent) => {
// 			console.log(evname)
// 			ev.preventDefault()
// 		},
// 		{ passive: false }
// 	)
// }

// MAIN ENTRY POINT
wasm_has_compiled.then(function (mod) {
	load_workers(mod)
	render()
})
