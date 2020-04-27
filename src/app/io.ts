import throttle from './throttle'
import debounce from './debounce'
import { instance as config, zoom, move } from './config'

export function zoom_throttled(callback: Function) {
    return throttle(function (ev: WheelEvent) {
        if (ev.deltaY < 0) {
            // zoom in
            zoom(config, config.zoom_fact + 1)
            console.log(`${config.zoom_fact * 100}% Zoom`)
            callback()
            // console.log(e.clientX, e.clientY)
        }
        else {
            // zoom out
            if (config.zoom_fact > 1) {
                zoom(config, config.zoom_fact - 1)
                console.log(`${config.zoom_fact * 100}% Zoom`)
                callback()
            }
            // console.log(e.clientX, e.clientY)
        }
    }, 50)
}


export function debounced_zoom(callback: Function) {
    return debounce(function (ev: WheelEvent) {
        if (ev.deltaY < 0) {
            // zoom in
            console.log(config.zoom_fact)
            zoom(config, config.zoom_fact + 1)
            console.log(config.zoom_fact)
            callback()
            // console.log(e.clientX, e.clientY)
        }
        else {
            // zoom out
            if (config.zoom_fact > 1) {
                console.log(config.zoom_fact)
                zoom(config, config.zoom_fact - 1)
                console.log(config.zoom_fact)
                callback()
            }
            // console.log(e.clientX, e.clientY)
        }
    },
        1000,
        true
    )
}