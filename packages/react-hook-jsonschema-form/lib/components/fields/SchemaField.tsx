import { Methods, getDisplayLabel, getSchemaType, retrieveSchema, mergeObjects, toIdSchema } from 'jsonshema-form-core'

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

const Label = ({ label, required }: { label: string; required: boolean }) => {
  if (!label) return null

  return (
    <label>
      {label}
      {required && REQUIRED_FIELD_SYMBOL}
    </label>
  )
}

const Help = ({ help }: { help: string | any }) => {
  if (!help) return null
  if (typeof help === 'string') return <p>{help}</p>
  return <span>{help}</span>
}

const DefaultTemplate: React.FC<{ label: string; required: boolean; displayLabel: boolean }> = ({
  children,
  required,
  displayLabel,
  label,
}) => {
  return (
    <div className="mb-3">
      {displayLabel && <Label label={label} required={required} />}
      {children}
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

const SchemaField = ({ name, uiSchema = {}, registry, methods, idPrefix, idSeparator, ...rest }: Props) => {
  const { rootSchema, fields, formContext } = registry

  const FieldTemplate = uiSchema['ui:FieldTemplate'] || registry.FieldTemplate || DefaultTemplate

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
    />
  )

  const id = idSchema.$id

  const displayLabel = getDisplayLabel(schema, uiSchema, rootSchema)
  let label = uiSchema['ui:title'] || rest.schema.title || schema.title
  const description = uiSchema['ui:description'] || rest.schema.description || schema.description
  const help = uiSchema['ui:help']
  const hidden = uiSchema['ui:widget'] === 'hidden'

  const fieldProps = {
    description: <DescriptionField description={description} formContext={formContext} />,
    rawDescription: description,
    help: <Help help={help} />,
    id,
    name,
    label,
    hidden,
    methods,
    required: rest.required,
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
