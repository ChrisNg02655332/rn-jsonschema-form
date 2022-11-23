import { CommonProps } from 'jsonshema-form-core'

const SelectWidget = ({
  name,
  schema,
  id,
  options,
  methods,
  required,
  disabled,
  readonly,
  multiple,
  placeholder,
}: CommonProps) => {
  const { register } = methods
  const { enumOptions, enumDisabled } = options

  return (
    <select
      id={id}
      multiple={multiple}
      className="form-control"
      required={required}
      disabled={disabled || readonly}
      {...register(name, { required, disabled })}
    >
      {!multiple && schema.default === undefined && <option value="">{placeholder}</option>}
      {enumOptions.map(({ value, label }, i) => {
        const disabled = enumDisabled && enumDisabled.indexOf(value) !== -1
        return (
          <option key={i} value={value} disabled={disabled}>
            {label}
          </option>
        )
      })}
    </select>
  )
}

export default SelectWidget