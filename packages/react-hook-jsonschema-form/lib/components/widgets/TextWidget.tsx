export { TextWidget }

function TextWidget(props: any) {
  const { BaseInput } = props.registry.widgets
  return <BaseInput {...props} />
}
