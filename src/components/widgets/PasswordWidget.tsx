import React from 'react'

function PasswordWidget(props: any) {
  const { BaseInput } = props.registry.widgets
  return <BaseInput secureTextEntry {...props} />
}

export default PasswordWidget
