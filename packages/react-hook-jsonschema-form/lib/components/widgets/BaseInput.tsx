import { Controller } from 'react-hook-form'
import { CommonProps } from 'jsonshema-form-core'

import { get } from 'lodash'

export { BaseInput }

function BaseInput({
  name,
  required,
  readonly,
  methods,
  uiSchema,
  disabled,
  type,
  schema,
}: CommonProps & { type: 'text' | 'number' | 'date' }) {
  const fieldName = schema?.parentKey ? `${schema?.parentKey}.${name}` : name
  const error = get(methods.formState.errors, fieldName)

  return (
    <Controller
      name={fieldName}
      rules={{ required }}
      control={methods.control}
      render={({ field }) => (
        <input
          className={`form-control ${error ? 'is-invalid' : ''}`}
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
