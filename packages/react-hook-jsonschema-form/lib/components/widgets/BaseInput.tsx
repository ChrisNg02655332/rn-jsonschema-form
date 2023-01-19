import { CommonProps } from 'jsonshema-form-core'
import { Controller } from 'react-hook-form'

export { BaseInput }

function BaseInput({
  name,
  required,
  readonly,
  placeholder,
  disabled,
  type,
}: CommonProps & { type: 'text' | 'number' | 'date' }) {
  return (
    <Controller
      name={name}
      rules={{ required }}
      render={({ field }) => (
        <input
          className="form-control"
          disabled={disabled}
          readOnly={readonly}
          placeholder={placeholder}
          type={type}
          {...field}
        />
      )}
    />
  )
}
