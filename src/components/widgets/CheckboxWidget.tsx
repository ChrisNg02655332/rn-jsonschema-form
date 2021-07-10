import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import globalStyles from '../globalStyles'
import theme from '../theme'

const CheckboxWidget = (props: any) => {
  const {
    schema,
    id,
    value,
    disabled,
    readonly,
    label,
    // autofocus,
    // onBlur,
    // onFocus,
    onChange,
    DescriptionField,
  } = props
  return (
    <View>
      {schema.description && (
        <DescriptionField description={schema.description} />
      )}

      <TouchableOpacity
        key={id}
        disabled={disabled || readonly}
        onPress={() => onChange(!value)}
      >
        <View style={styles.content}>
          <Feather
            style={styles.icon}
            name={value ? 'check-square' : 'square'}
            size={20}
            color={disabled ? theme.border : theme.primary}
          />
          <Text style={globalStyles.text}>{label}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  icon: {
    marginRight: 7,
  },
})

export default CheckboxWidget
