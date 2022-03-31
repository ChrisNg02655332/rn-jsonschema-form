import React from 'react'
import { JSONSchema7 } from 'jsonschema7'
import { Form as FormComponent } from 'jsonshema-form-core/src/index'
import { Methods } from 'jsonshema-form-core/src/types'

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
}

const Form: React.FC<Props> = ({ onSubmit, submitText, children, ...rest }) => {
  return (
    <FormComponent platform="web" {...rest}>
      {typeof onSubmit === 'function' && !children ? <button type="submit">{submitText || 'Submit'}</button> : children}
    </FormComponent>
  )
}

export default Form
