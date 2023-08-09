import React from 'react'
import mergeAllOf from 'json-schema-merge-allof'
import jsonpointer from 'jsonpointer'
import { union } from 'lodash'
import * as ReactIs from 'react-is'

export const ADDITIONAL_PROPERTY_FLAG = '__additional_property'

const widgetMap: any = {
  boolean: {
    checkbox: 'CheckboxWidget',
    // radio: 'RadioWidget',
    select: 'SelectWidget',
    radio: 'RadioWidget',
    // hidden: 'HiddenWidget',
  },
  string: {
    text: 'TextWidget',
    // email: 'EmailWidget',
    // uri: 'URLWidget',
    // radio: 'RadioWidget',
    // password: 'PasswordWidget',
    // 'hostname': 'TextWidget',
    // 'ipv4': 'TextWidget',
    // 'ipv6': 'TextWidget',
    // 'data-url': 'FileWidget',
    select: 'SelectWidget',
    textarea: 'TextareaWidget',
    // 'hidden': 'HiddenWidget',
    // date: 'DateWidget',
    // datetime: 'DateTimeWidget',
    // 'date-time': 'DateTimeWidget',
    // 'alt-date': 'AltDateWidget',
    // 'alt-datetime': 'AltDateTimeWidget',
    // 'color': 'ColorWidget',
    // file: 'FileWidget',
  },
  number: {
    text: 'TextWidget',
    select: 'SelectWidget',
    // updown: 'UpDownWidget',
    // range: 'RangeWidget',
    // radio: 'RadioWidget',
    // hidden: 'HiddenWidget',
  },
  integer: {
    text: 'TextWidget',
    select: 'SelectWidget',
    // updown: 'UpDownWidget',
    // range: 'RangeWidget',
    // radio: 'RadioWidget',
    // hidden: 'HiddenWidget',
  },
  array: {
    select: 'SelectWidget',
    checkboxes: 'CheckboxesWidget',
    // files: 'FileWidget',
    // hidden: 'HiddenWidget',
  },
}

export const isObject = (thing: any): boolean => {
  //   if (typeof File !== 'undefined' && thing instanceof File) {
  //     return false
  //   }
  return typeof thing === 'object' && thing !== null && !Array.isArray(thing)
}

export const findSchemaDefinition = ($ref: string, rootSchema = {}): any => {
  const origRef = $ref
  if ($ref.startsWith('#')) {
    // Decode URI fragment representation.
    $ref = decodeURIComponent($ref.substring(1))
  } else {
    throw new Error(`Could not find a definition for ${origRef}.`)
  }
  const current = jsonpointer.get(rootSchema, $ref)
  if (current === undefined) {
    throw new Error(`Could not find a definition for ${origRef}.`)
  }
  if (current.hasOwnProperty('$ref')) {
    return findSchemaDefinition(current.$ref, rootSchema)
  }
  return current
}

const resolveReference = (schema: any, rootSchema: any) => {
  // Retrieve the referenced schema definition.
  const $refSchema = findSchemaDefinition(schema.$ref, rootSchema)

  // Drop the $ref property of the source schema.
  const { $ref, ...localSchema } = schema

  // Update referenced schema definition with local schema properties.
  return retrieveSchema({ ...$refSchema, ...localSchema }, rootSchema)
}

export const getMatchingOption = (options: Array<any>) => {
  // For performance, skip validating subschemas if formData is undefined. We just
  // want to get the first option in that case.
  for (let i = 0; i < options.length; i++) {
    const option = options[i]

    // If the schema describes an object then we need to add slightly more
    // strict matching to the schema, because unless the schema uses the
    // "requires" keyword, an object will match the schema as long as it
    // doesn't have matching keys with a conflicting type. To do this we use an
    // "anyOf" with an array of requires. This augmentation expresses that the
    // schema should match if any of the keys in the schema are present on the
    // object and pass validation.
    if (option.properties) {
      // Create an "anyOf" schema that requires at least one of the keys in the
      // "properties" object
      const requiresAnyOf = {
        anyOf: Object.keys(option.properties).map((key) => ({
          required: [key],
        })),
      }

      let augmentedSchema

      // If the "anyOf" keyword already exists, wrap the augmentation in an "allOf"
      if (option.anyOf) {
        // Create a shallow clone of the option
        const { ...shallowClone } = option

        if (!shallowClone.allOf) {
          shallowClone.allOf = []
        } else {
          // If "allOf" already exists, shallow clone the array
          shallowClone.allOf = shallowClone.allOf.slice()
        }

        shallowClone.allOf.push(requiresAnyOf)

        augmentedSchema = shallowClone
      } else {
        augmentedSchema = Object.assign({}, option, requiresAnyOf)
      }

      // Remove the "required" field as it's likely that not all fields have
      // been filled in yet, which will mean that the schema is not valid
      delete augmentedSchema.required
    }
  }
  return 0
}

export const guessType = (value: any) => {
  if (Array.isArray(value)) {
    return 'array'
  } else if (typeof value === 'string') {
    return 'string'
  } else if (value == null) {
    return 'null'
  } else if (typeof value === 'boolean') {
    return 'boolean'
  } else if (!isNaN(value)) {
    return 'number'
  } else if (typeof value === 'object') {
    return 'object'
  }
  // Default to string if we can't figure it out
  return 'string'
}

/* Gets the type of a given schema. */
export const getSchemaType = (schema: any) => {
  let { type } = schema

  if (!type && schema.const) {
    return guessType(schema.const)
  }

  if (!type && schema.enum) {
    return 'string'
  }

  if (!type && (schema.properties || schema.additionalProperties)) {
    return 'object'
  }

  if (type instanceof Array && type.length === 2 && type.includes('null')) {
    return type.find((item) => item !== 'null')
  }

  return type
}

/**
 * Recursively merge deeply nested schemas.
 * The difference between mergeSchemas and mergeObjects
 * is that mergeSchemas only concats arrays for
 * values under the "required" keyword, and when it does,
 * it doesn't include duplicate values.
 */
export const mergeSchemas = (obj1: any, obj2: any) => {
  var _acc = Object.assign({}, obj1) // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {},
      right = obj2[key]
    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeSchemas(left, right)
    } else if (
      obj1 &&
      obj2 &&
      (getSchemaType(obj1) === 'object' || getSchemaType(obj2) === 'object') &&
      key === 'required' &&
      Array.isArray(left) &&
      Array.isArray(right)
    ) {
      // Don't include duplicate values when merging
      // "required" fields.
      acc[key] = union(left, right)
    } else {
      acc[key] = right
    }
    return acc
  }, _acc)
}

const withExactlyOneSubschema = (schema: any, rootSchema: any, dependencyKey: string, oneOf: any) => {
  const validSubschemas = oneOf.filter((subschema: any): any => {
    if (!subschema.properties) {
      return false
    }
    const { [dependencyKey]: conditionPropertySchema } = subschema.properties
    if (conditionPropertySchema) {
      // const conditionSchema = {
      //   type: 'object',
      //   properties: {
      //     [dependencyKey]: conditionPropertySchema,
      //   },
      // }
      // TODO: Check it again
      // const { errors } = validateFormData(formData, conditionSchema)
      // return errors.length === 0
    }
  })

  if (validSubschemas.length !== 1) {
    console.warn("ignoring oneOf in dependencies because there isn't exactly one subschema that is valid")
    return schema
  }

  const subschema = validSubschemas[0]
  const { [dependencyKey]: conditionPropertySchema, ...dependentSubschema } = subschema.properties
  const dependentSchema = { ...subschema, properties: dependentSubschema }

  return mergeSchemas(schema, retrieveSchema(dependentSchema, rootSchema))
}

const withDependentSchema = (schema: any, rootSchema: any, dependencyKey: any, dependencyValue: any) => {
  let { oneOf, ...dependentSchema } = retrieveSchema(dependencyValue, rootSchema)
  schema = mergeSchemas(schema, dependentSchema)
  // Since it does not contain oneOf, we return the original schema.
  if (oneOf === undefined) {
    return schema
  } else if (!Array.isArray(oneOf)) {
    throw new Error(`invalid: it is some ${typeof oneOf} instead of an array`)
  }
  // Resolve $refs inside oneOf.
  const resolvedOneOf = oneOf.map((subschema) =>
    subschema.hasOwnProperty('$ref') ? resolveReference(subschema, rootSchema) : subschema
  )
  return withExactlyOneSubschema(schema, rootSchema, dependencyKey, resolvedOneOf)
}

const withDependentProperties = (schema: any, additionallyRequired: any) => {
  if (!additionallyRequired) {
    return schema
  }
  const required = Array.isArray(schema.required)
    ? Array.from(new Set([...schema.required, ...additionallyRequired]))
    : additionallyRequired
  return { ...schema, required: required }
}

const processDependencies = (dependencies: any, resolvedSchema: any, rootSchema: any): any => {
  // Process dependencies updating the local schema properties as appropriate.
  for (const dependencyKey in dependencies) {
    // Skip this dependency if it is not included in the schema (such as when dependencyKey is itself a hidden dependency.)
    if (resolvedSchema.properties && !(dependencyKey in resolvedSchema.properties)) {
      continue
    }
    const { [dependencyKey]: dependencyValue, ...remainingDependencies } = dependencies
    if (Array.isArray(dependencyValue)) {
      resolvedSchema = withDependentProperties(resolvedSchema, dependencyValue)
    } else if (isObject(dependencyValue)) {
      resolvedSchema = withDependentSchema(resolvedSchema, rootSchema, dependencyKey, dependencyValue)
    }
    return processDependencies(remainingDependencies, resolvedSchema, rootSchema)
  }
  return resolvedSchema
}

const resolveDependencies = (schema: any, rootSchema: any) => {
  // Drop the dependencies from the source schema.
  let { dependencies = {}, ...resolvedSchema } = schema
  if ('oneOf' in resolvedSchema) {
    resolvedSchema = resolvedSchema.oneOf[getMatchingOption(resolvedSchema.oneOf)]
  } else if ('anyOf' in resolvedSchema) {
    resolvedSchema = resolvedSchema.anyOf[getMatchingOption(resolvedSchema.anyOf)]
  }
  return processDependencies(dependencies, resolvedSchema, rootSchema)
}

export const resolveSchema = (schema: any, rootSchema = {}): any => {
  if (schema.hasOwnProperty('$ref')) {
    return resolveReference(schema, rootSchema)
  } else if (schema.hasOwnProperty('dependencies')) {
    const resolvedSchema = resolveDependencies(schema, rootSchema)
    return retrieveSchema(resolvedSchema, rootSchema)
  } else if (schema.hasOwnProperty('allOf')) {
    return {
      ...schema,
      allOf: schema.allOf.map((allOfSubschema: any) => retrieveSchema(allOfSubschema, rootSchema)),
    }
  } else {
    // No $ref or dependencies attribute found, returning the original schema.
    return schema
  }
}

/** This function will create new "properties" items for each key in our formData */
// TODO: Check it again
export function stubExistingAdditionalProperties(schema: any, rootSchema = {}) {
  // Clone the schema so we don't ruin the consumer's original
  schema = {
    ...schema,
    properties: { ...schema.properties },
  }

  // Object.keys(formData).forEach((key) => {
  //   if (schema.properties.hasOwnProperty(key)) {
  //     // No need to stub, our schema already has the property
  //     return
  //   }

  //   let additionalProperties
  //   if (schema.additionalProperties.hasOwnProperty('$ref')) {
  //     additionalProperties = retrieveSchema({ $ref: schema.additionalProperties.$ref }, rootSchema)
  //   } else if (schema.additionalProperties.hasOwnProperty('type')) {
  //     additionalProperties = { ...schema.additionalProperties }
  //   } else {
  //     additionalProperties = { type: guessType((formData as any)[key]) }
  //   }

  //   // The type of our new key should match the additionalProperties value;
  //   schema.properties[key] = additionalProperties
  //   // Set our additional property flag so we know it was dynamically added
  //   schema.properties[key][ADDITIONAL_PROPERTY_FLAG] = true
  // })

  return schema
}

export const retrieveSchema = (schema: any, rootSchema = {}) => {
  if (!isObject(schema)) {
    return {}
  }

  let resolvedSchema = resolveSchema(schema, rootSchema)
  if ('allOf' in schema) {
    try {
      resolvedSchema = mergeAllOf({
        ...resolvedSchema,
        allOf: resolvedSchema.allOf,
      })
    } catch (e) {
      console.warn('could not merge subschemas in allOf:\n' + e)
      const { allOf, ...resolvedSchemaWithoutAllOf } = resolvedSchema
      return resolvedSchemaWithoutAllOf
    }
  }

  const hasAdditionalProperties =
    resolvedSchema.hasOwnProperty('additionalProperties') && resolvedSchema.additionalProperties !== false

  if (hasAdditionalProperties) {
    return stubExistingAdditionalProperties(resolvedSchema, rootSchema)
  }

  return resolvedSchema
}

export const getUiOptions = (uiSchema: any = {}) => {
  // get all passed options from ui:widget, ui:options, and ui:<optionName>
  return Object.keys(uiSchema)
    .filter((key) => key.indexOf('ui:') === 0)
    .reduce((options, key) => {
      const value = uiSchema[key]

      if (key === 'ui:widget' && isObject(value)) {
        console.warn('Setting options via ui:widget object is deprecated, use ui:options instead')
        return {
          ...options,
          ...(value.options || {}),
          widget: value.component,
        }
      }
      if (key === 'ui:options' && isObject(value)) {
        return { ...options, ...value }
      }
      return { ...options, [key.substring(3)]: value }
    }, {})
}

/**
 * This function checks if the given schema matches a single
 * constant value.
 */
export const isConstant = (schema: any) => {
  return (Array.isArray(schema.enum) && schema.enum.length === 1) || schema.hasOwnProperty('const')
}

export const isSelect = (_schema: any, rootSchema = {}) => {
  const schema = retrieveSchema(_schema, rootSchema)
  const altSchemas = schema.oneOf || schema.anyOf
  if (Array.isArray(schema.enum)) {
    return true
  } else if (Array.isArray(altSchemas)) {
    return altSchemas.every((item) => isConstant(item))
  }
  return false
}

export const isMultiSelect = (schema: any, rootSchema = {}) => {
  if (!schema.uniqueItems || !schema.items) {
    return false
  }
  return isSelect(schema.items, rootSchema)
}

export const isFilesArray = (schema: any, uiSchema: any, rootSchema = {}) => {
  if (uiSchema['ui:widget'] === 'files') {
    return true
  } else if (schema.items) {
    const itemsSchema = retrieveSchema(schema.items, rootSchema)
    return itemsSchema.type === 'string' && itemsSchema.format === 'data-url'
  }
  return false
}

export const getDisplayLabel = (schema: any, uiSchema: any = {}, rootSchema: any): boolean => {
  const uiOptions: any = getUiOptions(uiSchema)
  let { label: displayLabel = true } = uiOptions
  if (schema.type === 'array') {
    displayLabel = isMultiSelect(schema, rootSchema) || isFilesArray(schema, uiSchema, rootSchema)
  }
  if (schema.type === 'object') {
    displayLabel = false
  }
  if (schema.type === 'boolean' && !uiSchema['ui:widget']) {
    displayLabel = false
  }
  if (uiSchema['ui:field']) {
    displayLabel = false
  }
  return displayLabel
}

export const orderProperties = (properties: any, order: Array<string> = []) => {
  if (!order.length) {
    return properties
  }

  const arrayToHash = (arr: any) =>
    arr.reduce((prev: any, curr: any) => {
      prev[curr] = true
      return prev
    }, {})
  const errorPropList = (arr: any) => (arr.length > 1 ? `properties '${arr.join("', '")}'` : `property '${arr[0]}'`)
  const propertyHash = arrayToHash(properties)
  const orderFiltered = order.filter((prop) => prop === '*' || propertyHash[prop])
  const orderHash = arrayToHash(orderFiltered)

  const rest = properties.filter((prop: any) => !orderHash[prop])
  const restIndex = orderFiltered.indexOf('*')
  if (restIndex === -1) {
    if (rest.length) {
      throw new Error(`uiSchema order list does not contain ${errorPropList(rest)}`)
    }
    return orderFiltered
  }
  if (restIndex !== orderFiltered.lastIndexOf('*')) {
    throw new Error('uiSchema order list contains more than one wildcard item')
  }

  const complete = [...orderFiltered]
  complete.splice(restIndex, 1, ...rest)
  return complete
}

export const getWidget = (schema: any, widget: any, registeredWidgets = {}): any => {
  const type = getSchemaType(schema)

  const mergeOptions = (Widget: any) => {
    // cache return value as property of widget for proper react reconciliation
    if (!Widget.MergedWidget) {
      const defaultOptions = (Widget.defaultProps && Widget.defaultProps.options) || {}
      Widget.MergedWidget = ({ options = {}, ...props }) => (
        <Widget options={{ ...defaultOptions, ...options }} {...props} />
      )
    }
    return Widget.MergedWidget
  }

  if (typeof widget === 'function' || ReactIs.isForwardRef(React.createElement(widget)) || ReactIs.isMemo(widget)) {
    return mergeOptions(widget)
  }

  if (typeof widget !== 'string') {
    throw new Error(`Unsupported widget definition: ${typeof widget}`)
  }

  if (registeredWidgets.hasOwnProperty(widget)) {
    const registeredWidget = (registeredWidgets as any)[widget]
    return getWidget(schema, registeredWidget, registeredWidgets)
  }

  if (!widgetMap.hasOwnProperty(type)) {
    throw new Error(`No widget for type "${type}"`)
  }

  if (widgetMap[type].hasOwnProperty(widget)) {
    const registeredWidget = (registeredWidgets as any)[widgetMap[type][widget]]
    return getWidget(schema, registeredWidget, registeredWidgets)
  }

  throw new Error(`No widget "${widget}" for type "${type}"`)
}

export const toConstant = (schema: any) => {
  if (Array.isArray(schema.enum) && schema.enum.length === 1) {
    return schema.enum[0]
  } else if (schema.hasOwnProperty('const')) {
    return schema.const
  } else {
    throw new Error('schema cannot be inferred as a constant')
  }
}

export const optionsList = (schema: any) => {
  if (schema.enum) {
    return schema.enum.map((value: string, i: number) => {
      const label = (schema.enumNames && schema.enumNames[i]) || String(value)
      return { label, value }
    })
  } else {
    const altSchemas = schema.oneOf || schema.anyOf
    return altSchemas.map((item: any) => {
      const value = toConstant(item)
      const label = item.title || String(value)
      return {
        schema,
        label,
        value,
      }
    })
  }
}

export const hasWidget = (schema: any, widget: any, registeredWidgets = {}): boolean => {
  try {
    getWidget(schema, widget, registeredWidgets)
    return true
  } catch (err: any) {
    if (err.message && (err.message.startsWith('No widget') || err.message.startsWith('Unsupported widget'))) {
      return false
    }
    throw err
  }
}

export const toIdSchema = (
  schema: any,
  id: string | null,
  rootSchema: any,
  idPrefix = 'root',
  idSeparator = '_'
): any => {
  const idSchema: any = {
    $id: id || idPrefix,
  }
  if ('$ref' in schema || 'dependencies' in schema || 'allOf' in schema) {
    const _schema = retrieveSchema(schema, rootSchema)
    return toIdSchema(_schema, id, rootSchema, idPrefix, idSeparator)
  }
  if ('items' in schema && !schema.items.$ref) {
    return toIdSchema(schema.items, id, rootSchema, idPrefix, idSeparator)
  }
  if (schema.type !== 'object') {
    return idSchema
  }
  for (const name in schema.properties || {}) {
    const field = schema.properties[name]
    const fieldId = idSchema.$id + idSeparator + name
    idSchema[name] = toIdSchema(isObject(field) ? field : {}, fieldId, rootSchema, idPrefix, idSeparator)
  }
  return idSchema
}

export const mergeObjects = (obj1: any, obj2: any, concatArrays = false) => {
  // Recursively merge deeply nested objects.
  var acc = Object.assign({}, obj1) // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {},
      right = obj2[key]
    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeObjects(left, right, concatArrays)
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right)
    } else {
      acc[key] = right
    }
    return acc
  }, acc)
}
