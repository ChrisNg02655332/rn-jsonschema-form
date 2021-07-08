/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import {
  View,
  ViewStyle,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native'

import { FormikHelpers, useFormik } from 'formik'
import * as yup from 'yup'

import { Checkbox, Description, Select, TextField, Title } from './fields'

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
  /**
   * @default ScrollView for web
   * @description should use react-native-keyboard-aware-scroll-view for mobile
   */
  wrapper?: ReactNode
  /** @description This prop supports handle builder form */
  editable?: ReactNode
}

const CircleIcon = ({ color }: { color: string }) => (
  <View style={[styles.circleIcon, { backgroundColor: color }]} />
)

const FormBuilder = forwardRef<any, Props>(
  (
    {
      schema,
      widgets,
      showErrors = false,
      containerStyle,
      submitText = 'Submit',
      hideSubmitButton = false,
      onSubmit,
      wrapper,
      editable,
    },
    ref
  ) => {
    const [initialValues, setInitialValues] = useState<any>({})

    useEffect(() => {
      const obj = bootstrap()
      setInitialValues(obj)
    }, [])

    const bootstrap = (args?: any, params: any = {}) => {
      const obj: any = params
      const properties = args || schema.properties
      Object.keys(properties).forEach((k) => {
        if (properties[k].type === 'array') {
          bootstrap(properties[k].properties, obj)
        }

        if (properties[k].type === 'string')
          obj[k] = properties[k].defaultValue || ''
        if (properties[k].type === 'number')
          obj[k] = properties[k].defaultValue || null
        if (properties[k].type === 'boolean')
          obj[k] = properties[k].defaultValue || false
      })

      return obj
    }

    const yepSchema = createYupSchema(schema.properties)
    const validationSchema = yup.object().shape(yepSchema)

    const formik = useFormik({
      initialValues,
      validationSchema,
      enableReinitialize: true,
      onSubmit,
    })

    useImperativeHandle(ref, () => ({
      ...formik,
    }))

    const renderView = (properties?: any) => {
      const root = properties || schema.properties
      return Object.keys(root).map((key: string, index: number) => {
        let view = null
        const field = root[key]

        const fieldProps = {
          key,
          name: key,
          formik,
          schema: field,
          rootSchema: schema,
        }

        if (field.uiSchema) {
          if (field.uiSchema === 'select') {
            view = (
              <Select
                {...field.props}
                title={field?.title || field.props?.title}
                options={field.options}
                error={formik.touched[key] && !!formik.errors[key]}
                caption={formik.touched[key] && (formik.errors[key] as string)}
                value={formik.values[key]}
                onChange={(value) => formik.setFieldValue(key, value)}
              />
            )
          }
          if (field.uiSchema === 'group' && field.properties) {
            view = (
              <View>
                <Title text={field?.title} />
                {renderView(field.properties)}
              </View>
            )
          }
        } else {
          if (['string', 'number'].includes(field.type)) {
            let keyboardType = field.props?.keyboardType || 'default'
            if (field.type === 'number') keyboardType = 'number-pad'

            view = (
              <TextField
                {...field.props}
                title={field?.title || field.props?.title}
                keyboardType={keyboardType}
                error={formik.touched[key] && !!formik.errors[key]}
                caption={formik.touched[key] && (formik.errors[key] as string)}
                onChangeText={(val) => {
                  let value: string | number = val
                  if (field.type === 'number') value = Number(value)
                  formik.setFieldValue(key, value)
                }}
                value={formik.values[key]}
                onBlur={() => formik.setFieldTouched(key)}
              />
            )
          }

          if (field.type === 'boolean') {
            view = (
              <Checkbox
                {...field.props}
                title={field?.title || field.props?.title}
                value={formik.values[key]}
                onPress={() => {
                  if (field.groupName) {
                    const groups = Object.keys(root).filter(
                      (k) => root[k]?.groupName === field.groupName
                    )
                    groups.forEach((k) => formik.setFieldValue(k, false))
                  }

                  formik.setFieldValue(key, !formik.values[key])
                }}
              />
            )
          }

          if (field.type === 'array') {
            return null
          }
        }

        if (field.widget && widgets && Object.keys(widgets).length) {
          const Comp = (widgets as any)[field.widget]
          if (Comp) view = <Comp {...fieldProps} />
          else console.warn(`The widget '${field.widget}' doesn't support.`)
        }

        return Platform.OS === 'web' && !!editable
          ? (editable as any)({
              ...fieldProps,
              children: (
                <View
                  key={key}
                  style={[
                    styles.field,
                    { zIndex: Object.keys(root).length - index },
                  ]}
                >
                  {view}
                </View>
              ),
            })
          : null
      })
    }

    const Container: any = wrapper || ScrollView

    return (
      <Container>
        <View ref={ref} style={containerStyle}>
          <Title text={schema.title} />
          <Description text={schema.description} />

          {showErrors && formik.dirty && (
            <View style={styles.errorContainer}>
              {Object.keys(formik.errors).map((k) => (
                <View key={k} style={styles.errorContent}>
                  <CircleIcon color={theme.danger} />
                  <Text style={styles.errorText}>{formik.errors[k]}</Text>
                </View>
              ))}
            </View>
          )}

          {renderView()}

          {!hideSubmitButton && (
            <TouchableOpacity style={styles.btn} onPress={formik.handleSubmit}>
              <Text style={styles.text}>{submitText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </Container>
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
    zIndex: 0,
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

export default FormBuilder
