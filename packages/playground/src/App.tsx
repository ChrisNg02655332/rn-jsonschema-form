import React from 'react'
import { useForm } from 'react-hook-form'
import { Form } from 'react-jsonschema-form'

const schema: any = {
  title: 'Hmlet Daily Checklist',
  description: 'To complete all items per unit',
  type: 'object',
  properties: {
    assignment_remarks: {
      title: 'Remarks',
      type: 'string',
    },
    cleaning_task_common_areas: {
      title: 'Common Areas',
      type: 'boolean',
      default: false,
    },
    cleaning_task_room: {
      title: 'Room',
      type: 'boolean',
      default: false,
    },
    cleaning_task_whole_unit: {
      title: 'Whole Unit',
      type: 'boolean',
      default: false,
    },
    status_after_cleaning_occupied_clean: {
      title: 'Occupied Clean',
      type: 'boolean',
      default: false,
    },
    status_after_cleaning_vacant_clean: {
      title: 'Vacant Clean',
      type: 'boolean',
      default: false,
    },
    bedsheet_king: {
      title: 'King',
      type: 'integer',
    },
  },
}

const App = () => {
  const methods = useForm({ defaultValues: {} })

  return (
    <div className="container mt-5">
      <Form
        schema={schema}
        methods={methods}
        onSubmit={(data) => {
          console.log('inside onsubmit')

          console.log(data)
        }}
      />
      <button className="btn btn-danger" onClick={methods.handleSubmit((data) => console.log(data))}>
        asd
      </button>
    </div>
  )
}

export default App
