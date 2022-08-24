/**
 * @desc 函数防抖
 * @param fu (function) 函数
 * @param delay (number) 延迟执行毫秒数
 */
export function debounce(fn: Function, delay: number):any {
  let timer: any
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}
