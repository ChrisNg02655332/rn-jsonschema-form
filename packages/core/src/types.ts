import { FieldValues, UseFormReturn } from 'react-hook-form'

export type Platform = 'web' | 'mobile'

export type Methods = UseFormReturn<FieldValues, any>

export type CommonProps = {
  id?: string
  label?: string
  name: string
  options?: any
  methods: Methods
  registry?: any
  schema: any
  uiSchema: any
  required?: boolean
  fields?: any
  description?: React.ReactElement
  rawDescription?: any
  help?: React.ReactElement
  hidden?: boolean
  disabled?: boolean
  readonly?: boolean
  displayLabel?: boolean
  placeholder?: string
  idSchema?: any
  idPrefix?: string
  idSeparator?: any
  multiple?: boolean
  DescriptionField?: any
}
