const CheckboxWidget = ({
  name,
  schema,
  platform,
  disabled,
  readonly,
  label,
  required,
  DescriptionField,
  methods,
}: any) => {
  const { register } = methods

  if (platform === 'web') {
    return (
      <div className="form-check">
        {schema.description && <DescriptionField description={schema.description} />}
        <input
          className="form-check-input"
          type="checkbox"
          id={name}
          {...register(name, { required, readonly, disabled })}
        />
        <label className="form-check-label" htmlFor={name}>
          {label}
        </label>
      </div>
    )
  }

  console.warn('You probably not using web. Please override CheckboxWidget to display')
  return null
}

export default CheckboxWidget
