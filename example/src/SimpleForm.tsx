import * as React from 'react'
import { Text, ScrollView } from 'react-native'
import { FormDynamic } from 'rn-form-builder'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// import jsonSchema from './json/basic.json'

// const schema: Schema = jsonSchema

const schema = {
  title: 'Widgets',
  type: 'object',
  properties: {
    stringFormats: {
      type: 'object',
      title: 'String formats',
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
        uri: {
          type: 'string',
          format: 'uri',
        },
      },
    },
    boolean: {
      type: 'object',
      title: 'Boolean field',
      properties: {
        default: {
          type: 'boolean',
          title: 'checkbox (default)',
          description: 'This is the checkbox-description',
        },
        radio: {
          type: 'boolean',
          title: 'radio buttons',
          description: 'This is the radio-description',
        },
        // select: {
        //   type: 'boolean',
        //   title: 'select box',
        //   description: 'This is the select-description',
        // },
      },
    },
    // string: {
    //   type: 'object',
    //   title: 'String field',
    //   properties: {
    //     default: {
    //       type: 'string',
    //       title: 'text input (default)',
    //     },
    //     textarea: {
    //       type: 'string',
    //       title: 'textarea',
    //     },
    //     placeholder: {
    //       type: 'string',
    //     },
    //     color: {
    //       type: 'string',
    //       title: 'color picker',
    //       default: '#151ce6',
    //     },
    //   },
    // },
    // secret: {
    //   type: 'string',
    //   default: "I'm a hidden string.",
    // },
    // disabled: {
    //   type: 'string',
    //   title: 'A disabled field',
    //   default: 'I am disabled.',
    // },
    // readonly: {
    //   type: 'string',
    //   title: 'A readonly field',
    //   default: 'I am read-only.',
    // },
    // readonly2: {
    //   type: 'string',
    //   title: 'Another readonly field',
    //   default: 'I am also read-only.',
    //   readOnly: true,
    // },
    // widgetOptions: {
    //   title: 'Custom widget with options',
    //   type: 'string',
    //   default: 'I am yellow',
    // },
    // selectWidgetOptions: {
    //   title: 'Custom select widget with options',
    //   type: 'string',
    //   enum: ['foo', 'bar'],
    //   enumNames: ['Foo', 'Bar'],
    // },
  },
}

const uiSchema = {
  boolean: {
    radio: {
      'ui:widget': 'radio',
      'ui:options': {
        inline: true,
      },
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
        uiSchema={uiSchema}
        onSubmit={(values) => setFormData(values)}
      />
    </>
  )
}

export default BasicForm
