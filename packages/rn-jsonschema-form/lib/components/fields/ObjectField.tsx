import { View, Text } from 'react-native'
import { ADDITIONAL_PROPERTY_FLAG, orderProperties, retrieveSchema, CommonProps } from 'jsonshema-form-core'

export { ObjectField }

function DefaultObjectFieldTemplate({ TitleField, DescriptionField, ...rest }: any) {
  return (
    <View nativeID={rest.idSchema.$id}>
      {(rest.uiSchema['ui:title'] || rest.title) && (
        <TitleField
          id={`${rest.idSchema.$id}__title`}
          title={rest.title || rest.uiSchema['ui:title']}
          required={rest.required}
          formContext={rest.formContext}
        />
      )}
      {rest.description && (
        <DescriptionField
          id={`${rest.idSchema.$id}__description`}
          description={rest.description}
          formContext={rest.formContext}
        />
      )}
      {rest.properties.map((prop: any) => prop.content)}
    </View>
  )
}

function ObjectField({
  name,
  uiSchema,
  required,
  readonly,
  disabled,
  methods,
  registry,
  idSchema,
  idPrefix,
  idSeparator,
  ...rest
}: CommonProps) {
  const { rootSchema, fields, formContext } = registry
  const { SchemaField, TitleField, DescriptionField } = fields
  const schema = retrieveSchema(rest.schema, rootSchema)
  const title = schema.title === undefined ? name : schema.title
  const description = uiSchema['ui:description'] || schema.description

  let orderedProperties: Array<string> = []

  try {
    const properties = Object.keys(schema.properties || {})
    orderedProperties = orderProperties(properties, uiSchema['ui:order'])
  } catch (err: any) {
    return (
      <View>
        <Text>
          Invalid {name || 'root'} object field configuration:
          <Text>{err.message}</Text>.
        </Text>
        <Text>{JSON.stringify(schema)}</Text>
      </View>
    )
  }

  const isRequired = (name: string) => {
    return Array.isArray(rest.schema.required) && rest.schema.required.indexOf(name) !== -1
  }

  const Template = uiSchema['ui:ObjectFieldTemplate'] || registry.ObjectFieldTemplate || DefaultObjectFieldTemplate

  const templateProps = {
    title: uiSchema['ui:title'] || title,
    description,
    TitleField,
    DescriptionField,
    properties: orderedProperties.map((name: string) => {
      const addedByAdditionalProperties = Object.hasOwn(schema.properties[name], ADDITIONAL_PROPERTY_FLAG)
      const fieldUiSchema = addedByAdditionalProperties ? uiSchema.additionalProperties : uiSchema[name]
      const hidden = fieldUiSchema && fieldUiSchema['ui:widget'] === 'hidden'

      return {
        content: (
          <SchemaField
            key={name}
            name={name}
            label={rest.label}
            required={isRequired(name)}
            schema={schema.properties[name]}
            uiSchema={fieldUiSchema}
            idSchema={idSchema[name]}
            idPrefix={idPrefix}
            idSeparator={idSeparator}
            methods={methods}
            registry={registry}
            disabled={disabled}
            readonly={readonly}
          />
        ),
        name,
        readonly,
        disabled,
        required,
        hidden,
      }
    }),
    readonly,
    disabled,
    required,
    idSchema,
    uiSchema,
    schema,
    formContext,
    registry,
    methods,
  }

  return <Template {...templateProps} />
}
