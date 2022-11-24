import { View } from 'react-native'

export { TitleField }

const REQUIRED_FIELD_SYMBOL = '*'

type TitleFieldProps = {
  id?: string
  title?: string
  required?: boolean
}

function TitleField({ id, title, required = false }: TitleFieldProps) {
  if (!title) return null

  return (
    <View key={id} nativeID={id}>
      <View>{title}</View>
      {required && <View>{REQUIRED_FIELD_SYMBOL}</View>}
    </View>
  )
}
