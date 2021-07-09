import React, { ReactElement } from 'react'
import { View, Text } from 'react-native'

type Props = {
  id: string
  description?: string | ReactElement
}

const DescriptionField = ({ id, description }: Props) => {
  if (description === undefined) {
    return null
  }
  if (typeof description === 'string') {
    return <Text key={id}>{description}</Text>
  } else {
    return <View key={id}>{description}</View>
  }
}

export default DescriptionField
