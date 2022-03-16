import { useForm } from 'react-hook-form'
import { Form } from 'rn-form-schema'

// import schema from './json/basic.json'
import schema from './json/nested.json'

const App = () => {
  const methods = useForm()

  return (
    <div className="container mt-5">
      <Form platform="web" schema={schema as any} methods={methods} onSubmit={(data) => console.log(data)} />
    </div>
  )
}

export default App
