import React from 'react'
import { TextInput, TextInputProps, StyleSheet } from 'react-native'

import theme from '../theme'

type Props = TextInputProps & {
  options: any
  schema: any
  uiSchema: any
  formContext: any
  registry: any
  rawErrors: any
  type: string
  step: string
  onChange: (value: string) => void
}

const BaseInput = ({
  options,
  schema,
  onChange,
  rawErrors = [],
  ...rest
}: Props) => {
  console.log(rest.editable)

  let type = rest.type
  if (options.inputType) {
    type = options.inputType
  } else if (!type) {
    // If the schema is of type number or integer, set the input type to number
    if (schema.type === 'number') {
      type = 'number'
      // Setting step to 'any' fixes a bug in Safari where decimals are not
      // allowed in number inputs
      rest.step = 'any'
    } else if (schema.type === 'integer') {
      type = 'number'
      // Since this is integer, you always want to step up or down in multiples
      // of 1
      rest.step = '1'
    } else {
      type = 'text'
    }
  }

  const onChangeText = (value: string) => {
    return onChange && onChange(value === '' ? options.emptyValue : value)
  }

  return (
    <TextInput
      style={[styles.input, rest.style, rawErrors.length > 0 && styles.error]}
      onChangeText={onChangeText}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
    borderColor: theme.border,
    paddingHorizontal: 7,
    height: 38,
    fontSize: 17,
    marginBottom: 10,
  },
  error: {
    borderColor: theme.danger,
  },
})

export default BaseInput
