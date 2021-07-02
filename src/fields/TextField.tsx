import React from 'react'
import {
  Text,
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'

import theme from '../theme'

type Props = TextInputProps & {
  title?: string
  containerStyles?: ViewStyle
  labelStyle?: TextStyle
  inputStyle?: TextStyle
  error?: boolean
  caption?: string
}

const TextField = ({
  title,
  containerStyles,
  labelStyle,
  inputStyle,
  error,
  caption,
  ...rest
}: Props) => {
  return (
    <View style={containerStyles}>
      {!!title && (
        <Text style={[styles.label, error && styles.error, labelStyle]}>
          {title}
        </Text>
      )}
      <TextInput
        style={[styles.input, error && styles.inputError, inputStyle]}
        {...rest}
      />
      {!!caption && (
        <Text style={[styles.caption, error && styles.error]}>{caption}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
    borderColor: theme.border,
    paddingHorizontal: 7,
    height: 38,
    fontSize: 17,
  },
  inputError: {
    borderColor: theme.danger,
  },
  caption: { marginTop: 5, fontSize: 13 },
  error: {
    color: theme.danger,
  },
})

export default TextField
