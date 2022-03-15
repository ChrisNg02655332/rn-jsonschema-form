import React from 'react'

import { Methods, Platform } from '../../types'

type Props = {
  label?: string
  name: string
  options: any
  platform: Platform
  required?: boolean
  schema: any
  uiSchema: any
  methods: Methods
}

const BaseInput = ({ name, required, methods, ...rest }: Props) => {
  const { register } = methods

  return <input {...register(name, { required })} />
}

export default BaseInput
