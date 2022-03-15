import React from 'react'

import { ADDITIONAL_PROPERTY_FLAG, getDefaultRegistry, orderProperties, retrieveSchema } from '../../utils'

const DefaultObjectFieldTemplate = (props: any) => {
  console.log(props)

  return (
    <>
      {props.properties.map((prop: any, idx: number) => (
        <React.Fragment key={idx}>{prop.content}</React.Fragment>
      ))}
    </>
  )
}

const ObjectField = (props: any) => {
  const { platform, uiSchema, required, readonly, disabled, ...rest } = props

  const registry = getDefaultRegistry()
  const { rootSchema, fields, formContext } = registry
  const { SchemaField, TitleField, DescriptionField } = fields
  const schema = retrieveSchema(rest.schema, rootSchema, {})
  const title = schema.title === undefined ? props.name : schema.title
  const description = uiSchema['ui:description'] || schema.description

  let orderedProperties: Array<string> = []

  try {
    const properties = Object.keys(schema.properties || {})
    orderedProperties = orderProperties(properties, uiSchema['ui:order'])
  } catch (err: any) {
    if (platform === 'web') {
      return (
        <div>
          <p>
            Invalid {props.name || 'root'} object field configuration:
            <span>{err.message}</span>.
          </p>
          <p>{JSON.stringify(schema)}</p>
        </div>
      )
    }

    return null
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
      const addedByAdditionalProperties = schema.properties[name].hasOwnProperty(ADDITIONAL_PROPERTY_FLAG)
      const fieldUiSchema = addedByAdditionalProperties ? uiSchema.additionalProperties : uiSchema[name]
      const hidden = fieldUiSchema && fieldUiSchema['ui:widget'] === 'hidden'

      return {
        content: (
          <SchemaField
            key={name}
            name={name}
            methods={rest.methods}
            required={isRequired(name)}
            schema={schema.properties[name]}
            uiSchema={fieldUiSchema}
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
    methods: rest.methods,
    readonly,
    disabled,
    required,
    uiSchema,
    schema,
    formData: props.formData,
    formContext,
    registry,
  }

  if (platform === 'web') {
    return <Template {...templateProps} />
  }

  return null
}

export default ObjectField
