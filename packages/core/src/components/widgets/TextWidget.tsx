import React from 'react'

const TextWidget = (props: any) => {
  const { BaseInput } = props.registry.widgets
  return <BaseInput {...props} />
}

export default TextWidget
