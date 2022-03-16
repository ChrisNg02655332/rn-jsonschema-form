import { Controller } from 'react-hook-form'
import { CommonProps } from '../types'

const BaseInput = ({ name, label, required, methods, platform, placeholder }: CommonProps) => {
  const { control } = methods
  if (platform !== 'web') console.warn('You probably not using web. Please override Widget to display')

  return platform === 'web' ? (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field }) => <input className="form-control" placeholder={placeholder} {...field} />}
    />
  ) : null
}

export default BaseInput
