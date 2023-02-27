import { CommonProps } from 'jsonshema-form-core'
import { Controller } from 'react-hook-form'

export { BaseInput }

function BaseInput({
  name,
  required,
  readonly,
  methods,
  uiSchema,
  disabled,
  type,
}: CommonProps & { type: 'text' | 'number' | 'date' }) {
  return (
    <Controller
      name={name}
      rules={{ required }}
      control={methods.control}
      render={({ field }) => (
        <input
          className="form-control"
          disabled={disabled}
          readOnly={readonly}
          placeholder={uiSchema?.['ui:placeholder'] || ''}
          type={type}
          {...field}
        />
      )}
    />
  )
}
