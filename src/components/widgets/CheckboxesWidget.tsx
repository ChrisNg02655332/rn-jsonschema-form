import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import globalStyles from '../globalStyles'
import theme from '../theme'

const CheckboxesWidget = (props: any) => {
  const { id, disabled, options, readonly, onChange } = props
  const { enumOptions, enumDisabled, inline } = options

  return (
    <View key={id} style={[styles.container, inline && styles.inline]}>
      {enumOptions.map((option: any, index: number) => {
        const itemDisabled =
          enumDisabled && enumDisabled.indexOf(option.value) !== -1
        const isDisabled = disabled || itemDisabled || readonly
        const checkbox = (
          <TouchableOpacity
            key={id}
            disabled={isDisabled}
            onPress={() => {
              // const all = enumOptions.map((item: any) => item.value)
              const values: Array<string> = props.value || []
              const exist = values.indexOf(option.value)
              if (exist !== -1) values.splice(exist, 1)
              else values.push(option.value)
              onChange(values)
            }}
          >
            <View style={styles.content}>
              <Feather
                name={
                  props.value?.includes(option.value)
                    ? 'check-square'
                    : 'square'
                }
                size={20}
                color={disabled ? theme.border : theme.primary}
              />
              <Text style={[globalStyles.text, styles.text]}>
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        )
        return (
          <View style={styles.wrap} key={index}>
            {checkbox}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginVertical: 15 },
  wrap: { marginRight: 15, marginBottom: 7 },
  content: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  text: { marginLeft: 7 },
  inline: {
    flex: 1,
    flexDirection: 'row',
  },
})

export default CheckboxesWidget
