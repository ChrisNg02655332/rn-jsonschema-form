import React from 'react'
import { JSONSchema7 } from 'jsonschema7'
import { TouchableOpacity, Text } from 'react-native'
import { Form as FormComponent, Methods } from 'jsonshema-form-core'
import fields from './fields'

export { Form }

type FormProps = {
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
  formContext?: any
}

function Form({ onSubmit, submitText, children, ...rest }: React.PropsWithChildren<FormProps>) {
  const registry = {
    fields: { ...fields, ...(rest.fields || {}) },
    widgets: { ...(rest.widgets || {}) },
    ArrayFieldTemplate: rest.ArrayFieldTemplate,
    ObjectFieldTemplate: rest.ObjectFieldTemplate,
    FieldTemplate: rest.FieldTemplate,
    rootSchema: rest.schema,
    formContext: rest.formContext || {},
  }

  return (
    <FormComponent registry={registry} platform="mobile" {...rest}>
      {typeof onSubmit === 'function' && !children ? (
        <TouchableOpacity>
          <Text>{submitText || 'Submit'}</Text>
        </TouchableOpacity>
      ) : (
        children
      )}
    </FormComponent>
  )
}
