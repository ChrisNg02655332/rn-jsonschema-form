import React from 'react'
import { Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FormDynamic, Schema } from 'rn-form-builder'

import jsonSchema from './json/group-fields.json'

const schema: Schema = jsonSchema

const ArrayFields = () => {
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

export default ArrayFields
