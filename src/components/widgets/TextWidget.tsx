import React from 'react'

function TextWidget(props: any) {
  const { BaseInput } = props.registry.widgets
  return <BaseInput {...props} />
}

export default TextWidget
