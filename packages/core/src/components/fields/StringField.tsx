import { getUiOptions, getWidget, hasWidget, isSelect, optionsList } from '../../utils'
import { CommonProps } from '../types'

const StringField = ({ name, schema, uiSchema, platform, required, registry, methods }: CommonProps) => {
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
      name={name}
      platform={platform}
      schema={schema}
      uiSchema={uiSchema}
      label={title === undefined ? name : title}
      required={required}
      methods={methods}
      registry={registry}
    />
  )
}

export default StringField
