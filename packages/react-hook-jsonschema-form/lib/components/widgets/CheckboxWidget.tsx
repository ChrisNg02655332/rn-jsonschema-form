import React from 'react'
import { CommonProps } from 'jsonshema-form-core'

const CheckboxWidget = ({
  name,
  schema,
  disabled,
  readonly,
  label,
  required,
  DescriptionField,
  methods,
}: CommonProps) => {
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

export default CheckboxWidget
