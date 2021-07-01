import * as React from 'react'
import {
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native'

import BasicForm from './BasicForm'
import CustomButtonSubmit from './CustomButtonSubmit'
import CustomStyles from './CustomStyles'
import CustomWidgets from './CustomWidgets'
import ValidateForm from './ValidateForm'

const data = [
  {
    title: 'Basic Form',
    key: 'basic_form',
    view: BasicForm,
  },
  {
    title: 'Custom Submit Form',
    key: 'custom_submit_form',
    view: CustomButtonSubmit,
  },
  {
    title: 'Custom Widgets',
    key: 'custom_widgets_form',
    view: CustomWidgets,
  },
  {
    title: 'Custom Styles',
    key: 'custom_styles_form',
    view: CustomStyles,
  },
  {
    title: 'Validate Form',
    key: 'validate_form',
    view: ValidateForm,
  },
]

export default function App() {
  const [currentView, setCurrentView] = React.useState(0)
  const Form = data[currentView].view

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        horizontal
        style={styles.list}
        data={data}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setCurrentView(index)}
          >
            <Text style={styles.text}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
        keyExtractor={(item) => item.key}
      />

      <Form />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  list: {
    maxHeight: 55,
    marginHorizontal: 10,
    marginVertical: 15,
    paddingBottom: 15,
  },
  btn: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  text: {
    fontWeight: '600',
  },
})
