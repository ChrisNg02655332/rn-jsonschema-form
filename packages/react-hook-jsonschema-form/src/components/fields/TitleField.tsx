const REQUIRED_FIELD_SYMBOL = '*'

type Props = {
  id?: string
  title?: string
  required?: boolean
}

const TitleField = ({ id, title, required = false }: Props) => {
  if (!title) return null

  return (
    <div key={id}>
      <p>{title}</p>
      {required && <span>{REQUIRED_FIELD_SYMBOL}</span>}
    </div>
  )
}

export default TitleField
