export type Schema = {
  title?: string
  description?: string
  type: string
  properties: {
    [key: string]: {
      title?: string
      type: string
      /**
       * This is props of the components
       * Can use default and any props related to react native components
       */
      props?: any
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
