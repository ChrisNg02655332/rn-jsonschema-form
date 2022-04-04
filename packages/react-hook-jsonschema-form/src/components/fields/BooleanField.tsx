import { CommonProps } from 'jsonshema-form-core/src/types'
import { getUiOptions, getWidget, optionsList } from 'jsonshema-form-core/src/utils'

const BooleanField = ({
  name,
  schema,
  registry,
  idSchema,
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
      id={idSchema && idSchema.$id}
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
      uiSchema={uiSchema}
    />
  )
}

export default BooleanField
