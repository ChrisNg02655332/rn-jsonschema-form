import { CommonProps } from 'jsonshema-form-core'

export { TextareaWidget }

function TextareaWidget({ name, required, methods, placeholder, disabled }: CommonProps) {
  const { register } = methods
  return (
    <textarea className="form-control" placeholder={placeholder} {...register(name, { required, disabled })}></textarea>
  )
}
