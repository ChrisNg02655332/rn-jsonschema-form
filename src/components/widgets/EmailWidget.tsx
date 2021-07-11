import React from 'react'

function EmailWidget(props: any) {
  const { BaseInput } = props.registry.widgets
  return <BaseInput keyboardType="email-address" {...props} />
}

export default EmailWidget
