//@ts-ignore
import includes from 'core-js-pure/es/array/includes'

import {
  CommonProps,
  getUiOptions,
  toIdSchema,
  retrieveSchema,
  isMultiSelect,
  getWidget,
  optionsList,
} from 'jsonshema-form-core'
import { useFieldArray } from 'react-hook-form'

const ArrayFieldTitle = ({ TitleField, idSchema, title, required }: any) => {
  if (!title) return null

  const id = `${idSchema.$id}__title`
  return <TitleField id={id} title={title} required={required} />
}

const ArrayFieldDescription = ({ DescriptionField, idSchema, description }: any) => {
  if (!description) return null

  const id = `${idSchema.$id}__description`
  return <DescriptionField id={id} description={description} />
}

const renderArrayFieldItem = ({
  key,
  index,
  canRemove = true,
  canMoveUp = true,
  canMoveDown = true,
  itemSchema,
  itemUiSchema,
  itemIdSchema,
  idPrefix,
  idSeparator,
  disabled,
  readonly,
  uiSchema,
  registry,
  methods,
  name,
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
    toolbar: false,
  }

  has.toolbar = Object.keys(has).some((key) => has[key])

  return {
    children: (
      <SchemaField
        key={key}
        name={name}
        index={index}
        schema={itemSchema}
        uiSchema={itemUiSchema}
        idPrefix={idPrefix}
        idSeparator={idSeparator}
        idSchema={itemIdSchema}
        required={isItemRequired(itemSchema)}
        registry={registry}
        disabled={disabled}
        readonly={readonly}
        methods={methods}
      />
    ),
    className: 'array-item',
    disabled,
    methods,
    hasToolbar: has.toolbar,
    hasMoveUp: has.moveUp,
    hasMoveDown: has.moveDown,
    hasRemove: has.remove,
    index,
    name,
    key,
    // onAddIndexClick: this.onAddIndexClick,
    // onDropIndexClick: this.onDropIndexClick,
    // onReorderClick: this.onReorderClick,
    readonly,
  }
}

const DefaultArrayItem = (props: any) => {
  // const btnStyle = {
  //   flex: 1,
  //   paddingLeft: 6,
  //   paddingRight: 6,
  //   fontWeight: 'bold',
  // }

  return (
    <div key={props.key} className={props.className}>
      <div className={props.hasToolbar ? 'col-xs-9' : 'col-xs-12'}>{props.children}</div>

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

const DefaultNormalArrayFieldTemplate = (props: any) => {
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

      <div key={`array-item-list-${props.idSchema.$id}`}>
        {props.items && props.items.map((p: any) => DefaultArrayItem(p))}
      </div>

      {/* {props.canAdd && (
        <AddButton className="array-item-add" onClick={props.onAddClick} disabled={props.disabled || props.readonly} />
      )} */}
    </fieldset>
  )
}

const NormalArray = ({
  schema,
  uiSchema,
  idSchema,
  name,
  required,
  disabled,
  readonly,
  registry,
  idPrefix,
  idSeparator,
  methods,
}: any) => {
  const { control } = methods
  const { fields: arrayFields } = useFieldArray({
    control,
    name,
  })

  const title = schema.title === undefined ? name : schema.title
  const { ArrayFieldTemplate, fields, formContext, rootSchema } = registry
  const { TitleField, DescriptionField } = fields
  // const itemsSchema = retrieveSchema(schema.items, rootSchema)

  // const canAddItem = (formItems) => {
  //   let { addable } = getUiOptions(uiSchema) as any
  //   if (addable !== false) {
  //     // if ui:options.addable was not explicitly set to false, we can add
  //     // another item if we have not exceeded maxItems yet
  //     if (schema.maxItems !== undefined) {
  //       addable = formItems.length < schema.maxItems
  //     } else {
  //       addable = true
  //     }
  //   }
  //   return addable
  // }

  const arrayProps = {
    // canAdd: canAddItem(keyedFormData),
    items: arrayFields.map(({ id }, index) => {
      const itemSchema = retrieveSchema(schema.items, rootSchema)
      const itemIdPrefix = idSchema.$id + '_' + index
      const itemIdSchema = toIdSchema(itemSchema, itemIdPrefix, rootSchema, idPrefix, idSeparator)

      return renderArrayFieldItem({
        key: id,
        name: `${name}.${index}`,
        index,
        canMoveUp: index > 0,
        // canMoveDown: index < keyedFormData.length - 1,
        itemSchema: itemSchema,
        itemIdSchema,
        itemUiSchema: uiSchema.items,
        disabled,
        idPrefix,
        idSeparator,
        readonly,
        registry,
        uiSchema,
        methods,
        // canRemove
      })
    }),
    DescriptionField,
    disabled,
    idSchema,
    uiSchema,
    // onAddClick: this.onAddClick,
    readonly,
    required,
    schema,
    title,
    TitleField,
    formContext,
    registry,
    methods,
  }

  const Component = uiSchema['ui:ArrayFieldTemplate'] || ArrayFieldTemplate || DefaultNormalArrayFieldTemplate
  return <Component {...arrayProps} />
}

const MultiSelect = ({
  schema,
  idSchema,
  uiSchema,
  disabled,
  readonly,
  required,
  registry,
  methods,
  name,
  placeholder,
}: any) => {
  const { widgets, rootSchema, formContext } = registry
  const itemsSchema = retrieveSchema(schema.items, rootSchema)
  const title = schema.title || name
  const enumOptions = optionsList(itemsSchema)
  const { widget = 'select', ...options } = {
    ...getUiOptions(uiSchema),
    enumOptions,
  }
  const Widget = getWidget(schema, widget, widgets)
  return (
    <Widget
      id={idSchema && idSchema.$id}
      name={name}
      multiple
      options={options}
      schema={schema}
      registry={registry}
      disabled={disabled}
      readonly={readonly}
      required={required}
      label={title}
      formContext={formContext}
      methods={methods}
      placeholder={placeholder}
    />
  )
}

const ArrayField = ({
  name,
  registry,
  schema,
  idSchema,
  uiSchema,
  required,
  readonly,
  disabled,
  idPrefix,
  idSeparator,
  methods,
  placeholder,
}: CommonProps) => {
  const { rootSchema } = registry

  if (!schema.hasOwnProperty('items')) {
    const { fields } = registry
    const { UnsupportedField } = fields

    return <UnsupportedField schema={schema} idSchema={idSchema} reason="Missing items definition" />
  }

  if (isMultiSelect(schema, rootSchema)) {
    return (
      <MultiSelect
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        required={required}
        readonly={readonly}
        disabled={disabled}
        name={name}
        methods={methods}
        placeholder={placeholder}
      />
    )
  }

  return (
    <NormalArray
      schema={schema}
      uiSchema={uiSchema}
      idSchema={idSchema}
      registry={registry}
      required={required}
      readonly={readonly}
      disabled={disabled}
      idPrefix={idPrefix}
      idSeparator={idSeparator}
      name={name}
      methods={methods}
    />
  )
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

export default ArrayField
