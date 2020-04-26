import config, { ConfigI } from './config'
import debounce from './debounce'
import { Task, Queue, QueueR } from './queue'
import throttle from './throttle'

// @ts-ignore
import mandelbrot_url from 'url:./foo.wasm'

// DEBUG
console.log(mandelbrot_url)
console.log(config)

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

interface TaskMessage {
	readonly task: Task
	readonly pixel_length: number
}

const WASM_PATH = 'foo.wasm'
const wasm_has_compiled = WebAssembly.compileStreaming(fetch(mandelbrot_url))

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
let pixel_data: ImageData
let pixel_buffer: Uint32Array
let workers: Worker[] = []
const task_queue = new QueueR()

function init () {
	// canvas.width = config.width * scale
	// canvas.height = config.height * scale
	const scale = window.devicePixelRatio
	canvas.width = config.width * scale
	canvas.height = config.height * scale
	canvas.style.width = `${window.innerWidth}px`
	canvas.style.height = `${window.innerHeight}px`
	// context scaling has to happen after canvas config
	// context.scale(scale, scale)
	// context.fillStyle = 'black'

	pixel_data = context.createImageData(config.real_width, config.real_height)
	pixel_buffer = new Uint32Array(pixel_data.data.buffer)
}

let calc_done: boolean

function load_workers (mod: WebAssembly.Module) {
	for (let i = 0; i < config.worker_num; i++) {
		const worker = new Worker('./worker.ts', { type: 'module' })

		// WORKER CALLBACK
		worker.addEventListener('message', function (ev) {
			const task: Task = ev.data
			if (task.pixel_length === config.pixel_length) {
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

			if (!!task_queue.peek()) {
				const task = task_queue.deq()
				worker.postMessage(task)
			}
			else {
				if (!calc_done) {
					calc_done = true
					console.timeEnd()
					// const red_box = new Uint32Array(100 * 100).fill(0xffff0000)
					// context.putImageData(red_box, 400, 600)
				}
			}
		})

		// TODO: remove set_zoom method from config class
		worker.postMessage(config)
		workers.push(worker)
	}
}

function px_idx_to_coord () {}

function px_coord_to_idx () {}

function render () {
	// Measure time for each render
	console.time()
	// set global state calc_done to false
	calc_done = false

	// clear task queue
	task_queue.clear()

	// create tasks for queue
	const task_length = Math.floor(config.real_height / config.task_num)
	const task_num_x = Math.ceil(config.real_width / task_length)
	const task_num_y = Math.ceil(config.real_height / task_length)
	for (let y = 0; y < task_num_y - 1; y++) {
		for (let x = 0; x < task_num_x - 1; x++) {
			/*	top = first pixel y at task_length index
				left = first pixel x at task_length index
				bot = last pixel y before next task
				right = last pixel x before next	*/
			const new_task = new Task(
				y * task_length - 1,
				x * task_length - 1,
				(y + 1) * task_length - 1,
				(x + 1) * task_length - 1,
				config.pixel_length
			)
			task_queue.enq(new_task)
		}
	}
	// create tasks in last column (except very last task)
	for (let y = 0; y < task_num_y - 1; y++) {
		const new_task = new Task(
			y * task_length - 1,
			config.real_width - task_length,
			(y + 1) * task_length - 1,
			config.real_width,
			config.pixel_length
		)
		task_queue.enq(new_task)
	}
	// create tasks in last row (except very last task)
	for (let x = 0; x < task_num_x - 1; x++) {
		const new_task = new Task(
			config.real_height - task_length,
			x * task_length - 1,
			config.real_height,
			(x + 1) * task_length - 1,
			config.pixel_length
		)
		task_queue.enq(new_task)
	}
	// create very last task (last row, last column)
	const last_task = new Task(
		(task_num_y - 1) * task_length - 1,
		(task_num_x - 1) * task_length - 1,
		config.real_height,
		config.real_width,
		config.pixel_length
	)
	task_queue.enq(last_task)
	task_queue.shuffle()

	// initiate worker queue
	for (const worker of workers) {
		if (task_queue.peek()) {
			worker.postMessage(task_queue.deq())
		}
	}
}
/* 
function calc_screen () {
	calc_done = false
	queue.clear()
	console.time()
	const task_size = Math.ceil(config.pixel_num / config.task_num)
	const task_num_one_less = config.task_num - 1
	const tasks: Task[] = new Array(task_num_one_less)
		.fill(undefined)
		.map((_, i) => new Task(i * task_size, task_size, config.pixel_length))
	const last_task = new Task(
		task_num_one_less * task_size,
		config.pixel_num - task_num_one_less * task_size,
		config.pixel_length
	)
	tasks.push(last_task)
	shuffleArray(tasks)
	queue.enqueue(tasks)

	console.log(queue)

	for (const worker of workers) {
		const task = queue.pop()
		worker.postMessage(task)
	}
}
 */
wasm_has_compiled.then(function (mod) {
	init()
	load_workers(mod)
	render()
})

// pixel_buffer.fill(0xff77a832)
// context.putImageData(pixel_data, 0, 0)

const zoom_throttled = throttle(function (ev: WheelEvent) {
	if (ev.deltaY < 0) {
		// zoom in
		config.set_zoom(config.zoom_factor + 1)
		console.log(`${config.zoom_factor * 100}% Zoom`)
		render()
		// console.log(e.clientX, e.clientY)
	}
	else {
		// zoom out
		if (config.zoom_factor > 1) {
			config.set_zoom(config.zoom_factor - 1)
			console.log(`${config.zoom_factor * 100}% Zoom`)
			render()
		}
		// console.log(e.clientX, e.clientY)
	}
}, 50)

const debounced_zoom = debounce(
	function (ev: WheelEvent) {
		if (ev.deltaY < 0) {
			// zoom in
			console.log(config.zoom_factor)
			config.set_zoom(config.zoom_factor + 1)
			console.log(config.zoom_factor)
			render()
			// console.log(e.clientX, e.clientY)
		}
		else {
			// zoom out
			if (config.zoom_factor > 1) {
				console.log(config.zoom_factor)
				config.set_zoom(config.zoom_factor - 1)
				console.log(config.zoom_factor)
				render()
			}
			// console.log(e.clientX, e.clientY)
		}
	},
	1000,
	true
)

window.addEventListener('wheel', zoom_throttled)
