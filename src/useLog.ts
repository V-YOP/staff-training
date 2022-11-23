import { z } from "zod"

const LOG_PREFIX = 'LOG:'

/**
 * Log Key to corresponding Type, Key is used for Log Key
 */
const LogType = z.object({
  KeyRecognize: z.object({
    // TODO
  })
  // TODO
})

type LogType = z.infer<typeof LogType>

type LogKey = keyof LogType


type LogHook<T extends LogKey> = {
  append: (data: LogType[T]) => void
  // TODO get log
}
/**
 * Used To Append Structured Log in Local Storage in an effort to do statistic.
 * 
 * It can be static ...?
 */
export function useLog<T extends LogKey>(logKey: T): LogHook<T> {
  const realKey = `${LOG_PREFIX}${logKey}`
  return {
    append(data) {
      setTimeout(() => {
        const srcStor = JSON.parse(localStorage.getItem(realKey) ?? '[]') as T[]
        // TODO type validation
        localStorage.setItem(realKey, JSON.stringify([data, ...srcStor]))
      })
    }
  }
}
