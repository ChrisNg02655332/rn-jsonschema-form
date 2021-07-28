import React, { useState } from 'react'
import { Text, View } from 'react-native'

import {
  getDefaultRegistry,
  retrieveSchema,
  orderProperties,
  ADDITIONAL_PROPERTY_FLAG,
} from '../../utils'

const DefaultObjectFieldTemplate = (props: any) => {
  const { TitleField, DescriptionField } = props
  return (
    <View key={props.idSchema.$id} nativeID={props.idSchema.$id}>
      {(props.uiSchema['ui:title'] || props.title) && (
        <TitleField
          id={`${props.idSchema.$id}__title`}
          title={props.title || props.uiSchema['ui:title']}
          required={props.required}
          formContext={props.formContext}
        />
      )}

      {props.description && (
        <DescriptionField
          id={`${props.idSchema.$id}__description`}
          description={props.description}
          formContext={props.formContext}
        />
      )}

      {props.properties.map((prop: any, idx: number) => (
        <View key={idx} style={{ zIndex: props.properties.length - 1 }}>
          {prop.content}
        </View>
      ))}

      {/* {canExpand(props.schema, props.uiSchema, props.formData) && (
        <AddButton
          className="object-property-expand"
          onClick={props.onAddClick(props.schema)}
          disabled={props.disabled || props.readonly}
        />
      )} */}
    </View>
  )
}

const ObjectField = ({
  uiSchema,
  idSchema,
  required,
  disabled,
  readonly,
  idPrefix,
  onBlur,
  onFocus,
  registry = getDefaultRegistry(),
  ...props
}: any) => {
  const [state, setState] = useState<any>({})

  const { rootSchema, fields, formContext } = registry
  const { SchemaField, TitleField, DescriptionField } = fields
  const schema = retrieveSchema(props.schema, rootSchema, props.formData)
  const title = schema.title === undefined ? props.name : schema.title
  const description = uiSchema['ui:description'] || schema.description
  let orderedProperties

  try {
    const properties = Object.keys(schema.properties || {})
    orderedProperties = orderProperties(properties, uiSchema['ui:order'])
  } catch (err) {
    return (
      <View>
        <Text>
          Invalid {props.name || 'root'} object field configuration:
          <Text>{err.message}</Text>.
        </Text>
        <Text>{JSON.stringify(schema)}</Text>
      </View>
    )
  }

  const isRequired = (name: string) => {
    const _schema = props.schema
    return (
      Array.isArray(_schema.required) && _schema.required.indexOf(name) !== -1
    )
  }

  const getAvailableKey = (preferredKey: string, formData: any) => {
    var index = 0
    var newKey = preferredKey
    while (formData.hasOwnProperty(newKey)) {
      newKey = `${preferredKey}-${++index}`
    }
    return newKey
  }

  const onKeyChange = (oldValue: any) => {
    return (value: any, errorSchema: any) => {
      if (oldValue === value) {
        return
      }

      value = getAvailableKey(value, props.formData)
      const newFormData = { ...props.formData }
      const newKeys: any = { [oldValue]: value }
      const keyValues = Object.keys(newFormData).map((key) => {
        const newKey = newKeys[key] || key
        return { [newKey]: newFormData[key] }
      })
      const renamedObj = Object.assign({}, ...keyValues)

      setState({ ...state, wasPropertyKeyModified: true })

      props.onChange(
        renamedObj,
        errorSchema &&
          props.errorSchema && {
            ...props.errorSchema,
            [value]: errorSchema,
          }
      )
    }
  }

  const onPropertyChange = (
    name: string,
    addedByAdditionalProperties = false
  ) => {
    return (value: any, errorSchema: any) => {
      if (!value && addedByAdditionalProperties) {
        // Don't set value = undefined for fields added by
        // additionalProperties. Doing so removes them from the
        // formData, which causes them to completely disappear
        // (including the input field for the property name). Unlike
        // fields which are "mandated" by the schema, these fields can
        // be set to undefined by clicking a "delete field" button, so
        // set empty values to the empty string.
        value = ''
      }
      const newFormData = { ...props.formData, [name]: value }
      props.onChange(
        newFormData,
        errorSchema &&
          props.errorSchema && {
            ...props.errorSchema,
            [name]: errorSchema,
          }
      )
    }
  }

  const onDropPropertyClick = (key: string) => {
    return (event: any) => {
      event.preventDefault()
      const copiedFormData = { ...props.formData }
      delete copiedFormData[key]

      props.onChange(copiedFormData)
    }
  }

  const getDefaultValue = (
    type: 'string' | 'array' | 'boolean' | 'null' | 'number' | 'object' | any
  ) => {
    switch (type) {
      case 'string':
        return 'New Value'
      case 'array':
        return []
      case 'boolean':
        return false
      case 'null':
        return null
      case 'number':
        return 0
      case 'object':
        return {}
      default:
        // We don't have a datatype for some reason (perhaps additionalProperties was true)
        return 'New Value'
    }
  }

  const handleAddClick = (_schema: any) => () => {
    let type = _schema.additionalProperties.type
    const newFormData = { ...props.formData }

    if (schema.additionalProperties.hasOwnProperty('$ref')) {
      const _registry = props.registry || getDefaultRegistry()
      const refSchema = retrieveSchema(
        { $ref: schema.additionalProperties.$ref },
        _registry.rootSchema,
        props.formData
      )

      type = refSchema.type
    }

    newFormData[getAvailableKey('newKey', newFormData)] = getDefaultValue(type)

    props.onChange(newFormData)
  }

  const Template =
    uiSchema['ui:ObjectFieldTemplate'] ||
    registry.ObjectFieldTemplate ||
    DefaultObjectFieldTemplate

  const templateProps = {
    title: uiSchema['ui:title'] || title,
    description,
    TitleField,
    DescriptionField,
    properties: orderedProperties.map((name: string) => {
      const addedByAdditionalProperties = schema.properties[
        name
      ].hasOwnProperty(ADDITIONAL_PROPERTY_FLAG)
      const fieldUiSchema = addedByAdditionalProperties
        ? uiSchema.additionalProperties
        : uiSchema[name]
      const hidden = fieldUiSchema && fieldUiSchema['ui:widget'] === 'hidden'

      return {
        content: (
          <SchemaField
            key={name}
            name={name}
            required={isRequired(name)}
            schema={schema.properties[name]}
            uiSchema={fieldUiSchema}
            errorSchema={props.errorSchema[name]}
            idSchema={idSchema[name]}
            idPrefix={idPrefix}
            formData={(props.formData || {})[name]}
            wasPropertyKeyModified={state.wasPropertyKeyModified}
            onKeyChange={onKeyChange(name)}
            onChange={onPropertyChange(name, addedByAdditionalProperties)}
            onBlur={onBlur}
            onFocus={onFocus}
            registry={registry}
            disabled={disabled}
            readonly={readonly}
            onDropPropertyClick={onDropPropertyClick}
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
    formData: props.formData,
    formContext,
    registry,
  }

  return <Template {...templateProps} onAddClick={handleAddClick} />
}

export default ObjectField
