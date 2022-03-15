import React from 'react'
import { Form } from '../../src/components'
// import { Form } from 'rn-form-builder'

const schema: any = {
  type: 'object',
  title: '13',
  required: ['firstName', 'lastName'],
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
  },
}

const App = () => {
  return <Form schema={schema} uiSchema={{}} />
}

export default App
