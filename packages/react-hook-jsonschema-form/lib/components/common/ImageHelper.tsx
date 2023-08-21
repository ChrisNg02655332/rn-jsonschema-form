type Props = {
  uiSchema: {
    title?: string
    sources: Array<string>
  }
}

const ImageHelper = ({ uiSchema }: Props) => {
  if (!uiSchema?.sources || !uiSchema?.sources.length) return null

  const { title, sources } = uiSchema

  return (
    <div>
      {title && <div className="help mt-1 d-block text-secondary">{title}</div>}
      <div className="d-flex align-items-center">
        {sources.map((url, index) => (
          <img key={index} src={url} style={{ width: 50, height: 50, borderRadius: 8 }} />
        ))}
      </div>
    </div>
  )
}

export default ImageHelper
