import { CommonProps } from '../types'

const SelectWidget = ({ platform }: CommonProps) => {
  if (platform === 'web') {
    return <div>SelectWidget</div>
  }

  console.warn('You probably not using web. Please override SelectWidget to display')
  return null
}

export default SelectWidget
