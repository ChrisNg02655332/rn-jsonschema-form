import { CommonProps } from '../types'

const FileWidget = ({ platform }: CommonProps) => {
  if (platform === 'web') {
    return <div>FileWidget</div>
  }

  console.warn('You probably not using web. Please override FileWidget to display')
  return null
}

export default FileWidget
