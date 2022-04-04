import React from 'react'

type Props = {
  id: string
  description?: string | React.ReactElement
}

const DescriptionField = ({ id, description }: Props) => {
  if (!description) return null
  if (typeof description === 'string') return <p>{description}</p>
  return <div>{description}</div>
}

export default DescriptionField
