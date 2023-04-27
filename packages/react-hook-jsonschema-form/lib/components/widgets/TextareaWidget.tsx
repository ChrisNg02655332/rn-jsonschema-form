import { CommonProps } from 'jsonshema-form-core'

export { TextareaWidget }

function TextareaWidget({ name, required, methods, schema, uiSchema, disabled }: CommonProps) {
  const { register } = methods
  const fieldName = schema?.parentKey ? `${schema?.parentKey}.${name}` : `${name}`

  return (
    <textarea
      className="form-control"
      placeholder={uiSchema?.['ui:placeholder'] || ''}
      {...register(fieldName, { required, disabled })}
    ></textarea>
  )
}
