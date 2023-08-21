import React from 'react'
import { Methods, getDisplayLabel, getSchemaType, retrieveSchema, mergeObjects, toIdSchema } from 'jsonshema-form-core'

import { get } from 'lodash'
import ImageHelper from '../common/ImageHelper'

const COMPONENT_TYPES: any = {
  array: 'ArrayField',
  boolean: 'BooleanField',
  integer: 'NumberField',
  number: 'NumberField',
  object: 'ObjectField',
  string: 'StringField',
  null: 'NullField',
}

const getFieldComponent = (schema: any, uiSchema: any, idSchema: any, fields: any) => {
  const field = uiSchema['ui:field']
  if (typeof field === 'function') {
    return field
  }

  if (typeof field === 'string' && field in fields) {
    return fields[field]
  }

  const componentName = COMPONENT_TYPES[getSchemaType(schema)]

  // If the type is not defined and the schema uses 'anyOf' or 'oneOf', don't
  // render a field and let the MultiSchemaField component handle the form display
  if (!componentName && (schema.anyOf || schema.oneOf)) {
    return () => null
  }

  return componentName in fields
    ? fields[componentName]
    : () => {
        const { UnsupportedField } = fields
        return <UnsupportedField schema={schema} reason={`Unknown field type ${schema.type}`} />
      }
}

const Help = ({ help }: { help: string | any }) => {
  if (!help) return null
  if (typeof help === 'string') return <p>{help}</p>
  return <span>{help}</span>
}

const DefaultTemplate: React.FC<{
  methods: Methods
  name: string
  label: string
  required: boolean
  displayLabel: boolean
  uiSchema: any
  schema: any
  imageHint: any
}> = ({ children, required, displayLabel, methods, label, name, uiSchema, schema, imageHint }) => {
  const fieldName = schema?.parentKey ? `${schema?.parentKey}.${name}` : name
  const help = uiSchema['ui:help']

  const error = schema.type !== 'object' ? get(methods.formState.errors, fieldName) : ''
  /**
   * Note: when schema type is object, dont need to show error field
   */
  const errorMessage = error ? error?.message || `${label || 'This field'} is required` : ''

  return (
    <div className={`mb-3 ${error ? 'invalid' : 'valid'}`}>
      {displayLabel && (
        <label className="form-label mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div>
        {children}

        {(help || error) && (
          <div className={`help mt-1 d-block ${error ? 'invalid-feedback' : 'text-secondary'}`}>
            {errorMessage || help}
          </div>
        )}

        {imageHint}
      </div>
    </div>
  )
}

type Props = {
  name: string
  schema: any
  uiSchema?: any
  methods: Methods
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  registry?: any
  idSchema?: any
  idPrefix?: string
  idSeparator?: any
}

const SchemaField = ({ name, uiSchema = {}, registry, methods, idPrefix, idSeparator, required, ...rest }: Props) => {
  const { rootSchema, fields, formContext, widgets } = registry

  const FieldTemplate = uiSchema['ui:FieldTemplate'] || registry.FieldTemplate || DefaultTemplate

  const ImageHint = widgets['ImageHelper'] || ImageHelper

  let idSchema = rest.idSchema || {}
  const schema = retrieveSchema(rest.schema, rootSchema)
  idSchema = mergeObjects(toIdSchema(schema, null, rootSchema, idPrefix, idSeparator), idSchema)
  const FieldComponent = getFieldComponent(schema, uiSchema, idSchema, fields)
  const { DescriptionField } = fields
  const disabled = Boolean(rest.disabled || uiSchema['ui:disabled'])
  const readonly = Boolean(rest.readonly || uiSchema['ui:readonly'] || rest.schema?.readOnly || schema.readOnly)
  // const autofocus = Boolean(rest.autofocus || uiSchema['ui:autofocus'])

  if (Object.keys(schema).length === 0) return null

  const field = (
    <FieldComponent
      name={name}
      idSchema={idSchema}
      schema={schema}
      uiSchema={uiSchema}
      methods={methods}
      formContext={formContext}
      disabled={disabled}
      readonly={readonly}
      registry={registry}
      required={required}
    />
  )

  const id = idSchema.$id

  const displayLabel = getDisplayLabel(schema, uiSchema, rootSchema)
  const label = uiSchema['ui:title'] || rest.schema.title || schema.title
  const description = uiSchema['ui:description'] || rest.schema.description || schema.description
  const help = uiSchema['ui:help']
  const hidden = uiSchema['ui:widget'] === 'hidden'

  const fieldProps = {
    description: <DescriptionField description={description} formContext={formContext} />,
    rawDescription: description,
    help: <Help help={help} />,
    imageHint: <ImageHint id={id} name={name} schema={schema} uiSchema={uiSchema['ui:imageHelper']} />,
    id,
    name,
    label,
    hidden,
    methods,
    required,
    disabled,
    readonly,
    displayLabel,
    formContext,
    fields,
    schema,
    uiSchema,
    registry,
  }

  return <FieldTemplate {...fieldProps}>{field}</FieldTemplate>
}

export default SchemaField
