import * as React from 'react'
import {
  StyleSheet,
  TextStyle,
  View,
  Easing,
  ViewStyle,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Animated,
  Dimensions,
  TextInput,
  Platform,
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { Picker } from '@react-native-picker/picker'
import theme from '../theme'

const { width, height } = Dimensions.get('window')
const MODAL_ANIM_DURATION = 300
const MODAL_BACKDROP_OPACITY = 0.4

type Props = {
  title?: string
  value?: string | number
  placeholder?: string
  containerStyles?: ViewStyle
  labelStyle?: TextStyle
  inputStyle?: TextStyle
  error?: boolean
  caption?: string
  options?: Array<{ label: string; value: string }>
  onChange: (value: string | number | undefined) => void
}

const Select = ({
  title,
  value,
  onChange,
  containerStyles,
  labelStyle,
  placeholder = 'Select One',
  options = [],
  error,
  caption,
}: Props) => {
  const contentStyle = {}
  const [currentValue, setCurrentValue] = React.useState<
    string | number | undefined
  >(value)
  const [visible, setVisible] = React.useState(false)
  const animVal = React.useRef(new Animated.Value(0)).current

  const backdropAnimatedStyle = {
    opacity: animVal.interpolate({
      inputRange: [0, 1],
      outputRange: [0, MODAL_BACKDROP_OPACITY],
    }),
  }
  const contentAnimatedStyle = {
    transform: [
      {
        translateY: animVal.interpolate({
          inputRange: [0, 1],
          outputRange: [height, 0],
          extrapolate: 'clamp',
        }),
      },
    ],
  }

  const show = () => {
    setVisible(true)
    Animated.timing(animVal, {
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
      duration: MODAL_ANIM_DURATION,
      toValue: 1,
    }).start()
  }

  const hide = () => {
    Animated.timing(animVal, {
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
      duration: MODAL_ANIM_DURATION,
      toValue: 0,
    }).start(() => {
      if (visible) {
        setVisible(false)
      }
    })
  }

  const onBackdropPress = () => {}

  const valueItem = options.find((item) => item.value === value)

  return (
    <View style={containerStyles}>
      {!!title && (
        <Text style={[styles.label, error && styles.error, labelStyle]}>
          {title}
        </Text>
      )}

      <TouchableOpacity onPress={() => show()}>
        <View pointerEvents="none" style={styles.inputField}>
          <TextInput
            style={[styles.inputText, error && styles.inputError]}
            value={valueItem?.label}
            placeholder={placeholder}
          />
          <Feather name="chevron-down" size={18} />
        </View>
      </TouchableOpacity>

      {!!caption && (
        <Text style={[styles.caption, error && styles.error]}>{caption}</Text>
      )}

      {Platform.OS === 'web' ? (
        visible && (
          <View style={styles.webOptions}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setVisible(false)
                  setCurrentValue(option.value)
                  onChange(option.value)
                }}
              >
                <Text style={styles.webOptionsItem}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )
      ) : (
        <Modal transparent animationType="none" visible={visible}>
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <Animated.View
              style={[
                styles.backdrop,
                backdropAnimatedStyle,
                { width, height },
              ]}
            />
          </TouchableWithoutFeedback>

          {visible && (
            <Animated.View
              style={[styles.content, contentAnimatedStyle, contentStyle]}
              pointerEvents="box-none"
            >
              <View style={styles.wrap}>
                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => {
                    hide()
                    onChange(currentValue)
                  }}
                >
                  <Text style={styles.textDone}>Done</Text>
                </TouchableOpacity>
                <Picker
                  mode="dialog"
                  onValueChange={(val: string | number) => setCurrentValue(val)}
                  selectedValue={currentValue}
                >
                  <Picker.Item label={placeholder} value="" />
                  {options.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </Animated.View>
          )}
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    marginBottom: 5,
  },
  inputField: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
    borderColor: theme.border,
    paddingHorizontal: 7,
    height: 38,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  inputText: {
    fontSize: 17,
  },
  inputError: {
    borderColor: theme.danger,
  },
  caption: { marginTop: 5, fontSize: 13 },
  error: {
    color: theme.danger,
  },
  webOptions: {
    marginVertical: 10,
    backgroundColor: 'white',
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.border,
  },
  webOptionsItem: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  wrap: { backgroundColor: 'white' },
  doneBtn: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  textDone: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.primary,
  },
})

export default Select
