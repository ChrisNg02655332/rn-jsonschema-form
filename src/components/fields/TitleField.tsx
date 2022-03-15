import React from 'react'
import { Platform } from '../../types'

const REQUIRED_FIELD_SYMBOL = '*'

type Props = {
  id?: string
  title?: string
  required?: boolean
  platform?: Platform
}

const TitleField = ({ id, title, required = false, platform = 'web' }: Props) => {
  if (!title) return null

  return platform === 'web' ? (
    <div key={id}>
      <label>{title}</label>
      {required && <span>{REQUIRED_FIELD_SYMBOL}</span>}
    </div>
  ) : null
}

export default TitleField
