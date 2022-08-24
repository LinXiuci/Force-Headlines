/**
 * @desc 函数节流
 * @param fu (function) 函数
 * @param delay (number) 延迟执行毫秒数
 */
export function throttle(fn: Function, delay: number) {
  let timer: any // 计时器
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        fn()
      }, delay)
    }
  }
}
