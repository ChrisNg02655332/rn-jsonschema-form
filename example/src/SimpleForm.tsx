import * as React from 'react'
import { Text, ScrollView } from 'react-native'
import { FormDynamic } from 'rn-form-builder'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// import jsonSchema from './json/basic.json'

// const schema: Schema = jsonSchema

const schema = {
  title: 'A registration form',
  description: 'A simple form example.',
  type: 'object',
  required: ['firstName', 'lastName'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First name',
      default: 'Chuck',
    },
    lastName: {
      type: 'string',
      title: 'Last name',
    },
    telephone: {
      type: 'string',
      title: 'Telephone',
      minLength: 10,
    },
  },
}

const BasicForm = () => {
  const [formData, setFormData] = React.useState({})

  return (
    <>
      <ScrollView>
        {Object.keys(formData).length > 0 && (
          <Text style={{ marginHorizontal: 15 }}>
            {JSON.stringify(formData, null, 2)}
          </Text>
        )}
      </ScrollView>

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
