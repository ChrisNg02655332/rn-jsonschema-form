const VECTOR_ICONS_FONTS_PATH = './node_modules/react-native-vector-icons/Fonts'
const VECTOR_FONTS = ['Feather.ttf', 'FontAwesome.ttf']

module.exports = {
  assets: [],
  dependencies: {
    // Disable auto linking for `react-native-vector-icons` and link
    // the required fonts manually to avoid duplicate resources issue in iOS.
    'react-native-vector-icons': {
      platforms: {
        ios: null,
        android: null,
      },
      assets: VECTOR_FONTS.map((font) => VECTOR_ICONS_FONTS_PATH + '/' + font),
    },
  },
}
