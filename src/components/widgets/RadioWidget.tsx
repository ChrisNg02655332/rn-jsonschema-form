import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'

import globalStyles from '../globalStyles'
import theme from '../theme'

const RadioWidget = (props: any) => {
  const { options, value, disabled, readonly, onChange, id } = props

  const { enumOptions, enumDisabled, inline } = options

  return (
    <View key={id} style={[styles.container, inline && styles.inline]}>
      {enumOptions.map((option: any, i: number) => {
        const checked = option.value === value

        const itemDisabled =
          enumDisabled && enumDisabled.indexOf(option.value) !== -1
        const disabledCls = disabled || itemDisabled || readonly

        return (
          <TouchableOpacity
            key={i}
            style={styles.radio}
            disabled={disabledCls}
            onPress={() => onChange(option.value)}
          >
            <Feather
              size={20}
              style={styles.icon}
              name={checked ? 'check-circle' : 'circle'}
              color={itemDisabled ? theme.border : theme.primary}
            />

            <Text style={globalStyles.text}>{option.label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    marginRight: 7,
  },
  inline: {
    flex: 1,
    flexDirection: 'row',
  },
})

export default RadioWidget
