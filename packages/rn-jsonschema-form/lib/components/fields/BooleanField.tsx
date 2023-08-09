import { CommonProps, getUiOptions, getWidget, optionsList } from 'jsonshema-form-core'

export { BooleanField }

function BooleanField({ name, schema, uiSchema, required, registry, methods, ...rest }: CommonProps) {
  const { title } = schema
  const { widgets } = registry
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
      {...rest}
      name={name}
      schema={schema}
      uiSchema={uiSchema}
      label={title === undefined ? name : title}
      required={required}
      methods={methods}
      registry={registry}
      options={{ ...options, enumOptions }}
    />
  )
}
