export interface Task {
	readonly top: number
	readonly left: number
	readonly bot: number
	readonly right: number
	readonly pixel_length: number
	bytes: Uint8ClampedArray
}

export class Task implements Task {
	constructor (
		public readonly top: number,
		public readonly left: number,
		public readonly bot: number,
		public readonly right: number,
		public readonly pixel_length: number
	) {}
}

function shuffleArray (array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[ array[i], array[j] ] = [ array[j], array[i] ]
	}
}

type QueueItem = null | {
	next: QueueItem
	val: Task
}

export class Queue {
	private head: QueueItem
	private tail: QueueItem
	constructor () {
		this.head = null
		this.tail = null
	}
	public enq (val: Task) {
		if (this.head) {
			this.tail.next = { next: null, val }
			this.tail = this.tail.next
		}
		else {
			this.head = { next: null, val }
			this.tail = this.head
		}
	}
	public deq () {
		if (this.head) {
			const deqd = this.head
			if (this.head === this.tail) {
				this.head = null
				this.tail = null
			}
			else {
				this.head = this.head.next
			}
			return deqd.val
		}
	}
	public peek () {
		return this.head
	}
	public clear () {
		if (this.head) {
			this.head = null
			this.tail = null
		}
	}
}

export class QueueR {
	private arr: Task[]
	constructor () {
		this.arr = []
	}
	public enq (val: Task) {
		if (val) {
			this.arr.push(val)
		}
	}
	public deq () {
		if (this.arr[0]) {
			return this.arr.shift()
		}
	}
	public peek () {
		return this.arr[0]
	}
	public clear () {
		this.arr.length = 0
	}
	public shuffle () {
		for (let i = this.arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[ this.arr[i], this.arr[j] ] = [ this.arr[j], this.arr[i] ]
		}
	}
}
