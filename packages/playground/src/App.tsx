import React from 'react'
import { useForm } from 'react-hook-form'
import { Form } from 'react-hook-jsonschema-form'
import * as buffer from 'buffer'
;(window as any).Buffer = buffer.Buffer

const schema: any = {
  title: 'Hmlet Daily Checklist',
  description: 'To complete all items per unit',
  type: 'object',
  properties: {
    telephone: {
      type: 'boolean',
      title: 'Telephone',
    },
  },
}

const uiSchema = {
  multipleChoicesList: {
    'ui:widget': 'checkboxes',
  },
}

const App = () => {
  const methods: any = useForm({
    defaultValues: { listOfStrings: ['foo', 'bar'], multipleChoicesList: ['foo', 'bar'] },
  })

  return (
    <div className="container mt-5">
      <Form
        schema={schema}
        uiSchema={uiSchema}
        methods={methods}
        onSubmit={(data) => {
          console.log('inside onsubmit')

          console.log(data)
        }}
      />
      <button className="btn btn-danger" onClick={methods.handleSubmit((data: any) => console.log(data))}>
        asd
      </button>
    </div>
  )
}

export default App
