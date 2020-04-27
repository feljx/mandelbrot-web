// Throttle.

function throttle(func: Function, limit: number) {
	// @ts-ignore
	let inThrottle: NodeJS.Timeout | boolean
	return function (...args: any[]) {
		if (!inThrottle) {
			func(...args)
			inThrottle = setTimeout(() => (inThrottle = false), limit)
		}
	}
}

export default throttle
