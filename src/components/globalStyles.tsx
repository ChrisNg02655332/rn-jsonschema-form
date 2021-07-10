import type { TextStyle } from 'react-native'

type GlobalStyles = {
  label: TextStyle
  text: TextStyle
  required: TextStyle
}

const globalStyles: GlobalStyles = {
  label: {
    marginBottom: 5,
    fontSize: 15,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
  },
  required: {
    color: 'red',
  },
}

export default globalStyles
