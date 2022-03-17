import { FieldValues, UseFormReturn } from 'react-hook-form'

export type Platform = 'web' | 'mobile'

export type Methods = UseFormReturn<FieldValues, any>
