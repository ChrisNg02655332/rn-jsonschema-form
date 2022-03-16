import React from 'react'
import { Platform } from '../../types'

type Props = {
  id: string
  description?: string | React.ReactElement
  platform?: Platform
}

const DescriptionField = ({ id, description, platform }: Props) => {
  if (description === undefined) {
    return null
  }

  if (platform === 'web') {
    if (typeof description === 'string') {
      return <p>{description}</p>
    } else {
      return <div>{description}</div>
    }
  }

  console.warn('You probably not using web. Please override DescriptionField to display')
  return null
}

export default DescriptionField
