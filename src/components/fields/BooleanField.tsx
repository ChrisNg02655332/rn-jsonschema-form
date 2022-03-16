import React from 'react'
import { getUiOptions, getWidget, optionsList } from '../../utils'
import { CommonProps } from '../types'

const BooleanField = ({
  platform,
  name,
  schema,
  registry,
  uiSchema,
  readonly,
  required,
  disabled,
  methods,
}: CommonProps) => {
  const { title } = schema
  const { widgets, formContext, fields } = registry
  const { widget = 'checkbox', ...options } = getUiOptions(uiSchema) as any
  const Widget = getWidget(schema, widget, widgets)

  let enumOptions

  if (Array.isArray(schema.oneOf)) {
    enumOptions = optionsList({
      oneOf: schema.oneOf.map((option: any) => ({
        ...option,
        title: option.title || (option.const === true ? 'Yes' : 'No'),
      })),
    })
  } else {
    enumOptions = optionsList({
      enum: schema.enum || [true, false],
      enumNames: schema.enumNames || (schema.enum && schema.enum[0] === false ? ['No', 'Yes'] : ['Yes', 'No']),
    })
  }

  return (
    <Widget
      methods={methods}
      options={{ ...options, enumOptions }}
      schema={schema}
      name={name}
      label={!title ? name : title}
      required={required}
      disabled={disabled}
      readonly={readonly}
      registry={registry}
      formContext={formContext}
      DescriptionField={fields.DescriptionField}
      platform={platform}
      uiSchema={uiSchema}
    />
  )
}

export default BooleanField
