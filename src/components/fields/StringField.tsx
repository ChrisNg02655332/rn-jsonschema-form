import React from 'react'

import {
  getDefaultRegistry,
  getUiOptions,
  getWidget,
  hasWidget,
  isSelect,
  optionsList,
} from '../../utils'

const StringField = ({
  schema,
  name,
  uiSchema,
  idSchema,
  formData,
  required,
  disabled,
  readonly,
  autofocus,
  onChange,
  onBlur,
  onFocus,
  registry = getDefaultRegistry(),
  rawErrors,
  ...rest
}: any) => {
  const { title, format } = schema
  const { widgets, formContext } = registry
  const enumOptions = isSelect(schema) && optionsList(schema)
  let defaultWidget = enumOptions ? 'select' : 'text'
  if (format && hasWidget(schema, format, widgets)) {
    defaultWidget = format
  }
  const {
    widget = defaultWidget,
    placeholder = '',
    ...options
  } = getUiOptions(uiSchema) as any
  const Widget = getWidget(schema, widget, widgets)

  return (
    <Widget
      options={{ ...options, enumOptions }}
      schema={schema}
      uiSchema={uiSchema}
      id={idSchema && idSchema.$id}
      label={title === undefined ? name : title}
      value={formData}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      required={required}
      disabled={disabled}
      readonly={readonly}
      formContext={formContext}
      autofocus={autofocus}
      registry={registry}
      placeholder={placeholder}
      rawErrors={rawErrors}
      {...rest}
    />
  )
}

export default StringField
