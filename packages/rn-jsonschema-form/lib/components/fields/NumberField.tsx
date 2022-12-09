import { CommonProps, getUiOptions, getWidget, hasWidget, isSelect, optionsList } from 'jsonshema-form-core'

export { NumberField }

function NumberField({ name, schema, uiSchema, required, registry, methods, ...rest }: CommonProps) {
  const { title, format } = schema

  const { widgets } = registry

  const enumOptions = isSelect(schema) && optionsList(schema)
  let defaultWidget = enumOptions ? 'select' : 'text'
  if (format && hasWidget(schema, format, widgets)) {
    defaultWidget = format
  }
  const { widget = defaultWidget } = getUiOptions(uiSchema) as any
  const Widget = getWidget(schema, widget, widgets)

  return (
    <Widget
      {...rest}
      name={name}
      schema={schema}
      uiSchema={uiSchema}
      label={title === undefined ? name : title}
      required={required}
      methods={methods}
      registry={registry}
    />
  )
}
