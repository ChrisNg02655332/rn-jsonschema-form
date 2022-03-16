import React from 'react'
import { useForm } from 'react-hook-form'
import { Form } from 'rn-form-schema'

const schema: any = {
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

const App = () => {
  const methods = useForm()
  return <Form platform="web" schema={schema} methods={methods} />
}

export default App
