import { Methods, Platform } from '../../types'
import { getDisplayLabel, getSchemaType, retrieveSchema } from '../../utils'

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

const getFieldComponent = (schema: any, uiSchema: any, fields: any) => {
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

// NOTE: only use for web
const Label = ({ label, required }: { label: string; required: boolean }) => {
  if (!label) return null

  return (
    <label>
      {label}
      {required && REQUIRED_FIELD_SYMBOL}
    </label>
  )
}

// NOTE: only use for web
const Help = ({ help }: { help: string | any }) => {
  if (!help) {
    return null
  }
  if (typeof help === 'string') {
    return <p>{help}</p>
  }
  return <span>{help}</span>
}

const DefaultTemplate = (props: any) => {
  const { platform, children, required, displayLabel, label } = props

  if (platform === 'web') {
    return (
      <div className="mb-3">
        {displayLabel && <Label label={label} required={required} />}
        {children}
      </div>
    )
  }

  return children
}

type Props = {
  name: string
  schema: any
  uiSchema?: any
  platform?: Platform
  methods: Methods
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  registry?: any
}

const SchemaField = ({ name, uiSchema = {}, platform, registry, methods, ...rest }: Props) => {
  const { rootSchema, fields, formContext } = registry

  const FieldTemplate = uiSchema['ui:FieldTemplate'] || registry.FieldTemplate || DefaultTemplate

  const schema = retrieveSchema(rest.schema, rootSchema, {})
  const FieldComponent = getFieldComponent(schema, uiSchema, fields)
  const { DescriptionField } = fields
  const disabled = Boolean(rest.disabled || uiSchema['ui:disabled'])
  const readonly = Boolean(rest.readonly || uiSchema['ui:readonly'] || rest.schema?.readOnly || schema.readOnly)
  // const autofocus = Boolean(rest.autofocus || uiSchema['ui:autofocus'])

  if (Object.keys(schema).length === 0) {
    return null
  }

  const field = (
    <FieldComponent
      name={name}
      schema={schema}
      uiSchema={uiSchema}
      methods={methods}
      formContext={formContext}
      platform={platform}
      disabled={disabled}
      readonly={readonly}
      registry={registry}
    />
  )
  if (!field) console.warn('Please update ui:FieldTemplate or regiter new one')

  const displayLabel = getDisplayLabel(schema, uiSchema, rootSchema)
  let label = uiSchema['ui:title'] || rest.schema.title || schema.title

  const description = uiSchema['ui:description'] || rest.schema.description || schema.description
  // const errors = __errors
  const help = uiSchema['ui:help']
  const hidden = uiSchema['ui:widget'] === 'hidden'

  const fieldProps = {
    name,
    methods,
    registry,
    schema,
    uiSchema,
    platform,
    fields,
    description: <DescriptionField description={description} formContext={formContext} />,
    rawDescription: description,
    help: platform === 'web' ? <Help help={help} /> : null,
    label,
    hidden,
    required: rest.required,
    disabled,
    readonly,
    displayLabel,
  }

  return <FieldTemplate {...fieldProps}>{field}</FieldTemplate>
}

export default SchemaField
