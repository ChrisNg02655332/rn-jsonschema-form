import React from 'react'
import { View, Text } from 'react-native'

type Props = {
  idSchema?: any
  reason?: string
  schema?: any
}

const UnsupportedField = ({ schema, idSchema, reason }: Props) => {
  return (
    <View>
      <Text>
        Unsupported field schema
        {idSchema && idSchema.$id && ` for field ${idSchema.$id}`}
        {reason && <Text>: {reason}</Text>}.
      </Text>
      {schema && <Text>{JSON.stringify(schema, null, 2)}</Text>}
    </View>
  )
}

export default UnsupportedField
