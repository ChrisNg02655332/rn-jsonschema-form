import { CommonProps } from '../types'

const BaseInput = ({ name, required, methods, platform, placeholder, disabled }: CommonProps) => {
  const { register } = methods

  if (platform === 'web') {
    return <input className="form-control" placeholder={placeholder} {...register(name, { required, disabled })} />
  }

  console.warn('You probably not using web. Please override Widget to display')
  return null
}

export default BaseInput
