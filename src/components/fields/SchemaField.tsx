import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

import {
  ADDITIONAL_PROPERTY_FLAG,
  isSelect,
  retrieveSchema,
  toIdSchema,
  getDefaultRegistry,
  mergeObjects,
  // deepEquals,
  getSchemaType,
  getDisplayLabel,
} from '../../utils'

import globalStyles from '../globalStyles'
import theme from '../theme'

const REQUIRED_FIELD_SYMBOL = '*'
const COMPONENT_TYPES: any = {
  array: 'ArrayField',
  boolean: 'BooleanField',
  integer: 'NumberField',
  number: 'NumberField',
  object: 'ObjectField',
  string: 'StringField',
  null: 'NullField',
}

const getFieldComponent = (
  schema: any,
  uiSchema: any,
  idSchema: any,
  fields: any
) => {
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

        return (
          <UnsupportedField
            schema={schema}
            idSchema={idSchema}
            reason={`Unknown field type ${schema.type}`}
          />
        )
      }
}

const Label = ({ label, required, id, ...props }: any) => {
  if (!label) {
    return null
  }

  return (
    <Text style={[globalStyles.label, props.style]} key={id}>
      {label}
      {required && <Text style={props.style}>{REQUIRED_FIELD_SYMBOL}</Text>}
    </Text>
  )
}

const LabelInput = ({ id, label, onChange }: any) => {
  return <TextInput key={id} defaultValue={label} onChangeText={onChange} />
}

const Help = (props: any) => {
  const { id, help } = props
  if (!help) {
    return null
  }
  if (typeof help === 'string') {
    return <Text key={id}>{help}</Text>
  }
  return <View key={id}>{help}</View>
}

const ErrorList = ({ errors = [] }: any) => {
  if (errors.length === 0) {
    return null
  }

  return (
    <View style={errorListStyles.container}>
      {errors
        .filter((elem: any) => !!elem)
        .map((error: string, index: number) => {
          return (
            <Text key={index} style={{ color: theme.danger }}>
              * {error}
            </Text>
          )
        })}
    </View>
  )
}

const errorListStyles = StyleSheet.create({
  container: { marginBottom: 15 },
})

const WrapIfAdditional = (props: any) => {
  const {
    nativeID,
    // disabled,
    style,
    label,
    onKeyChange,
    // onDropPropertyClick,
    // readonly,
    required,
    schema,
  } = props
  const keyLabel = `${label} Key` // i18n ?
  const additional = schema.hasOwnProperty(ADDITIONAL_PROPERTY_FLAG)

  if (!additional) {
    return (
      <View nativeID={nativeID} key={nativeID} style={style}>
        {props.children}
      </View>
    )
  }

  return (
    <View style={style} nativeID={nativeID} key={nativeID}>
      <View>
        <View>
          <View>
            <Label
              label={keyLabel}
              required={required}
              key={`${nativeID}-key`}
            />
            <LabelInput
              label={label}
              required={required}
              key={`${nativeID}-key`}
              onChange={onKeyChange}
            />
          </View>
        </View>
        <View>{props.children}</View>
        <View>
          {/* <IconButton
            type="danger"
            icon="remove"
            className="array-item-remove btn-block"
            tabIndex="-1"
            style={{ border: '0' }}
            disabled={disabled || readonly}
            onClick={onDropPropertyClick(label)}
          /> */}
        </View>
      </View>
    </View>
  )
}

const DefaultTemplate = (props: any) => {
  const {
    id,
    label,
    children,
    errors = [],
    help,
    description,
    hidden,
    required,
    displayLabel,
  } = props
  if (hidden) {
    // return <div className="hidden">{children}</div>
    return null
  }

  return (
    <WrapIfAdditional {...props}>
      {displayLabel && (
        <Label label={label} style={props.style} required={required} key={id} />
      )}
      {displayLabel && description ? description : null}
      {children}
      {errors}
      {help}
    </WrapIfAdditional>
  )
}

const SchemaField = (props: any) => {
  const {
    uiSchema = {},
    formData,
    errorSchema = {},
    idPrefix,
    name,
    onChange,
    onKeyChange,
    onDropPropertyClick,
    required,
    registry = getDefaultRegistry(),
    wasPropertyKeyModified = false,
    editable,
  } = props

  const { rootSchema, fields, formContext } = registry
  const FieldTemplate =
    uiSchema['ui:FieldTemplate'] || registry.FieldTemplate || DefaultTemplate

  let idSchema = props.idSchema || {}
  const schema = retrieveSchema(props.schema, rootSchema, formData)

  idSchema = mergeObjects(
    toIdSchema(schema, null, rootSchema, formData, idPrefix),
    idSchema
  )

  const FieldComponent = getFieldComponent(schema, uiSchema, idSchema, fields)
  const { DescriptionField } = fields
  const disabled = Boolean(props.disabled || uiSchema['ui:disabled'])
  const readonly = Boolean(
    props.readonly ||
      uiSchema['ui:readonly'] ||
      props.schema?.readOnly ||
      schema.readOnly
  )

  const autofocus = Boolean(props.autofocus || uiSchema['ui:autofocus'])
  if (Object.keys(schema).length === 0) {
    return null
  }

  const displayLabel = getDisplayLabel(schema, uiSchema, rootSchema)

  const { __errors, ...fieldErrorSchema } = errorSchema

  const field = (
    <FieldComponent
      {...props}
      idSchema={idSchema}
      schema={schema}
      uiSchema={{ ...uiSchema }}
      disabled={disabled}
      readonly={readonly}
      autofocus={autofocus}
      errorSchema={fieldErrorSchema}
      formContext={formContext}
      rawErrors={__errors}
    />
  )

  const id = idSchema.$id

  // If this schema has a title defined, but the user has set a new key/label, retain their input.
  let label
  if (wasPropertyKeyModified) {
    label = name
  } else {
    label = uiSchema['ui:title'] || props.schema.title || schema.title || name
  }

  const description =
    uiSchema['ui:description'] || props.schema.description || schema.description
  const errors = __errors
  const help = uiSchema['ui:help']
  const hidden = uiSchema['ui:widget'] === 'hidden'

  const style = [
    uiSchema.style || {},
    errors && errors.length > 0 ? { color: theme.danger } : {},
  ]

  const fieldProps = {
    description: (
      <DescriptionField
        key={id + '__description'}
        description={description}
        formContext={formContext}
      />
    ),
    rawDescription: description,
    help: <Help key={id + '__help'} help={help} />,
    rawHelp: typeof help === 'string' ? help : undefined,
    errors: <ErrorList errors={errors} />,
    style,
    rawErrors: errors,
    nativeID: id,
    label,
    hidden,
    onChange,
    onKeyChange,
    onDropPropertyClick,
    required,
    disabled,
    readonly,
    displayLabel,
    formContext,
    formData,
    fields,
    schema,
    uiSchema,
    registry,
    editable,
  }

  const _AnyOfField = registry.fields.AnyOfField
  const _OneOfField = registry.fields.OneOfField

  return (
    <FieldTemplate {...fieldProps}>
      {field}

      {/*
        If the schema `anyOf` or 'oneOf' can be rendered as a select control, don't
        render the selection and let `StringField` component handle
        rendering
      */}
      {schema.anyOf && !isSelect(schema) && (
        <_AnyOfField
          disabled={disabled}
          errorSchema={errorSchema}
          formData={formData}
          idPrefix={idPrefix}
          idSchema={idSchema}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
          options={schema.anyOf.map((item: any) =>
            retrieveSchema(item, rootSchema, formData)
          )}
          baseType={schema.type}
          registry={registry}
          schema={schema}
          uiSchema={uiSchema}
        />
      )}

      {schema.oneOf && !isSelect(schema) && (
        <_OneOfField
          disabled={disabled}
          errorSchema={errorSchema}
          formData={formData}
          idPrefix={idPrefix}
          idSchema={idSchema}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
          options={schema.oneOf.map((item: any) =>
            retrieveSchema(item, rootSchema, formData)
          )}
          baseType={schema.type}
          registry={registry}
          schema={schema}
          uiSchema={uiSchema}
        />
      )}
    </FieldTemplate>
  )
}

export default SchemaField
