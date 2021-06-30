import React, { ReactNode } from 'react'
import { View } from 'react-native'
import { FormikHelpers, useFormik } from 'formik'
import * as yup from 'yup'

import { Description, TextField, Title } from './fields'

import type { Schema } from './interfaces'
import { createYupSchema } from './utils'

type Props = {
  schema: Schema
  widgets?: { [key: string]: ReactNode }
  onSubmit: (values: any, formikHelpers: FormikHelpers<any>) => void
}

const FormDynamic = ({ schema, widgets, onSubmit }: Props) => {
  const yepSchema = createYupSchema(schema.properties)
  const initialValues: any = {}
  Object.keys(schema.properties).forEach((k) => {
    initialValues[k] = schema.properties[k].defaultValue
  })

  const validationSchema = yup.object().shape(yepSchema)

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  })

  const rendenView = () => {
    return Object.keys(schema.properties).map((key: string) => {
      let view = null
      const field = schema.properties[key]

      const fieldProps = {
        key,
        name: key,
        formik,
      }

      if (field.type === 'string') {
        view = (
          <TextField
            {...field}
            key={key}
            error={!!formik.errors[key]}
            caption={formik.errors[key] as string}
            onChangeText={formik.handleChange(key)}
            value={formik.values[key]}
          />
        )
      }

      if (field.widget && widgets && Object.keys(widgets).length) {
        const Comp = (widgets as any)[field.widget]
        if (Comp) view = <Comp {...fieldProps} />
        else console.warn(`The widget '${field.widget}' doesn't support.`)
      }

      return <View style={{ marginBottom: 15 }}>{view}</View>
    })
  }

  return (
    <View>
      <Title text={schema.title} />
      <Description text={schema.description} />

      {rendenView()}
    </View>
  )
}

export default FormDynamic
