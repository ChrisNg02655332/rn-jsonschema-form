import React from 'react'
import { TextInput } from 'react-native'

type Props = {
  id: string
  value?: string | number | boolean
}

function HiddenWidget({ id, value }: Props) {
  return (
    <TextInput
      key={id}
      value={typeof value === 'undefined' ? '' : value.toString()}
    />
  )
}

export default HiddenWidget
