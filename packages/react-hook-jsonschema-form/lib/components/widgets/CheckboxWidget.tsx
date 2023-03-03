import { CommonProps } from 'jsonshema-form-core'
import { Controller } from 'react-hook-form'

export { CheckboxWidget }

function CheckboxWidget({ name, schema, disabled, readonly, label, required, DescriptionField, methods }: CommonProps) {
  const fieldName = schema?.parentKey ? `${schema?.parentKey}.${name}` : `${name}`

  return (
    <Controller
      name={fieldName}
      rules={{ required }}
      control={methods.control}
      render={({ field }) => (
        <div className="form-check">
          {schema.description && <DescriptionField description={schema.description} />}
          <input
            className="form-check-input"
            type="checkbox"
            disabled={disabled}
            readOnly={readonly}
            id={name}
            {...field}
          />
          <label className="form-check-label" htmlFor={name}>
            {label}
          </label>
        </div>
      )}
    />
  )
}
