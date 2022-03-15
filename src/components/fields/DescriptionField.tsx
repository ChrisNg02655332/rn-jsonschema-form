import React, { ReactElement } from 'react'
import { Platform } from '../../types'

type Props = {
  id: string
  description?: string | ReactElement
  platform?: Platform
}

const DescriptionField = ({ id, description, platform = 'web' }: Props) => {
  if (description === undefined) {
    return null
  }

  if (typeof description === 'string') {
    return platform === 'web' ? <p key={id}>{description}</p> : null
  } else {
    return platform === 'web' ? <div key={id}>{description}</div> : null
  }
}

export default DescriptionField
