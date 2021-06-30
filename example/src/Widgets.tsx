import React from 'react'
import { Text, TextInput, View } from 'react-native'
import type { FormikProps } from 'formik'

const TextFieldWidget = ({
  formik,
  name,
}: {
  name: string
  formik: FormikProps<any>
}) => {
  return (
    <View key={name}>
      <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>
        This is custom widget
      </Text>
      <TextInput
        style={{ borderColor: 'red', borderWidth: 1, paddingVertical: 5 }}
        value={formik.values[name]}
        onChangeText={formik.handleChange(name)}
      />
    </View>
  )
}

const widgets = {
  customTextFieldWidget: TextFieldWidget,
}

export default widgets
