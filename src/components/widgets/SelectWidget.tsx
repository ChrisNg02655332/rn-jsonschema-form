import React from 'react'
import { View, Platform } from 'react-native'

// import { Picker } from '@react-native-picker/picker'
// import theme from '../theme'

import { asNumber, guessType } from '../../utils'

const nums = new Set(['number', 'integer'])

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
const processValue = (schema: any, value: any) => {
  // "enum" is a reserved word, so only "type" and "items" can be destructured
  const { type, items } = schema
  if (value === '') {
    return undefined
  } else if (type === 'array' && items && nums.has(items.type)) {
    return value.map(asNumber)
  } else if (type === 'boolean') {
    return value === 'true'
  } else if (type === 'number') {
    return asNumber(value)
  }

  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every((x: any) => guessType(x) === 'number')) {
      return asNumber(value)
    } else if (schema.enum.every((x: any) => guessType(x) === 'boolean')) {
      return value === 'true'
    }
  }

  return value
}

const getValue = (event: any, multiple: boolean) => {
  if (multiple) {
    return [].slice
      .call(event.target.options)
      .filter((o: any) => o.selected)
      .map((o: any) => o.value)
  } else {
    return event.target.value
  }
}

type Option = {
  value: string
  label: string
}

const SelectWidget = (props: any) => {
  const {
    schema,
    id,
    options,
    value,
    required,
    multiple,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    disabled,
    readonly,
  } = props

  const { enumOptions, enumDisabled } = options
  const emptyValue = multiple ? [] : ''

  return (
    <View nativeID={id}>
      {Platform.OS === 'web' ? (
        <select
          id={id}
          multiple={multiple}
          className="form-control"
          value={typeof value === 'undefined' ? emptyValue : value}
          required={required}
          disabled={disabled || readonly}
          autoFocus={autofocus}
          onBlur={
            onBlur &&
            ((event) => {
              const newValue = getValue(event, multiple)
              onBlur(id, processValue(schema, newValue))
            })
          }
          onFocus={
            onFocus &&
            ((event) => {
              const newValue = getValue(event, multiple)
              onFocus(id, processValue(schema, newValue))
            })
          }
          onChange={(event) => {
            const newValue = getValue(event, multiple)
            onChange(processValue(schema, newValue))
          }}
        >
          {!multiple && schema.default === undefined && (
            <option value="">{placeholder}</option>
          )}
          {enumOptions.map((option: Option, i: number) => {
            const _disabled =
              enumDisabled && enumDisabled.indexOf(option.value) !== -1
            return (
              <option key={i} value={option.value} disabled={_disabled}>
                {option.label}
              </option>
            )
          })}
        </select>
      ) : null}
    </View>
  )
}

// const styles = StyleSheet.create({
//   container: {
//     borderWidth: 1,
//     borderStyle: 'solid',
//     borderRadius: 4,
//     borderColor: theme.border,
//     paddingHorizontal: 7,
//     height: 38,
//     fontSize: 17,
//     marginBottom: 10,
//   },
// })

export default SelectWidget
