import React from 'react'
import { Text, StyleSheet, TextStyle } from 'react-native'

type Props = {
  text?: string
  style?: TextStyle
}

const Description = ({ text, style }: Props) => {
  return text ? <Text style={[styles.text, style]}>{text}</Text> : null
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
})

export default Description
