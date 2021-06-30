import { requireNativeComponent, ViewStyle } from 'react-native'

type RnFormBuilderProps = {
  color: string
  style: ViewStyle
}

export const RnFormBuilderViewManager =
  requireNativeComponent<RnFormBuilderProps>('RnFormBuilderView')

export default RnFormBuilderViewManager
