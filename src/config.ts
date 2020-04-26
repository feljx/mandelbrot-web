export interface ConfigI {
	readonly iterations: number
	readonly width: number
	readonly height: number
	readonly pixel_ratio: number
	readonly pixel_num: number
	readonly real_width: number
	readonly real_height: number
	readonly axis_length_y: number
	readonly axis_length_x: number
	readonly pixel_length: number
	worker_num: number
	zoom_factor: number
	task_num: number
}

class Config implements ConfigI {
	readonly width
	readonly height
	readonly pixel_ratio
	readonly real_width
	readonly real_height
	readonly pixel_num
	readonly axis_length_x
	pixel_length

	constructor (
		public readonly iterations: number,
		public zoom_factor: number,
		public worker_num: number,
		public task_num: number,
		public readonly axis_length_y: number
	) {
		this.width = window.innerWidth
		this.height = window.innerHeight
		this.pixel_ratio = window.devicePixelRatio
		this.real_width = ~~(this.width * this.pixel_ratio)
		this.real_height = ~~(this.height * this.pixel_ratio)
		this.pixel_num = this.real_height * this.real_width

		this.axis_length_x = this.axis_length_y * (this.real_width / this.real_height)
		this.pixel_length =
			this.axis_length_y /
			this.real_height /
			Math.max(this.zoom_factor - 1, 1) *
			0.8
	}

	set_zoom (n: number) {
		this.zoom_factor = n
		this.pixel_length = Math.abs(
			this.axis_length_y / this.real_height / this.zoom_factor
		)
	}
}

const iterations = 2000
const zoom_factor = 1
const high_end_device = navigator.hardwareConcurrency > 4
const worker_num = navigator.hardwareConcurrency * (high_end_device ? 2 : 1)
// const worker_num = 6
const task_num = high_end_device ? 44 : 16
// TODO: implement zoom
const axis_length_y = 4
const instance = new Config(iterations, zoom_factor, worker_num, task_num, axis_length_y)

export default instance
