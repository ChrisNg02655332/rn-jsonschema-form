import * as React from 'react'
import { Text } from 'react-native'
import { FormDynamic, Schema } from 'rn-form-builder'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import jsonSchema from './json/basic.json'

const schema: Schema = jsonSchema

const BasicForm = () => {
  const [formData, setFormData] = React.useState({})
  return (
    <>
      {Object.keys(formData).length > 0 && (
        <Text style={{ marginHorizontal: 15 }}>
          {JSON.stringify(formData, null, 2)}
        </Text>
      )}

      <FormDynamic
        wrapper={KeyboardAwareScrollView}
        containerStyle={{ padding: 10 }}
        schema={schema}
        onSubmit={(values) => setFormData(values)}
      />
    </>
  )
}

export default BasicForm
