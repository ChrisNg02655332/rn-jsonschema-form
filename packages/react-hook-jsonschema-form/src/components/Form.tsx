import React from 'react'
import { JSONSchema7 } from 'jsonschema7'
import FormComponent from 'jsonshema-form-core/src/Form'
import { Methods } from 'jsonshema-form-core/src/types'
import fields from './fields'
import widgets from './widgets'

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

const Form: React.FC<Props> = ({ onSubmit, submitText, children, ...rest }) => {
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
    <FormComponent platform="web" registry={registry} {...rest}>
      {typeof onSubmit === 'function' && !children ? <button type="submit">{submitText || 'Submit'}</button> : children}
    </FormComponent>
  )
}

export default Form
