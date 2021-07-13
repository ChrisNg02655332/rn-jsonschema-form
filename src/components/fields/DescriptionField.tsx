import React, { ReactElement } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import globalStyles from '../globalStyles'

type Props = {
  id: string
  description?: string | ReactElement
}

const DescriptionField = ({ id, description }: Props) => {
  if (description === undefined) {
    return null
  }
  if (typeof description === 'string') {
    return (
      <Text nativeID={id} style={[globalStyles.text, styles.text]} key={id}>
        {description}
      </Text>
    )
  } else {
    return <View key={id}>{description}</View>
  }
}

const styles = StyleSheet.create({
  text: { marginBottom: 10 },
})

export default DescriptionField
