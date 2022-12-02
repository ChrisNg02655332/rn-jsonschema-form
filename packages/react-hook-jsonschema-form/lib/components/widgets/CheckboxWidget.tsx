import { CommonProps } from 'jsonshema-form-core'

export { CheckboxWidget }

function CheckboxWidget({ name, schema, disabled, readonly, label, required, DescriptionField, methods }: CommonProps) {
  const { register } = methods
  return (
    <div className="form-check">
      {schema.description && <DescriptionField description={schema.description} />}
      <input className="form-check-input" type="checkbox" id={name} {...register(name, { required, disabled })} />
      <label className="form-check-label" htmlFor={name}>
        {label}
      </label>
    </div>
  )
}
