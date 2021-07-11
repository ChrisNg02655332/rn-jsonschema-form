import * as React from 'react'
import { Text, ScrollView } from 'react-native'
import { FormDynamic } from 'rn-form-builder'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// import jsonSchema from './json/basic.json'

// const schema: Schema = jsonSchema

const schema = {
  definitions: {
    Thing: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          default: 'Default name',
        },
      },
    },
  },
  type: 'object',
  properties: {
    listOfStrings: {
      type: 'array',
      title: 'A list of strings',
      items: {
        type: 'string',
        default: 'bazinga',
      },
    },
    multipleChoicesList: {
      type: 'array',
      title: 'A multiple choices list',
      items: {
        type: 'string',
        enum: ['foo', 'bar', 'fuzz', 'qux'],
      },
      uniqueItems: true,
    },
  },
}

const uiSchema = {
  listOfStrings: {
    items: {
      'ui:emptyValue': '',
    },
  },
  multipleChoicesList: {
    'ui:widget': 'checkboxes',
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
        uiSchema={uiSchema}
        onSubmit={(values) => setFormData(values)}
      />
    </>
  )
}

export default BasicForm
