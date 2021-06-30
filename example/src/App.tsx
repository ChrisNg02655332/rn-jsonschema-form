import * as React from 'react'

import { SafeAreaView, StyleSheet, View } from 'react-native'
// import RnFormBuilderViewManager from 'rn-form-builder'
import { FormDynamic, Schema } from 'rn-form-builder'

import jsonSchema from './shema.json'
import widgets from './Widgets'

const schema: Schema = jsonSchema

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FormDynamic schema={schema} widgets={widgets} onSubmit={() => {}} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 10,
  },
})
