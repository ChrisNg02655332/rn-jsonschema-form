import React from 'react'
import { JSONSchema7 } from 'jsonschema7'

import { useStateWithCallbackLazy } from '../libs/hooks'
import { getDefaultRegistry } from '../utils'
import { Methods, Platform } from '../types'

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

  const getRegistry = () => {
    // For BC, accept passed SchemaField and TitleField props and pass them to
    // the "fields" registry one.
    const { fields, widgets } = getDefaultRegistry()
    return {
      fields: { ...fields, ...(props.fields || {}) },
      widgets: { ...widgets, ...(props.widgets || {}) },
      ArrayFieldTemplate: props.ArrayFieldTemplate,
      ObjectFieldTemplate: props.ObjectFieldTemplate,
      FieldTemplate: props.FieldTemplate,
      // definitions: props.schema.definitions || {},
      rootSchema: props.schema,
      // formContext: props.formContext || {},
    }
  }

  const onSubmit = (formData: any) => {
    props.onSubmit && props.onSubmit(formData)
  }

  const registry = getRegistry()
  const SchemaField = registry?.fields?.SchemaField

  return (
    <>
      <SchemaField
        schema={state.schema}
        uiSchema={state.uiSchema}
        methods={props.methods}
        platform={props.platform}
        registry={registry}
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
