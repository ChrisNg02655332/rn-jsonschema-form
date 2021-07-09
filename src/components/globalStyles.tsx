import type { TextStyle } from 'react-native'

type GlobalStyles = {
  label: TextStyle
  required: TextStyle
}

const globalStyles: GlobalStyles = {
  label: {
    marginBottom: 5,
  },
  required: {
    color: 'red',
  },
}

export default globalStyles
