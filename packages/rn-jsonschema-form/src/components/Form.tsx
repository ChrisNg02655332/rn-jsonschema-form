import React from 'react'
import { JSONSchema7 } from 'jsonschema7'
import { TouchableOpacity, Text } from 'react-native'
import { Form as FormComponent } from '../../../core/src'
import { Methods } from '../../../../lib/types'

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
}

const Form: React.FC<Props> = ({ onSubmit, submitText, children, ...rest }) => {
  return (
    <FormComponent platform="mobile" {...rest}>
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

export default Form
