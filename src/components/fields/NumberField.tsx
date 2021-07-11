import React from 'react'

import { asNumber } from '../../utils'

// Matches a string that ends in a . character, optionally followed by a sequence of
// digits followed by any number of 0 characters up until the end of the line.
// Ensuring that there is at least one prefixed character is important so that
// you don't incorrectly match against "0".
const trailingCharMatcherWithPrefix = /\.([0-9]*0)*$/

// This is used for trimming the trailing 0 and . characters without affecting
// the rest of the string. Its possible to use one RegEx with groups for this
// functionality, but it is fairly complex compared to simply defining two
// different matchers.
const trailingCharMatcher = /[0.]0*$/

const NumberField = (props: any) => {
  const { StringField } = props.registry.fields
  const { formData, ...rest } = props
  let value = formData

  const [lastValue, setLastValue] = React.useState(props.value)

  if (typeof lastValue === 'string' && typeof value === 'number') {
    // Construct a regular expression that checks for a string that consists
    // of the formData value suffixed with zero or one '.' characters and zero
    // or more '0' characters
    const re = new RegExp(`${value}`.replace('.', '\\.') + '\\.?0*$')

    // If the cached "lastValue" is a match, use that instead of the formData
    // value to prevent the input value from changing in the UI
    if (lastValue.match(re)) {
      value = lastValue
    }
  }

  const handleChange = (val: string) => {
    // Cache the original value in component state
    setLastValue(val)

    // Normalize decimals that don't start with a zero character in advance so
    // that the rest of the normalization logic is simpler
    if (`${val}`.charAt(0) === '.') {
      val = `0${val}`
    }

    // Check that the value is a string (this can happen if the widget used is a
    // <select>, due to an enum declaration etc) then, if the value ends in a
    // trailing decimal point or multiple zeroes, strip the trailing values
    let processed =
      typeof val === 'string' && val.match(trailingCharMatcherWithPrefix)
        ? asNumber(val.replace(trailingCharMatcher, ''))
        : asNumber(val)

    props.onChange(processed)
  }

  return (
    <StringField
      {...rest}
      keyboardType="decimal-pad"
      formData={value}
      onChange={handleChange}
    />
  )
}

export default NumberField
