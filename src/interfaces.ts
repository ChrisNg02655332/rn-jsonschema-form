type Properties = {
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
