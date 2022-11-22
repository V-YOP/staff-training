import { useReducer } from "react"

const STORAGE_KEY = 'CUSTOM_STORAGE'

export function useLocalStorage<T>(itemName: string, defaultValue: T): [T, (newValue: T | ((oldValue: T) => T)) => void] {
  const [, plus] = useReducer(c => c + 1, 0)

  const objects = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  const oldValue = objects[itemName] ?? defaultValue

  const setItem : (newValue: T | ((oldValue: T) => T)) => void = valueOrAction => {
    let newValue;
    if (valueOrAction instanceof Function) {
      newValue = valueOrAction(oldValue)
    } else {
      newValue = valueOrAction
    }
    objects[itemName] = newValue
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objects))
    plus()
  }
  if (!objects[itemName]) {
    setItem(defaultValue)
  }

  return [objects[itemName] ?? defaultValue, setItem]
}