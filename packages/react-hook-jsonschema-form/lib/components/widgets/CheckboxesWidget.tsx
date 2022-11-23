import { CommonProps } from 'jsonshema-form-core'

const CheckboxesWidget = ({ id, disabled, options, readonly, name, methods, required }: CommonProps) => {
  const { register } = methods
  const { enumOptions, enumDisabled } = options

  return (
    <div className="checkboxes" id={id}>
      {enumOptions.map((option, index) => {
        const itemDisabled = enumDisabled && enumDisabled.indexOf(option.value) !== -1
        const disabledCls = disabled || itemDisabled || readonly ? 'disabled' : ''

        return (
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={`${id}_${index}`}
              defaultValue={option.value}
              disabled={!!disabledCls}
              {...register(`${name}.${index}`, {
                disabled: disabled || itemDisabled || readonly,
                required,
              })}
            />
            <label className="form-check-label" htmlFor={`${id}_${index}`}>
              {option.label}
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default CheckboxesWidget