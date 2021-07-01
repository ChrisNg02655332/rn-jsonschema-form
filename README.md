# rn-form-builder

This library support generate form by json schema

## Installation

```sh
npm install rn-form-builder
```

## Usage

```js
import * as React from 'react'
import { FormDynamic, Schema } from 'rn-form-builder'

import jsonSchema from './shema.json'
import widgets from './Widgets'

const schema: Schema = jsonSchema

export default function App() {
  const onSubmit = (values, formHelper) => {
    // **** Handle submit form ****
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FormDynamic schema={schema} widgets={widgets} onSubmit={onSubmit} />
      </View>
    </SafeAreaView>
  )
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
