import { useState, useEffect, useLayoutEffect, useRef } from 'react'

const useStateWithCallback = (initialState: any, callback: any) => {
  const [state, setState] = useState(initialState)

  useEffect(() => callback(state), [state, callback])

  return [state, setState]
}

const useStateWithCallbackInstant = (initialState: any, callback: any) => {
  const [state, setState] = useState(initialState)

  useLayoutEffect(() => callback(state), [state, callback])

  return [state, setState]
}

const useStateWithCallbackLazy = (initialValue: any) => {
  const callbackRef = useRef<any>(null)

  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(value)

      callbackRef.current = null
    }
  }, [value])

  const setValueWithCallback = (newValue: any, callback: any) => {
    callbackRef.current = callback

    return setValue(newValue)
  }

  return [value, setValueWithCallback]
}

export { useStateWithCallbackInstant, useStateWithCallbackLazy, useStateWithCallback }
