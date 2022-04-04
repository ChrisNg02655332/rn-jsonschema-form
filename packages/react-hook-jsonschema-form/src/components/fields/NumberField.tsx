import { CommonProps } from 'jsonshema-form-core/src/types'

const NumberField = (props: CommonProps) => {
  const { StringField } = props.registry.fields
  return <StringField type="number" {...props} />
}

export default NumberField
