import { DeepPartial, FieldValues, UseFormReturn } from 'react-hook-form'

export type Platform = 'web' | 'mobile'

export type FormData = DeepPartial<FieldValues> | FieldValues

export type Methods = UseFormReturn<
  | FieldValues
  | {
      [x: string]: any
    },
  any
>

export type FormRef = {
  methods: Methods
}
