export type Schema = {
  title?: string
  description?: string
  type: string
  properties: {
    [key: string]: {
      title?: string
      type: string
      defaultValue?: string
      validationType?: string
      widget?: string
      rules?: Array<{
        type: string
        params: any
      }>
    }
  }
}
