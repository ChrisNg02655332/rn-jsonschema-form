import React from 'react'
import { JSONSchema7 } from 'jsonschema7'
import { Form as FormComponent } from 'jsonshema-form-core'
import { Methods } from 'jsonshema-form-core'
import fields from './fields'
import widgets from './widgets'

export { Form }

type Props = {
  schema: JSONSchema7
  uiSchema?: any
  fields?: any
  widgets?: any
  methods: Methods
  onSubmit?: (data: any) => void
  buttons?: React.ReactElement
  ArrayFieldTemplate?: any
  ObjectFieldTemplate?: any
  FieldTemplate?: any
  submitText?: string
  enableReinitialize?: boolean
  formContext?: any
}

function Form({ onSubmit, submitText, children, ...rest }: React.PropsWithChildren<Props>) {
  const registry = {
    fields: { ...fields, ...(rest.fields || {}) },
    widgets: { ...widgets, ...(rest.widgets || {}) },
    ArrayFieldTemplate: rest.ArrayFieldTemplate,
    ObjectFieldTemplate: rest.ObjectFieldTemplate,
    FieldTemplate: rest.FieldTemplate,
    rootSchema: rest.schema,
    formContext: rest.formContext || {},
  }

  return (
    <form onSubmit={typeof onSubmit === 'function' && !children ? rest.methods.handleSubmit(onSubmit) : undefined}>
      <FormComponent platform="web" registry={registry} {...rest}>
        {typeof onSubmit === 'function' && !children ? (
          <button type="submit">{submitText || 'Submit'}</button>
        ) : (
          children
        )}
      </FormComponent>
    </form>
  )
}
