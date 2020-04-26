function debounce (func: (ev: Event) => any, wait: number, immediate: boolean) {
	var timeout: NodeJS.Timeout | number | null
	let args: any
	let context: any
	let timestamp: any
	let result: any
	if (null == wait) wait = 100

	function later () {
		var last = Date.now() - timestamp

		if (last < wait && last >= 0) {
			timeout = setTimeout(later, wait - last)
		}
		else {
			timeout = null
			if (!immediate) {
				result = func.apply(context, args)
				context = args = null
			}
		}
	}

	var debounced: any = function () {
		context = this
		args = arguments
		timestamp = Date.now()
		var callNow = immediate && !timeout
		if (!timeout) timeout = setTimeout(later, wait)
		if (callNow) {
			result = func.apply(context, args)
			context = args = null
		}

		return result
	}

	debounced.clear = function () {
		if (timeout) {
			clearTimeout(timeout)
			timeout = null
		}
	}

	debounced.flush = function () {
		if (timeout) {
			result = func.apply(context, args)
			context = args = null

			clearTimeout(timeout)
			timeout = null
		}
	}

	return debounced
}

export default debounce
