import * as React from 'react'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import { FormDynamic, Schema } from 'rn-form-builder'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import jsonSchema from './json/basic.json'

const schema: Schema = jsonSchema

const CustomButtonSubmit = () => {
  const [formData, setFormData] = React.useState({})

  return (
    <View>
      {Object.keys(formData).length > 0 && (
        <Text style={{ marginHorizontal: 15 }}>
          {JSON.stringify(formData, null, 2)}
        </Text>
      )}

      <FormDynamic
        wrapper={KeyboardAwareScrollView}
        containerStyle={styles.content}
        schema={schema}
        hideSubmitButton
        onSubmit={(values) => setFormData(values)}
      />
      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.text}>Custom submit button</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 10,
  },
  submitBtn: {
    marginVertical: 15,
    marginHorizontal: 10,
    backgroundColor: '#DB2777',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  text: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
})

export default CustomButtonSubmit
