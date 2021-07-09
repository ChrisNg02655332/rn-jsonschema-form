import React from 'react'
import { View, Text } from 'react-native'
import globalStyles from '../globalStyles'

const REQUIRED_FIELD_SYMBOL = '*'

type Props = {
  id?: string
  title?: string
  required?: boolean
}

function TitleField({ id, title, required = false }: Props) {
  return (
    <View key={id}>
      <Text>{title}</Text>
      {required && (
        <Text style={globalStyles.required}>{REQUIRED_FIELD_SYMBOL}</Text>
      )}
    </View>
  )
}

export default TitleField
