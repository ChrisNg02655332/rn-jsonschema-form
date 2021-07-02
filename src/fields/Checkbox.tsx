import React from 'react'
import {
  Text,
  TouchableOpacity,
  TextStyle,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'

import theme from '../theme'

type Props = {
  value?: boolean
  title?: string
  color?: string
  onPress?: () => void
  disabled?: boolean
  containerStyle?: ViewStyle
  labelStyle?: TextStyle
}

const Checkbox = ({
  value,
  title,
  color,
  onPress,
  disabled = false,
  labelStyle,
  containerStyle,
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, disabled && styles.disabled, containerStyle]}
      onPress={onPress}
    >
      <Feather
        name={value ? 'check-square' : 'square'}
        size={20}
        color={disabled ? theme.border : color || theme.primary}
      />
      {title && <Text style={[styles.label, labelStyle]}>{title}</Text>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 17,
    marginLeft: 7,
  },
  disabled: {
    borderColor: theme.border,
  },
})

export default Checkbox
