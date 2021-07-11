import React from 'react'

function URLWidget(props: any) {
  const { BaseInput } = props.registry.widgets
  return <BaseInput keyboardType="url" {...props} />
}

export default URLWidget
