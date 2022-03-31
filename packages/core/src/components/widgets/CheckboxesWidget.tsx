// const selectValue = (value, selected, all) => {
//   const at = all.indexOf(value)
//   const updated = selected.slice(0, at).concat(value, selected.slice(at))
//   // As inserting values at predefined index positions doesn't work with empty
//   // arrays, we need to reorder the updated selection to match the initial order
//   return updated.sort((a, b) => all.indexOf(a) > all.indexOf(b))
// }

// const deselectValue = (value, selected) => {
//   return selected.filter((v) => v !== value)
// }

const CheckboxesWidget = ({
  name,
  schema,
  platform,
  disabled,
  readonly,
  label,
  required,
  DescriptionField,
  methods,
  options,
}: any) => {
  // const { id, disabled, options, value, autofocus, readonly, onChange } = props
  // const { register } = methods
  // const { enumOptions, enumDisabled, inline } = options

  if (platform === 'web') {
    // return (
    //   <div className="checkboxes" id={id}>
    //     {enumOptions.map((option, index) => {
    //       const checked = value.indexOf(option.value) !== -1
    //       const itemDisabled = enumDisabled && enumDisabled.indexOf(option.value) !== -1
    //       const disabledCls = disabled || itemDisabled || readonly ? 'disabled' : ''

    //       const checkbox = (
    //         <span>
    //           <input
    //             type="checkbox"
    //             id={`${id}_${index}`}
    //             checked={checked}
    //             disabled={disabled || itemDisabled || readonly}
    //             autoFocus={autofocus && index === 0}
    //             onChange={(event) => {
    //               const all = enumOptions.map(({ value }) => value)
    //               if (event.target.checked) {
    //                 onChange(selectValue(option.value, value, all))
    //               } else {
    //                 onChange(deselectValue(option.value, value))
    //               }
    //             }}
    //           />
    //           <span>{option.label}</span>
    //         </span>
    //       )

    //       return inline ? (
    //         <label key={index} className={`checkbox-inline ${disabledCls}`}>
    //           {checkbox}
    //         </label>
    //       ) : (
    //         <div key={index} className={`checkbox ${disabledCls}`}>
    //           <label>{checkbox}</label>
    //         </div>
    //       )
    //     })}
    //   </div>
    // )
    console.warn(`This's not implement yet.`)
    return null
  }

  console.warn('You probably not using web. Please override CheckboxesWidget to display')
  return null
}

export default CheckboxesWidget
