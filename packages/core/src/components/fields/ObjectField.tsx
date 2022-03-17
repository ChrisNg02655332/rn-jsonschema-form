import React from 'react'

import { CommonProps } from '../types'
import { ADDITIONAL_PROPERTY_FLAG, orderProperties, retrieveSchema } from '../../utils'

const DefaultObjectFieldTemplate = (props: any) => {
  if (props.platform === 'web') {
    return (
      <>
        {!!props.title && <p className="h5">{props.title}</p>}
        {!!props.description && <span className="text-muted">{props.description}</span>}
        {(!!props.title || !!props.description) && <div className="mb-3" />}

        {props.properties.map((prop: any, idx: number) => (
          <React.Fragment key={idx}>{prop.content}</React.Fragment>
        ))}
      </>
    )
  }

  return (
    <>
      {props.properties.map((prop: any, idx: number) => (
        <React.Fragment key={idx}>{prop.content}</React.Fragment>
      ))}
    </>
  )
}

const ObjectField = (props: CommonProps) => {
  const { platform, uiSchema, required, readonly, disabled, methods, registry, ...rest } = props

  const { rootSchema, fields } = registry
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
            label={rest.label}
            methods={methods}
            registry={registry}
            required={isRequired(name)}
            schema={schema.properties[name]}
            uiSchema={fieldUiSchema}
            disabled={disabled}
            readonly={readonly}
            platform={platform}
          />
        ),
        name,
        readonly,
        disabled,
        required,
        hidden,
      }
    }),
    methods,
    readonly,
    disabled,
    required,
    uiSchema,
    schema,
    registry,
    platform,
  }

  return <Template {...templateProps} />
}

export default ObjectField
