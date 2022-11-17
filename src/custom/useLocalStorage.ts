const STORAGE_KEY = 'storage'

export function useLocalStorage<T extends object>(itemName: string, defaultValue: T): [T, (newValue: T | ((oldValue: T) => T)) => void] {
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
  }
  if (!objects[itemName]) {
    setItem(defaultValue)
  }

  return [objects[itemName] ?? defaultValue, setItem]
}