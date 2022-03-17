import { CommonProps } from '../types'

const NumberField = (props: CommonProps) => {
  const { StringField } = props.registry.fields
  return <StringField {...props} />
}

export default NumberField
