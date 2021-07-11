import React from 'react'
import { Text, View } from 'react-native'

const ErrorList = ({ errors = [] }: any) => {
  return errors.length ? (
    <View>
      <View>
        <Text>Errors</Text>
      </View>
      <View>
        {errors.map((error: any, idx: number) => (
          <Text key={idx}>{error.stack}</Text>
        ))}
      </View>
    </View>
  ) : null
}

export default ErrorList
