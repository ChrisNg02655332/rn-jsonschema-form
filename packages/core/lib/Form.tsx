import React from 'react'
import { JSONSchema7 } from 'jsonschema7'

import { useStateWithCallbackLazy } from './hooks'
import { Methods, Platform } from './types'

export { Form }

type FormProps = {
  schema: JSONSchema7
  uiSchema?: any
  fields?: any
  widgets?: any
  methods: Methods
  platform: Platform
  onSubmit?: (data: any) => void
  buttons?: React.ReactElement
  ArrayFieldTemplate?: any
  ObjectFieldTemplate?: any
  FieldTemplate?: any
  enableReinitialize?: boolean
  registry?: {
    fields: any
    widgets: any
    ArrayFieldTemplate: any
    ObjectFieldTemplate: any
    FieldTemplate: any
    rootSchema: any
    formContext: any
  }
}

function Form(props: React.PropsWithChildren<FormProps>) {
  const [state, setState] = useStateWithCallbackLazy({})

  React.useEffect(() => {
    setState({ schema: props.schema, uiSchema: props.uiSchema || {} })
  }, [])

  React.useEffect(() => {
    if (props.enableReinitialize) {
      setState({ schema: props.schema, uiSchema: props.uiSchema || {} })
    }
  }, [props.schema, props.uiSchema])

  const SchemaField = props.registry?.fields?.SchemaField

  return (
    <>
      <SchemaField
        schema={state.schema}
        uiSchema={state.uiSchema}
        methods={props.methods}
        platform={props.platform}
        registry={props.registry}
      />
      {props.children}
    </>
  )
}
