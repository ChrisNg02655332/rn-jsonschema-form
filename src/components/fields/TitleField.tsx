import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import globalStyles from '../globalStyles'
import theme from '../theme'

const REQUIRED_FIELD_SYMBOL = '*'

type Props = {
  id?: string
  title?: string
  required?: boolean
}

function TitleField({ id, title, required = false }: Props) {
  return title ? (
    <View key={id} nativeID={id} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {required && (
        <Text style={globalStyles.required}>{REQUIRED_FIELD_SYMBOL}</Text>
      )}
    </View>
  ) : null
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingBottom: 10,
    borderColor: theme.border,
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
})

export default TitleField
