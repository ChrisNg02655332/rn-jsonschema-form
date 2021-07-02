export type Schema = {
  title?: string
  description?: string
  type: string
  properties: {
    [key: string]: {
      title?: string
      /**
       * This prop supported
       * @enum "string" | "number" | "boolean"
       */
      type: string
      /**
       * This is props of the components
       * Can use default and any props related to react native components
       */
      props?: any
      defaultValue?: string
      widget?: string
      /**
       * This prop supported oneof
       * @enum "checkbox"
       */
      uiSchema?: string
      validationType?: string
      rules?: Array<{
        type: string
        params: any
      }>
    }
  }
}
