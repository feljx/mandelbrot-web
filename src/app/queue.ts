import { instance as config } from "./config";

function shuffleArray(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
	}
}

type QueueItem = null | {
	next: QueueItem
	val: Task
}

export class QueueR {
	private arr: Task[]
	constructor() {
		this.arr = []
	}
	public enq(vals: Task[]) {
		if (vals) {
			this.arr.push(...vals)
		}
	}
	public deq() {
		if (this.arr[0]) {
			return this.arr.shift()
		}
	}
	public peek() {
		return this.arr[0]
	}
	public clear() {
		this.arr.length = 0
	}
	public len() {
		return this.arr.length
	}
	public shuffle() {
		for (let i = this.arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
				;[this.arr[i], this.arr[j]] = [this.arr[j], this.arr[i]]
		}
	}
}


export class Task {
	bytes: Uint8ClampedArray
	constructor(
		public readonly px_ax_len: number,
		public readonly top: number,
		public readonly left: number,
		public readonly bot: number,
		public readonly right: number) { }
}


// CREATE TASKS
export function create_tasks(): Task[] {
	// top = first pixel y at task_length index
	// left = first pixel x at task_length index
	// bot = last pixel y before next task
	// right = last pixel x before next
	const task_len = Math.floor(config.px_height / config.task_num)
	const task_num_x = Math.ceil(config.px_width / task_len)
	const task_num_y = Math.ceil(config.px_height / task_len)
	const tasks = []

	// MOST TASKS
	for (let y = 0; y < task_num_y - 1; y++) {
		for (let x = 0; x < task_num_x - 1; x++) {
			tasks.push(new Task(
				config.px_ax_len,
				y * task_len - 1,
				x * task_len - 1,
				(y + 1) * task_len - 1,
				(x + 1) * task_len - 1
			))
		}
	}
	// LAST COLUMN EXCEPT LAST TASK
	for (let y = 0; y < task_num_y - 1; y++) {
		tasks.push(new Task(
			config.px_ax_len,
			y * task_len - 1,
			config.px_width - task_len,
			(y + 1) * task_len - 1,
			config.px_width
		))
	}
	// LAST ROW EXCEPT LAST TASK
	for (let x = 0; x < task_num_x - 1; x++) {
		tasks.push(new Task(
			config.px_ax_len,
			config.px_height - task_len,
			x * task_len - 1,
			config.px_height,
			(x + 1) * task_len - 1
		))
	}
	// LAST TASK
	const last_task = new Task(
		config.px_ax_len,
		(task_num_y - 1) * task_len - 1,
		(task_num_x - 1) * task_len - 1,
		config.px_height,
		config.px_width
	)
	tasks.push(last_task)
	return tasks
}


export interface TaskMessage {
	readonly task: Task
	readonly px_len: number
}


// export class QueueL {
// 	private head: QueueItem
// 	private tail: QueueItem
// 	constructor() {
// 		this.head = null
// 		this.tail = null
// 	}
// 	public enq(val: Task) {
// 		if (this.head) {
// 			this.tail.next = { next: null, val }
// 			this.tail = this.tail.next
// 		}
// 		else {
// 			this.head = { next: null, val }
// 			this.tail = this.head
// 		}
// 	}
// 	public deq() {
// 		if (this.head) {
// 			const deqd = this.head
// 			if (this.head === this.tail) {
// 				this.head = null
// 				this.tail = null
// 			}
// 			else {
// 				this.head = this.head.next
// 			}
// 			return deqd.val
// 		}
// 	}
// 	public peek() {
// 		return this.head
// 	}
// 	public clear() {
// 		if (this.head) {
// 			this.head = null
// 			this.tail = null
// 		}
// 	}
// }
