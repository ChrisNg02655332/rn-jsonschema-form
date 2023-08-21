import { Methods, getSchemaType, retrieveSchema, mergeObjects, toIdSchema } from 'jsonshema-form-core'
import React from 'react'
import { Text, View } from 'react-native'

export { SchemaField }

const REQUIRED_FIELD_SYMBOL = '*'
const COMPONENT_TYPES: any = {
  array: 'ArrayField',
  boolean: 'BooleanField',
  integer: 'NumberField',
  number: 'NumberField',
  object: 'ObjectField',
  string: 'StringField',
  // null: 'NullField',
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

function Label({ label, required }: { label: string; required: boolean }) {
  if (!label) return null

  return (
    <Text>
      {label}
      {required && REQUIRED_FIELD_SYMBOL}
    </Text>
  )
}

function Help({ help }: { help: string | any }) {
  if (!help) return null
  if (typeof help === 'string') return <Text>{help}</Text>
  return <Text>{help}</Text>
}

function ImageHelper() {
  return null
}

type DefaultTemplateProps = {
  label: string
  required: boolean
  displayLabel: boolean
  imageHint: any
}

function DefaultTemplate({
  children,
  required,
  displayLabel,
  label,
  imageHint,
}: React.PropsWithChildren<DefaultTemplateProps>) {
  return (
    <View>
      <>
        {displayLabel && <Label label={label} required={required} />}
        {children}
        {imageHint}
      </>
    </View>
  )
}

type SchemaFieldProps = {
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

function SchemaField({ name, uiSchema = {}, registry, methods, idPrefix, idSeparator, ...rest }: SchemaFieldProps) {
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
      required={rest.required}
      name={name}
      idSchema={idSchema}
      schema={schema}
      uiSchema={uiSchema}
      methods={methods}
      formContext={formContext}
      disabled={disabled}
      readonly={readonly}
      registry={registry}
    />
  )

  const id = idSchema.$id

  // const displayLabel = getDisplayLabel(schema, uiSchema, rootSchema)
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
    required: rest.required,
    disabled,
    readonly,
    /** TODO: Dont display label for rn. Need to find solution for this point */
    displayLabel: false,
    formContext,
    fields,
    schema,
    uiSchema,
    registry,
  }

  return <FieldTemplate {...fieldProps}>{field}</FieldTemplate>
}
