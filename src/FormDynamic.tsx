import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
} from 'react'
import {
  View,
  ViewStyle,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FormikHelpers, useFormik } from 'formik'
import * as yup from 'yup'

import { Description, TextField, Title } from './fields'

import type { Schema } from './interfaces'
import { createYupSchema } from './utils'
import theme from './theme'

type Props = {
  schema: Schema
  widgets?: { [key: string]: ReactNode }
  showErrors?: boolean
  containerStyle?: ViewStyle
  submitText?: string
  hideSubmitButton?: boolean
  onSubmit: (values: any, formikHelpers: FormikHelpers<any>) => void
}

const CircleIcon = ({ color }: { color: string }) => (
  <View style={[styles.circleIcon, { backgroundColor: color }]} />
)

const FormDynamic = forwardRef<FormikHelpers<any>, Props>(
  (
    {
      schema,
      widgets,
      showErrors = false,
      containerStyle,
      submitText = 'Submit',
      hideSubmitButton = false,
      onSubmit,
    },
    ref
  ) => {
    const scrollRef = useRef<FormikHelpers<any>>(null)
    const yepSchema = createYupSchema(schema.properties)
    const initialValues: any = {}
    Object.keys(schema.properties).forEach((k) => {
      initialValues[k] = schema.properties[k].defaultValue || ''
    })

    const validationSchema = yup.object().shape(yepSchema)

    const formik = useFormik({
      initialValues,
      validationSchema,
      onSubmit,
    })

    useImperativeHandle(ref, () => ({
      ...formik,
    }))

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

        return (
          <View key={key} style={styles.field}>
            {view}
          </View>
        )
      })
    }

    return (
      <KeyboardAwareScrollView ref={scrollRef as any}>
        <View style={containerStyle}>
          <Title text={schema.title} />
          <Description text={schema.description} />

          {showErrors && (
            <View style={styles.errorContainer}>
              {Object.keys(formik.errors).map((k) => (
                <View style={styles.errorContent}>
                  <CircleIcon color={theme.danger} />
                  <Text style={styles.errorText}>{formik.errors[k]}</Text>
                </View>
              ))}
            </View>
          )}

          {rendenView()}

          {!hideSubmitButton && (
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                formik.handleSubmit()
                // scrollRef.current?.scrollToPosition(0, 0)
              }}
            >
              <Text style={styles.text}>{submitText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
    )
  }
)

const styles = StyleSheet.create({
  field: {
    marginBottom: 15,
  },
  btn: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: theme.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  errorContainer: { marginVertical: 15 },
  errorContent: { flexDirection: 'row', alignItems: 'center' },
  errorText: { color: theme.danger, fontWeight: '500', marginLeft: 7 },
  circleIcon: {
    width: 7,
    height: 7,
    borderRadius: 9999,
  },
})

export default FormDynamic
