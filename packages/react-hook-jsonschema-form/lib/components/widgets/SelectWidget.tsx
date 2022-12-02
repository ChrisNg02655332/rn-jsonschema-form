import { CommonProps } from 'jsonshema-form-core'

export { SelectWidget }

function SelectWidget({
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
}: CommonProps) {
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
      {enumOptions.map(({ value, label }: any, i: number) => {
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
