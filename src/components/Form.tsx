import React from 'react'
import { Mode, useForm } from 'react-hook-form'
import { JSONSchema7 } from 'jsonschema7'

import { useStateWithCallbackLazy } from '../libs/hooks'
import { getDefaultRegistry } from '../utils'
import { Platform } from '../types'

type Props = {
  schema: JSONSchema7
  uiSchema?: any
  fields?: any
  widgets?: any
  formData?: FormData
  mode?: Mode
  platform?: Platform
  onSubmit?: (data: FormData) => void
  buttons?: React.ReactElement
}

const Form = React.forwardRef<any, Props>((props, ref) => {
  const [state] = useStateWithCallbackLazy({
    schema: props.schema,
    uiSchema: props.uiSchema || {},
  })

  const getRegistry = () => {
    // For BC, accept passed SchemaField and TitleField props and pass them to
    // the "fields" registry one.
    const { fields, widgets } = getDefaultRegistry()
    return {
      fields: { ...fields, ...(props.fields || {}) },
      widgets: { ...widgets, ...(props.widgets || {}) },
      // ArrayFieldTemplate: props.ArrayFieldTemplate,
      // ObjectFieldTemplate: props.ObjectFieldTemplate,
      // FieldTemplate: props.FieldTemplate,
      // definitions: props.schema.definitions || {},
      // rootSchema: props.schema,
      // formContext: props.formContext || {},
    }
  }

  const onSubmit = (formData: any) => {
    props.onSubmit && props.onSubmit(formData)
  }

  const methods = useForm({
    defaultValues: props.formData,
    mode: props.mode,
  })

  React.useImperativeHandle(ref, () => ({ methods }))

  const registry = getRegistry()
  const SchemaField = registry?.fields?.SchemaField

  return (
    <>
      <SchemaField
        schema={state.schema}
        uiSchema={state.uiSchema}
        methods={methods}
        platform={props.platform || 'web'}
      />

      {props.platform === 'web' ? <button onClick={methods.handleSubmit(onSubmit)}>Submit</button> : props.children}
    </>
  )
})

export default Form
