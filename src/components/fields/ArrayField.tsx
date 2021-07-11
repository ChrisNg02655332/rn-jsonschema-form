import React from 'react'
import { View } from 'react-native'
import includes from 'core-js-pure/es/array/includes'

import {
  getDefaultRegistry,
  getUiOptions,
  getWidget,
  isMultiSelect,
  optionsList,
  retrieveSchema,
  toIdSchema,
} from '../../utils'

type ArrayFieldTitleProps = {
  TitleField: React.FC<{ title?: string; required?: boolean }>
  idSchema: any
  title?: string
  required?: boolean
}

const ArrayFieldTitle = ({
  TitleField,
  idSchema,
  title,
  required,
}: ArrayFieldTitleProps) => {
  if (!title) {
    return null
  }
  const key = `${idSchema.$id}__title`
  return <TitleField key={key} title={title} required={required} />
}

type ArrayFieldDescriptionProps = {
  DescriptionField: React.FC<{ description?: string; required?: boolean }>
  idSchema: any
  description?: string
}

const ArrayFieldDescription = ({
  DescriptionField,
  idSchema,
  description,
}: ArrayFieldDescriptionProps) => {
  if (!description) {
    return null
  }
  const id = `${idSchema.$id}__description`
  return <DescriptionField key={id} description={description} />
}

// Used in the two templates
const DefaultArrayItem = (props: any) => (
  <View key={props.key} style={props.style}>
    <View>{props.children}</View>

    {/* {props.hasToolbar && (
        <div className="col-xs-3 array-item-toolbox">
          <div
            className="btn-group"
            style={{
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            {(props.hasMoveUp || props.hasMoveDown) && (
              <IconButton
                icon="arrow-up"
                aria-label="Move up"
                className="array-item-move-up"
                tabIndex="-1"
                style={btnStyle}
                disabled={props.disabled || props.readonly || !props.hasMoveUp}
                onClick={props.onReorderClick(props.index, props.index - 1)}
              />
            )}

            {(props.hasMoveUp || props.hasMoveDown) && (
              <IconButton
                icon="arrow-down"
                className="array-item-move-down"
                aria-label="Move down"
                tabIndex="-1"
                style={btnStyle}
                disabled={
                  props.disabled || props.readonly || !props.hasMoveDown
                }
                onClick={props.onReorderClick(props.index, props.index + 1)}
              />
            )}

            {props.hasRemove && (
              <IconButton
                type="danger"
                icon="remove"
                aria-label="Remove"
                className="array-item-remove"
                tabIndex="-1"
                style={btnStyle}
                disabled={props.disabled || props.readonly}
                onClick={props.onDropIndexClick(props.index)}
              />
            )}
          </div>
        </div>
      )} */}
  </View>
)

const DefaultNormalArrayFieldTemplate = (props: any) => {
  return (
    <View style={props.style} key={props.idSchema.$id}>
      <ArrayFieldTitle
        key={`array-field-title-${props.idSchema.$id}`}
        TitleField={props.TitleField}
        idSchema={props.idSchema}
        title={props.uiSchema['ui:title'] || props.title}
        required={props.required}
      />
      {(props.uiSchema['ui:description'] || props.schema.description) && (
        <ArrayFieldDescription
          key={`array-field-description-${props.idSchema.$id}`}
          DescriptionField={props.DescriptionField}
          idSchema={props.idSchema}
          description={
            props.uiSchema['ui:description'] || props.schema.description
          }
        />
      )}

      <View key={`array-item-list-${props.idSchema.$id}`}>
        {props.items && props.items.map((p: any) => DefaultArrayItem(p))}
      </View>
      {/* {props.canAdd && (
        <AddButton
          className="array-item-add"
          onClick={props.onAddClick}
          disabled={props.disabled || props.readonly}
        />
      )} */}
    </View>
  )
}

const keyedToPlainFormData = (keyedFormData: any) => {
  return keyedFormData.map((keyedItem: any) => keyedItem.item)
}

const isItemRequired = (itemSchema: any) => {
  if (Array.isArray(itemSchema.type)) {
    // While we don't yet support composite/nullable jsonschema types, it's
    // future-proof to check for requirement against these.
    return !includes(itemSchema.type, 'null')
  }
  // All non-null array item types are inherently required by design
  return itemSchema.type !== 'null'
}

const ArrayField = (props: any) => {
  const {
    schema,
    formData,
    uiSchema,

    idSchema,
    name,
    required,
    disabled,
    readonly,
    autofocus,
    registry = getDefaultRegistry(),
    onBlur,
    onFocus,
    idPrefix,
    rawErrors,
    label,
    placeholder,
    onChange,
  } = props
  const { ArrayFieldTemplate, fields, formContext, rootSchema, widgets } =
    registry

  const [state] = React.useState({
    keyedFormData: [],
  })

  const canAddItem = (formItems: any) => {
    let { addable } = getUiOptions(uiSchema) as any
    if (addable !== false) {
      // if ui:options.addable was not explicitly set to false, we can add
      // another item if we have not exceeded maxItems yet
      if (schema.maxItems !== undefined) {
        addable = formItems.length < schema.maxItems
      } else {
        addable = true
      }
    }
    return addable
  }

  const onChangeForIndex = (index: number) => {
    return (value: any, errorSchema: any) => {
      const newFormData = formData.map((item: any, i: number) => {
        // We need to treat undefined items as nulls to have validation.
        // See https://github.com/tdegrunt/jsonschema/issues/206
        const jsonValue = typeof value === 'undefined' ? null : value
        return index === i ? jsonValue : item
      })
      onChange(
        newFormData,
        errorSchema &&
          props.errorSchema && {
            ...props.errorSchema,
            [index]: errorSchema,
          }
      )
    }
  }

  const onSelectChange = (value: any) => {
    props.onChange(value)
  }

  const renderArrayFieldItem = (_props: any) => {
    const {
      key,
      index,
      canRemove = true,
      canMoveUp = true,
      canMoveDown = true,
      itemSchema,
      itemData,
      itemUiSchema,
      itemIdSchema,
      itemErrorSchema,
    } = _props
    const {
      fields: { SchemaField },
    } = registry
    const { orderable, removable } = {
      orderable: true,
      removable: true,
      ...uiSchema['ui:options'],
    } as any
    const has = {
      moveUp: orderable && canMoveUp,
      moveDown: orderable && canMoveDown,
      remove: removable && canRemove,
    }
    // has.toolbar = Object.keys(has).some((key) => has[key])

    return {
      children: (
        <SchemaField
          index={index}
          schema={itemSchema}
          uiSchema={itemUiSchema}
          formData={itemData}
          errorSchema={itemErrorSchema}
          idSchema={itemIdSchema}
          required={isItemRequired(itemSchema)}
          onChange={onChangeForIndex(index)}
          onBlur={onBlur}
          onFocus={onFocus}
          registry={props.registry}
          disabled={props.disabled}
          readonly={props.readonly}
          //   autofocus={autofocus}
          rawErrors={rawErrors}
        />
      ),
      className: 'array-item',
      disabled,
      //   hasToolbar: has.toolbar,
      hasMoveUp: has.moveUp,
      hasMoveDown: has.moveDown,
      hasRemove: has.remove,
      index,
      key,
      //   onAddIndexClick
      //   onDropIndexClick
      //   onReorderClick,
      readonly,
    }
  }

  const renderMultiSelect = () => {
    const items = props.formData
    const itemsSchema = retrieveSchema(schema.items, rootSchema, formData)
    const enumOptions = optionsList(itemsSchema)
    const { widget = 'select', ...options } = {
      ...getUiOptions(uiSchema),
      enumOptions,
    }
    const Widget = getWidget(schema, widget, widgets)
    return (
      <Widget
        id={idSchema && idSchema.$id}
        multiple
        onChange={onSelectChange}
        onBlur={onBlur}
        onFocus={onFocus}
        options={options}
        schema={schema}
        registry={registry}
        value={items}
        disabled={disabled}
        readonly={readonly}
        required={required}
        label={label}
        placeholder={placeholder}
        formContext={formContext}
        autofocus={autofocus}
        rawErrors={rawErrors}
      />
    )
  }

  const renderNormalArray = () => {
    const title = schema.title === undefined ? name : schema.title
    const { TitleField, DescriptionField } = fields
    const _formData = keyedToPlainFormData(state.keyedFormData)
    const arrayProps = {
      canAdd: canAddItem(_formData),
      items: state.keyedFormData.map((keyedItem, index) => {
        const { key, item } = keyedItem
        const itemSchema = retrieveSchema(schema.items, rootSchema, item)
        const itemErrorSchema = props.errorSchema
          ? props.errorSchema[index]
          : undefined
        const itemIdPrefix = idSchema.$id + '_' + index
        const itemIdSchema = toIdSchema(
          itemSchema,
          itemIdPrefix,
          rootSchema,
          item,
          idPrefix
        )
        return renderArrayFieldItem({
          key,
          index,
          canMoveUp: index > 0,
          canMoveDown: index < _formData.length - 1,
          itemSchema: itemSchema,
          itemIdSchema,
          itemErrorSchema,
          itemData: item,
          itemUiSchema: uiSchema.items,
          autofocus: autofocus && index === 0,
          onBlur,
          onFocus,
        })
      }),
      DescriptionField,
      disabled,
      idSchema,
      uiSchema,
      //   onAddClick,
      readonly,
      required,
      schema,
      title,
      TitleField,
      formContext,
      formData: _formData,
      rawErrors,
      registry,
    }

    // Check if a custom render function was passed in
    const Component =
      uiSchema['ui:ArrayFieldTemplate'] ||
      ArrayFieldTemplate ||
      DefaultNormalArrayFieldTemplate
    return <Component {...arrayProps} />
  }

  if (!schema.hasOwnProperty('items')) {
    const { UnsupportedField } = fields

    return (
      <UnsupportedField
        schema={schema}
        idSchema={idSchema}
        reason="Missing items definition"
      />
    )
  }

  if (isMultiSelect(schema, rootSchema)) {
    return renderMultiSelect()
  }

  return renderNormalArray()
}

export default ArrayField
