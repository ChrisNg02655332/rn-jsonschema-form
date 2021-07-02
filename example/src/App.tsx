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
import ArrayFields from './ArrayFields'
import ValidateForm from './ValidateForm'
import SelectControlGroups from './SelectControlGroups'

const data = [
  {
    title: 'Basic Form',
    key: 'basic_form',
    view: BasicForm,
  },
  {
    title: 'Select Control Group',
    key: 'Group_form',
    view: SelectControlGroups,
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
    title: 'Array Fields',
    key: 'array_fields_form',
    view: ArrayFields,
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
      <Text style={styles.title}>React Native Form Builder</Text>
      <FlatList
        horizontal
        style={styles.list}
        data={data}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.btn, index === currentView && styles.activeBtn]}
            onPress={() => setCurrentView(index)}
          >
            <Text
              style={[styles.text, index === currentView && styles.activeText]}
            >
              {item.title}
            </Text>
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
  title: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#0284C7',
  },
  list: {
    maxHeight: 55,
    minHeight: 55,
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
  activeBtn: {
    backgroundColor: '#60A5FA',
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold',
  },
})
