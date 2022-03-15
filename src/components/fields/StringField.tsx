import React from 'react'
import { Methods, Platform } from '../../types'
import { getDefaultRegistry, getUiOptions, getWidget, hasWidget, isSelect, optionsList } from '../../utils'

type Props = {
  name: string
  schema: any
  uiSchema: any
  platform: Platform
  required?: boolean
  methods: Methods
}

const StringField = ({ name, schema, uiSchema, platform, required, methods, ...rest }: Props) => {
  console.log(rest)
  const { title, format } = schema

  const registry = getDefaultRegistry()
  const { widgets, formContext } = registry

  const enumOptions = isSelect(schema) && optionsList(schema)
  let defaultWidget = enumOptions ? 'select' : 'text'
  if (format && hasWidget(schema, format, widgets)) {
    defaultWidget = format
  }
  const { widget = defaultWidget, placeholder = '', ...options } = getUiOptions(uiSchema) as any
  const Widget = getWidget(schema, widget, widgets)

  return (
    <Widget
      name={name}
      platform={platform}
      schema={schema}
      uiSchema={uiSchema}
      label={title === undefined ? name : title}
      required={required}
      methods={methods}
    />
  )
}

export default StringField
