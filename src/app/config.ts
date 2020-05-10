const BEEFY_DEVICE = navigator.hardwareConcurrency > 4
// Initial Config
const ITER_MAX = 2000
const ZOOM_FACT = 1
const WORKER_NUM = navigator.hardwareConcurrency * (BEEFY_DEVICE ? 2 : 1)
const TASK_NUM = BEEFY_DEVICE ? 44 : 8
const AXIS_LEN_Y = 4
// Constructor args
type ConstructorArgs = [number, number, number, number, number]
const INITIAL_ARGS: ConstructorArgs = [
	ITER_MAX,
	ZOOM_FACT,
	WORKER_NUM,
	TASK_NUM,
	AXIS_LEN_Y
]

// Implementation
export class Config {
	public iter_max: number
	public zoom_fact: number
	public px_width: number
	public px_height: number
	public px_num: number
	public px_ax_len: number
	public axis_len_x: number
	public axis_len_y: number
	public worker_num: number
	public task_num: number

	constructor (
		iter_max: number,
		zoom_fact: number,
		worker_num: number,
		task_num: number,
		axis_len_y: number
	) {
		this.iter_max = iter_max
		this.zoom_fact = zoom_fact
		this.px_width = ~~(window.innerWidth * window.devicePixelRatio)
		this.px_height = ~~(window.innerHeight * window.devicePixelRatio)
		this.px_num = this.px_width * this.px_height
		this.px_ax_len = axis_len_y / this.px_height
		this.axis_len_x = axis_len_y * (this.px_width / this.px_height)
		this.axis_len_y = axis_len_y
		this.worker_num = worker_num
		this.task_num = task_num
	}
}

export function zoom (c: Config, n: number) {
	c.zoom_fact = n
	c.px_ax_len = Math.abs(
		c.axis_len_y / c.px_height / 1.16 ** (c.zoom_fact - 1)
	)
}

export function move (c: Config, x: number, y: number) {}

export const instance = new Config(...INITIAL_ARGS)
