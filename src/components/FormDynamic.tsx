import React from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'
import _pick from 'lodash/pick'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'

import { useStateWithCallbackLazy } from '../libs/hooks'

import theme from '../components/theme'

import {
  getDefaultFormState,
  retrieveSchema,
  // shouldRender,
  toIdSchema,
  getDefaultRegistry,
  // deepEquals,
  // toPathSchema,
  isObject,
  mergeObjects,
  toPathSchema,
} from '../utils'

import validateFormData, { toErrorList } from '../validate'
import type { ViewStyle } from 'react-native'

type Props = {
  fields?: any
  widgets?: any
  ArrayFieldTemplate?: any
  ObjectFieldTemplate?: any
  FieldTemplate?: any
  schema: any
  formContext?: any
  formData?: any
  uiSchema?: any
  additionalMetaSchemas?: any
  customFormats?: any
  validate?: any
  transformErrors?: any
  extraErrors?: any
  idPrefix?: string
  disabled?: boolean
  omitExtraData?: boolean
  onSubmit: (values: any, event: any) => void
  /**
   * @default ScrollView for web
   * @description should use react-native-keyboard-aware-scroll-view for mobile
   */
  wrapper?: React.ReactNode
  containerStyle?: ViewStyle
}

const FormDynamic: React.FC<Props> = ({ children, ...props }) => {
  const [state, setState] = useStateWithCallbackLazy({})

  React.useEffect(() => {
    const _state = getStateFromProps(props, props.formData)
    setState(_state)
  }, [])

  const getRegistry = () => {
    // For BC, accept passed SchemaField and TitleField props and pass them to
    // the "fields" registry one.
    const { fields, widgets } = getDefaultRegistry()
    return {
      fields: { ...fields, ...props.fields },
      widgets: { ...widgets, ...props.widgets },
      ArrayFieldTemplate: props.ArrayFieldTemplate,
      ObjectFieldTemplate: props.ObjectFieldTemplate,
      FieldTemplate: props.FieldTemplate,
      definitions: props.schema.definitions || {},
      rootSchema: props.schema,
      formContext: props.formContext || {},
    }
  }

  const validate = (
    formData: any,
    schema = props.schema,
    additionalMetaSchemas = props.additionalMetaSchemas,
    customFormats = props.customFormats
  ): any => {
    const { rootSchema } = getRegistry()
    const resolvedSchema = retrieveSchema(schema, rootSchema, formData)
    return validateFormData(
      formData,
      resolvedSchema,
      props.validate,
      props.transformErrors,
      additionalMetaSchemas,
      customFormats
    )
  }

  const getStateFromProps = (_props: Props, inputFormData: any) => {
    const schema = 'schema' in _props ? _props.schema : props.schema
    const uiSchema =
      'uiSchema' in _props ? _props.uiSchema || {} : props.uiSchema || {}
    const edit = typeof inputFormData !== 'undefined'
    // const liveValidate =
    //   "liveValidate" in props ? props.liveValidate : this.props.liveValidate;
    // const mustValidate = edit && !props.noValidate && liveValidate;
    const mustValidate = false
    const rootSchema = schema
    const formData = getDefaultFormState(schema, inputFormData, rootSchema)
    const retrievedSchema = retrieveSchema(schema, rootSchema, formData)
    const customFormats = _props.customFormats
    const additionalMetaSchemas = _props.additionalMetaSchemas

    let errors, errorSchema, schemaValidationErrors, schemaValidationErrorSchema
    if (mustValidate) {
      const schemaValidation = validate(
        formData,
        schema,
        additionalMetaSchemas,
        customFormats
      )
      errors = schemaValidation.errors
      errorSchema = schemaValidation.errorSchema
      schemaValidationErrors = errors
      schemaValidationErrorSchema = errorSchema
    } else {
      const currentErrors = {
        errors: state.errors || [],
        errorSchema: state.errorSchema || {},
      }
      errors = currentErrors.errors
      errorSchema = currentErrors.errorSchema
      schemaValidationErrors = state.schemaValidationErrors
      schemaValidationErrorSchema = state.schemaValidationErrorSchema
    }
    if (props.extraErrors) {
      errorSchema = mergeObjects(
        errorSchema,
        props.extraErrors,
        !!'concat arrays'
      )
      errors = toErrorList(errorSchema)
    }

    const idSchema = toIdSchema(
      retrievedSchema,
      uiSchema['ui:rootFieldId'],
      rootSchema,
      formData,
      props.idPrefix
    )
    const nextState: any = {
      schema,
      uiSchema,
      idSchema,
      formData,
      edit,
      errors,
      errorSchema,
      additionalMetaSchemas,
    }
    if (schemaValidationErrors) {
      nextState.schemaValidationErrors = schemaValidationErrors
      nextState.schemaValidationErrorSchema = schemaValidationErrorSchema
    }

    return nextState
  }

  const getUsedFormData = (formData: any, fields: any) => {
    //for the case of a single input form
    if (fields.length === 0 && typeof formData !== 'object') {
      return formData
    }

    let data = _pick(formData, fields)
    if (Array.isArray(formData)) {
      return Object.keys(data).map((key) => data[key])
    }

    return data
  }

  const getFieldNames = (pathSchema: any, formData: any) => {
    const getAllPaths = (_obj: any, acc: any = [], paths = ['']) => {
      Object.keys(_obj).forEach((key) => {
        if (typeof _obj[key] === 'object') {
          let newPaths = paths.map((path) => `${path}.${key}`)
          // If an object is marked with additionalProperties, all its keys are valid
          if (
            _obj[key].__rnjsf_additionalProperties &&
            _obj[key].$name !== ''
          ) {
            acc.push(_obj[key].$name)
          } else {
            getAllPaths(_obj[key], acc, newPaths)
          }
        } else if (key === '$name' && _obj[key] !== '') {
          paths.forEach((path) => {
            path = path.replace(/^\./, '')
            const formValue = _get(formData, path)
            // adds path to fieldNames if it points to a value
            // or an empty object/array
            if (typeof formValue !== 'object' || _isEmpty(formValue)) {
              acc.push(path)
            }
          })
        }
      })
      return acc
    }

    return getAllPaths(pathSchema)
  }

  const onChange = (formData: any, _newErrorSchema: any) => {
    if (isObject(formData) || Array.isArray(formData)) {
      const newState = getStateFromProps(props, formData)
      formData = { ...state.formData, ...newState.formData }
    }

    // TODO: check validate here
    // const mustValidate = !this.props.noValidate && this.props.liveValidate
    const mustValidate = false
    let _state: any = { formData }
    let newFormData = formData

    if (mustValidate) {
      let schemaValidation = validate(newFormData)
      let errors = schemaValidation.errors
      let errorSchema = schemaValidation.errorSchema
      const schemaValidationErrors = errors
      const schemaValidationErrorSchema = errorSchema
      if (props.extraErrors) {
        errorSchema = mergeObjects(
          errorSchema,
          props.extraErrors,
          !!'concat arrays'
        )
        errors = toErrorList(errorSchema)
      }
      _state = {
        formData: newFormData,
        errors,
        errorSchema,
        schemaValidationErrors,
        schemaValidationErrorSchema,
      }
    }

    console.log(_state)

    setState({ ...state, ..._state })
  }

  const onSubmit = (event: any) => {
    event.preventDefault()

    // TODO: Need to double check here
    // if (event.target !== event.currentTarget) {
    //   return
    // }

    /**
     * @description:
     * event.persist() should be called when using React synthetic events inside an asynchronous callback function
     */
    event.persist()
    let newFormData = state.formData

    if (props.omitExtraData === true) {
      const retrievedSchema = retrieveSchema(
        state.schema,
        state.schema,
        newFormData
      )
      const pathSchema = toPathSchema(
        retrievedSchema,
        '',
        state.schema,
        newFormData
      )

      const fieldNames = getFieldNames(pathSchema, newFormData)

      newFormData = getUsedFormData(newFormData, fieldNames)
    }

    // if (!this.props.noValidate) {
    //   let schemaValidation = this.validate(newFormData)
    //   let errors = schemaValidation.errors
    //   let errorSchema = schemaValidation.errorSchema
    //   const schemaValidationErrors = errors
    //   const schemaValidationErrorSchema = errorSchema
    //   if (Object.keys(errors).length > 0) {
    //     if (this.props.extraErrors) {
    //       errorSchema = mergeObjects(
    //         errorSchema,
    //         this.props.extraErrors,
    //         !!'concat arrays'
    //       )
    //       errors = toErrorList(errorSchema)
    //     }
    //     this.setState(
    //       {
    //         errors,
    //         errorSchema,
    //         schemaValidationErrors,
    //         schemaValidationErrorSchema,
    //       },
    //       () => {
    //         if (this.props.onError) {
    //           this.props.onError(errors)
    //         } else {
    //           console.error('Form validation failed', errors)
    //         }
    //       }
    //     )
    //     return
    //   }
    // }

    let errorSchema
    let errors
    if (props.extraErrors) {
      errorSchema = props.extraErrors
      errors = toErrorList(errorSchema)
    } else {
      errorSchema = {}
      errors = []
    }

    setState(
      {
        ...state,
        formData: newFormData,
        errors: errors,
        errorSchema: errorSchema,
      },
      () => {
        props.onSubmit({ formData: newFormData, status: 'submitted' }, event)
      }
    )
  }

  const registry = getRegistry()
  const _SchemaField = registry.fields.SchemaField

  const Container: any = props.wrapper || ScrollView

  return (
    <Container>
      <View style={props.containerStyle}>
        <_SchemaField
          schema={state.schema}
          uiSchema={state.uiSchema}
          errorSchema={state.errorSchema}
          idSchema={state.idSchema}
          idPrefix={props.idPrefix}
          formContext={props.formContext}
          formData={state.formData}
          onChange={onChange}
          registry={registry}
          disabled={props.disabled}
        />
        {children ? (
          children
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  submitButton: {
    paddingHorizontal: 8,
    paddingVertical: 14,
    backgroundColor: theme.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  submitText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
})

export default FormDynamic
