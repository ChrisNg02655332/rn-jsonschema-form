/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Text, TextInput, View, TouchableOpacity } from 'react-native'
import type { FormikProps } from 'formik'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

type Props = {
  schema: any
  rootSchema: any
  key: string
  name: string
  formik: FormikProps<any>
}

const TextFieldWidget = ({ formik, name }: Props) => {
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
      {!!formik.errors[name] && (
        <Text style={{ color: 'red' }}>{formik.errors[name]}</Text>
      )}
    </View>
  )
}

const RatingWidget = ({ formik, name, rootSchema }: Props) => {
  const dependenKey = rootSchema.properties[name].dependenKey

  const [list, setList] = useState<Array<string>>([])
  const [values, setValues] = useState<Array<string>>(
    formik.values[dependenKey] || []
  )

  useEffect(() => {
    let arr: Array<string> = []
    Object.keys(rootSchema.properties[name].dependency).forEach((k) => {
      if (k.split(',').includes(formik.values[name]?.toString())) {
        arr = rootSchema.properties[name].dependency[k].enum
      }
    })
    setList(arr)
  })

  useEffect(() => {
    if (list.length && list.some((item) => values.includes(item))) {
      setValues([])
      formik.setFieldValue(dependenKey, [])
    }
  }, [list.length])

  return (
    <View key={name}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        {Array.from(Array(5).keys()).map((i) => (
          <TouchableOpacity
            key={i}
            style={{ marginHorizontal: 5 }}
            onPress={() => formik.setFieldValue(name, i + 1)}
          >
            <FontAwesome
              name={formik.values[name] >= i + 1 ? 'star' : 'star-o'}
              size={40}
              color="#60A5FA"
            />
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 15,
        }}
      >
        {list.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => {
              let arr = values.slice()
              const idx = arr.findIndex((i) => i === item)
              if (idx !== -1) arr.splice(idx, 1)
              else arr.push(item)
              setValues(arr)
              formik.setFieldValue(dependenKey, arr)
            }}
            style={[
              {
                marginHorizontal: 5,
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: '#60A5FA',
                backgroundColor: values.includes(item) ? '#60A5FA' : 'white',
              },
            ]}
          >
            <Text
              style={{
                fontSize: 16,
                color: values.includes(item) ? 'white' : '#111827',
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {!!formik.errors[name] && (
        <Text style={{ color: 'red' }}>{formik.errors[name]}</Text>
      )}
    </View>
  )
}

const widgets = {
  customTextFieldWidget: TextFieldWidget,
  rating: RatingWidget,
}

export default widgets
