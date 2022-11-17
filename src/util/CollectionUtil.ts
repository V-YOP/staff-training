/**
 * shuffle in-place
 * @param arr 
 */
 export function shuffle<T>(arr: T[]): void {
    let n = arr.length,
    tmp,
    random
    while(n != 0){
      random = Math.floor(Math.random() * n)
      n-- // n减一
      // 交换
      tmp = arr[n]
      arr[n] = arr[random]
      arr[random] = tmp
    }
  }

export function randomItem<T>(arr: T[]): T {
    if (arr.length === 0) {
        throw new Error('Array cannot be empty!')
    }
    return arr[Math.floor(Math.random() * arr.length)]
}