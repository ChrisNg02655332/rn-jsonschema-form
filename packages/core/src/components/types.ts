import React from 'react'
import { Methods, Platform } from '../types'

export type CommonProps = {
  label?: string
  name: string
  methods: Methods
  registry?: any
  schema: any
  uiSchema: any
  platform: Platform
  required?: boolean
  fields?: any
  description?: React.ReactElement
  rawDescription?: any
  help?: React.ReactElement
  hidden?: boolean
  disabled?: boolean
  readonly?: boolean
  displayLabel?: boolean
  placeholder?: string
}
