import React from 'react'
import { Text, View } from 'react-native'

export { DescriptionField }

type DescriptionFieldProps = {
  id: string
  description?: string | React.ReactElement
}

function DescriptionField({ id, description }: DescriptionFieldProps) {
  if (!description) return null
  if (typeof description === 'string') return <Text>{description}</Text>
  return <View>{description as any}</View>
}
