import React from 'react'
import { getDefaultRegistry, retrieveSchema, toIdSchema } from '../../utils'
// import { nanoid } from 'nanoid'
// import { getDefaultRegistry, retrieveSchema, toIdSchema } from '../../utils'

const ArrayFieldTitle = ({ TitleField, idSchema, title, required }: any) => {
  if (!title) {
    return null
  }
  const id = `${idSchema.$id}__title`
  return <TitleField id={id} title={title} required={required} />
}

const ArrayFieldDescription = ({ DescriptionField, idSchema, description }: any) => {
  if (!description) {
    return null
  }
  const id = `${idSchema.$id}__description`
  return <DescriptionField id={id} description={description} />
}

const DefaultArrayItem = ({ key, hasToolbar, className, platform, children }: any) => {
  // const btnStyle = {
  //   flex: 1,
  //   paddingLeft: 6,
  //   paddingRight: 6,
  //   fontWeight: 'bold',
  // }

  if (platform === 'web') {
    return (
      <div key={key} className={className}>
        <div className={hasToolbar ? 'col-xs-9' : 'col-xs-12'}>{children}</div>

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
                disabled={props.disabled || props.readonly || !props.hasMoveDown}
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
      </div>
    )
  }

  return <>{children}</>
}

// const DefaultFixedArrayFieldTemplate = (props) => {
//   if (props.platform === 'web') {
//     return (
//       <fieldset className={props.className} id={props.idSchema.$id}>
//         <ArrayFieldTitle
//           key={`array-field-title-${props.idSchema.$id}`}
//           TitleField={props.TitleField}
//           idSchema={props.idSchema}
//           title={props.uiSchema['ui:title'] || props.title}
//           required={props.required}
//         />

//         {(props.uiSchema['ui:description'] || props.schema.description) && (
//           <div className="field-description" key={`field-description-${props.idSchema.$id}`}>
//             {props.uiSchema['ui:description'] || props.schema.description}
//           </div>
//         )}

//         <div className="row array-item-list" key={`array-item-list-${props.idSchema.$id}`}>
//           {props.items && props.items.map(DefaultArrayItem)}
//         </div>

//         {/* {props.canAdd && (
//           <AddButton className="array-item-add" onClick={props.onAddClick} disabled={props.disabled || props.readonly} />
//         )} */}
//       </fieldset>
//     )
//   }

//   return props.items && props.items.map(DefaultArrayItem)
// }

const DefaultNormalArrayFieldTemplate = (props: any) => {
  if (props.platform === 'web') {
    return (
      <fieldset className={props.className} id={props.idSchema.$id}>
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
            description={props.uiSchema['ui:description'] || props.schema.description}
          />
        )}

        <div className="row array-item-list" key={`array-item-list-${props.idSchema.$id}`}>
          {props.items && props.items.map((p: any) => DefaultArrayItem(p))}
        </div>

        {/* {props.canAdd && (
          <AddButton
            className="array-item-add"
            onClick={props.onAddClick}
            disabled={props.disabled || props.readonly}
          />
        )} */}
      </fieldset>
    )
  }

  return props.items && props.items.map((p: any) => DefaultArrayItem(p))
}

// const generateRowId = () => {
//   return nanoid()
// }

// const generateKeyedFormData = (formData) => {
//   return !Array.isArray(formData)
//     ? []
//     : formData.map((item) => {
//         return {
//           key: generateRowId(),
//           item,
//         }
//       })
// }

// const keyedToPlainFormData = (keyedFormData) => {
//   return keyedFormData.map((keyedItem) => keyedItem.item)
// }

const ArrayField = (props: any) => {
  const {
    uiSchema,
    idSchema,
    required,
    disabled,
    readonly,
    schema,
    name,
    hideError,
    registry = getDefaultRegistry(),
    idPrefix,
    idSeparator,
    methods,
  } = props

  const title = schema.title === undefined ? name : schema.title
  const { ArrayFieldTemplate, rootSchema, fields, formContext } = registry
  const { TitleField, DescriptionField } = fields

  const renderArrayFieldItem = ({
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
    autofocus,
    rawErrors,
  }: any) => {
    const {
      fields: { SchemaField },
    } = registry
    const { orderable, removable } = {
      orderable: true,
      removable: true,
      ...uiSchema['ui:options'],
    } as any
    const has: any = {
      moveUp: orderable && canMoveUp,
      moveDown: orderable && canMoveDown,
      remove: removable && canRemove,
    }
    has.toolbar = Object.keys(has).some((key) => has[key])

    return {
      children: (
        <SchemaField
          index={index}
          schema={itemSchema}
          uiSchema={itemUiSchema}
          formData={itemData}
          errorSchema={itemErrorSchema}
          idPrefix={props.idPrefix}
          idSeparator={props.idSeparator}
          idSchema={itemIdSchema}
          // required={isItemRequired(itemSchema)}

          registry={props.registry}
          disabled={props.disabled}
          readonly={props.readonly}
          hideError={props.hideError}
          autofocus={autofocus}
          rawErrors={rawErrors}
        />
      ),
      className: 'array-item',
      disabled,
      hasToolbar: has.toolbar,
      hasMoveUp: has.moveUp,
      hasMoveDown: has.moveDown,
      hasRemove: has.remove,
      index,
      key,
      // onAddIndexClick: this.onAddIndexClick,
      // onDropIndexClick: this.onDropIndexClick,
      // onReorderClick: this.onReorderClick,
      readonly,
    }
  }

  const [state] = React.useState({
    keyedFormData: [],
  })

  // const renderNormalArray = () => {
  //   const title = schema.title === undefined ? name : schema.title
  //   const { ArrayFieldTemplate, rootSchema, fields, formContext } = registry
  //   const { TitleField, DescriptionField } = fields
  //   const itemsSchema = retrieveSchema(schema.items, rootSchema)
  //   const formData = keyedToPlainFormData(state.keyedFormData)
  //   const arrayProps = {
  //     // canAdd: this.canAddItem(formData),
  //     items: state.keyedFormData.map((keyedItem, index) => {
  //       const { key, item } = keyedItem
  //       const itemSchema = retrieveSchema(schema.items, rootSchema, item)
  //       // const itemErrorSchema = errorSchema ? errorSchema[index] : undefined
  //       const itemIdPrefix = idSchema.$id + '_' + index
  //       const itemIdSchema = toIdSchema(itemSchema, itemIdPrefix, rootSchema, item, idPrefix, idSeparator)
  //       return renderArrayFieldItem({
  //         key,
  //         index,
  //         canMoveUp: index > 0,
  //         canMoveDown: index < formData.length - 1,
  //         itemSchema: itemSchema,
  //         itemIdSchema,
  //         // itemErrorSchema,
  //         itemData: item,
  //         itemUiSchema: uiSchema.items,
  //         autofocus: autofocus && index === 0,
  //         onBlur,
  //         onFocus,
  //       })
  //     }),
  //     className: `field field-array field-array-of-${itemsSchema.type}`,
  //     DescriptionField,
  //     disabled,
  //     idSchema,
  //     uiSchema,
  //     // onAddClick: this.onAddClick,
  //     readonly,
  //     hideError,
  //     required,
  //     schema,
  //     title,
  //     TitleField,
  //     formContext,
  //     formData,
  //     rawErrors,
  //     registry,
  //   }

  const arrayProps = {
    // canAdd: this.canAddItem(formData),
    items: state.keyedFormData.map((keyedItem, index) => {
      const { key, item } = keyedItem
      const itemSchema = retrieveSchema(schema.items, rootSchema, item)
      // const itemErrorSchema = errorSchema ? errorSchema[index] : undefined;
      const itemIdPrefix = idSchema.$id + '_' + index
      const itemIdSchema = toIdSchema(itemSchema, itemIdPrefix, rootSchema, item, idPrefix, idSeparator)
      return renderArrayFieldItem({
        key,
        index,
        // canMoveUp: index > 0,
        // canMoveDown: index < formData.length - 1,
        itemSchema: itemSchema,
        itemIdSchema,
        // itemErrorSchema,
        itemData: item,
        itemUiSchema: uiSchema.items,
        // autofocus: autofocus && index === 0,
        // onBlur,
        // onFocus,
        methods,
        name,
      })
    }),
    // className: `field field-array field-array-of-${itemsSchema.type}`,
    DescriptionField,
    disabled,
    idSchema,
    uiSchema,
    // onAddClick: this.onAddClick,
    readonly,
    hideError,
    required,
    schema,
    title,
    TitleField,
    formContext,
    // formData,
    // rawErrors,
    registry,
    methods,
    name,
  }

  // Check if a custom render function was passed in
  const Component = uiSchema['ui:ArrayFieldTemplate'] || ArrayFieldTemplate || DefaultNormalArrayFieldTemplate
  return <Component {...arrayProps} />
}

export default ArrayField
