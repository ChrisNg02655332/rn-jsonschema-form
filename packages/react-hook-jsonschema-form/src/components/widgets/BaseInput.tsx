import { CommonProps } from 'jsonshema-form-core/src/types'

const BaseInput = ({
  name,
  required,
  methods,
  placeholder,
  disabled,
  type,
}: CommonProps & { type: 'text' | 'number' }) => {
  const { register } = methods
  return (
    <input className="form-control" placeholder={placeholder} type={type} {...register(name, { required, disabled })} />
  )
}

export default BaseInput
