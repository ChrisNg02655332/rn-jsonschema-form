import React from 'react'
import { JSONSchema7 } from 'jsonschema7'

import { useStateWithCallbackLazy } from './hooks'
import { Methods, Platform } from './types'

type Props = {
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
  registry: {
    fields: any
    widgets: any
    ArrayFieldTemplate: any
    ObjectFieldTemplate: any
    FieldTemplate: any
    rootSchema: any
    formContext: any
  }
}

const Form: React.FC<Props> = (props) => {
  const [state, setState] = useStateWithCallbackLazy({})

  React.useEffect(() => {
    setState({ schema: props.schema, uiSchema: props.uiSchema || {} })
  }, [])

  React.useEffect(() => {
    if (props.enableReinitialize) {
      setState({ schema: props.schema, uiSchema: props.uiSchema || {} })
    }
  }, [props.schema, props.uiSchema])

  const onSubmit = (formData: any) => {
    props.onSubmit && props.onSubmit(formData)
  }

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

      {props.platform === 'web' ? (
        <button className="btn btn-primary" onClick={props.methods.handleSubmit(onSubmit)}>
          Submit
        </button>
      ) : (
        props.children
      )}
    </>
  )
}

export default Form
