export type Properties = {
  [key: string]: {
    title?: string
    /**
     * This prop supported
     * @enum "string" | "number" | "boolean"
     */
    type: string
    /**
     * @description This is props of the components
     * @link can use default and any props related to react native components
     *
     *  https://reactnative.dev/docs/components-and-apis
     */
    props?: any
    properties?: Properties
    defaultValue?: string
    widget?: string
    /** @description check yup method */
    validationType?: string
    rules?: Array<{
      type: string
      params: any
    }>
  }
}

export type Schema = {
  title?: string
  description?: string
  type: string
  properties: Properties
}
