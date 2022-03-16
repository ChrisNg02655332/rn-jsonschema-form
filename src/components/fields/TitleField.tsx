import { Platform } from '../../types'

const REQUIRED_FIELD_SYMBOL = '*'

type Props = {
  id?: string
  title?: string
  required?: boolean
  platform?: Platform
}

const TitleField = ({ id, title, required = false, platform }: Props) => {
  if (!title) return null

  if (platform === 'web') {
    return (
      <div key={id}>
        <p>{title}</p>
        {required && <span>{REQUIRED_FIELD_SYMBOL}</span>}
      </div>
    )
  }

  console.warn('You probably not using web. Please override TitleField to display')
  return null
}

export default TitleField
