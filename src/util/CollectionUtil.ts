import {shuffle as s} from '@tonaljs/collection'

/**
 * shuffle in-place
 * @param arr 
 */
 export function shuffle<T>(arr: T[]): T[] {
    return s([...arr])
  }

export function randomItem<T>(arr: T[]): T {
    if (arr.length === 0) {
        throw new Error('Array cannot be empty!')
    }
    return arr[Math.floor(Math.random() * arr.length)]
}