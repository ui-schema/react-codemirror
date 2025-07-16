import { MuiBinding } from '@ui-schema/ds-material'
import { requiredPlugin, validatorPlugin } from '@ui-schema/json-schema'
import { DefaultHandler, ValidityReporter, WidgetProps } from '@ui-schema/react'
import { schemaPluginsAdapterBuilder } from '@ui-schema/react/SchemaPluginsAdapter'
import { StoreKeyType } from '@ui-schema/ui-schema/ValueStore'
import { Map } from 'immutable'
import React from 'react'
import { baseComponents, typeWidgets } from '@ui-schema/ds-material/BindingDefault'
import { bindingExtended } from '@ui-schema/ds-material/BindingExtended'
import { SchemaGridHandler } from '@ui-schema/ds-material/Grid'
import Button from '@mui/material/Button'
import { json } from '@codemirror/lang-json'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { WidgetCode } from '@ui-schema/material-code'
import { WidgetCodeSelectable } from '@ui-schema/material-code/WidgetCodeSelectable'
import { CustomCodeMirror } from './CustomCodeMirror'

export const CustomWidgetCode: React.ComponentType<WidgetProps> = (props) => {
    const format = props.schema.get('format')
    // map the to-be-supported CodeMirror language, or add other extensions
    const extensions = React.useMemo(() => [
        ...(format === 'json' ? [json()] : []),
        ...(format === 'javascript' ? [javascript()] : []),
        ...(format === 'html' ? [html()] : []),
        ...(format === 'css' ? [css()] : []),
    ], [format])

    return <WidgetCode
        {...props}
        CodeMirror={CustomCodeMirror}
        // `extensions` will be passed down again to `CustomCodeMirror`
        extensions={extensions}
        formatValue={format}
    />
}

const CustomWidgetCodeSelectable: React.ComponentType<WidgetProps> = (
    {value, ...props},
) => {
    const {schema, onChange, storeKeys} = props
    const valueType = schema.get('type') as 'array' | 'object'
    // supporting different types requires mapping the actual key of `format` and `value` inside the non-scalar value of this component
    // - for tuples: [0: format, 1: code]
    // - for objects: {lang, code}
    const formatKey: StoreKeyType = valueType === 'array' ? 0 : 'lang'
    const valueKey: StoreKeyType = valueType === 'array' ? 1 : 'code'
    const valueMap = Map.isMap(value) ? value : undefined
    const format = valueMap?.get(formatKey) as string | undefined || schema.get('formatDefault') as string | undefined
    const codeValue = valueMap?.get(valueKey) as string | undefined

    // map the to-be-supported CodeMirror language, or add other extensions
    const extensions = React.useMemo(() => [
        ...(format === 'json' ? [json()] : []),
        ...(format === 'javascript' ? [javascript()] : []),
        ...(format === 'html' ? [html()] : []),
        ...(format === 'css' ? [css()] : []),
    ], [format])

    return <WidgetCodeSelectable
        {...props}
        CodeMirror={CustomCodeMirror}
        // `extensions` will be passed down again to `CustomCodeMirror`
        extensions={extensions}
        formatKey={formatKey}
        valueKey={valueKey}
        value={codeValue}
        formatValue={format}
        barContent={
            format === 'json' ?
                <Button onClick={() => onChange({
                    storeKeys: storeKeys.push(valueKey),
                    scopes: ['value'],
                    type: 'update',
                    updater: ({value}) => {
                        let formattedValue = value
                        try {
                            formattedValue = JSON.stringify(JSON.parse(value), undefined, 4)
                        } catch(e) {
                            // todo: add listeners and state for "formatter failed" and so on
                            console.error(e)
                        }
                        return {
                            value: formattedValue,
                        }
                    },
                    schema,
                })}>
                    beautify code
                </Button> : undefined
        }
    />
}

export const customBinding: MuiBinding = {
    ...baseComponents,

    // Widget mapping by schema type or custom ID.
    widgets: {
        ...typeWidgets,
        ...bindingExtended,

        Code: CustomWidgetCode,
        CodeSelectable: CustomWidgetCodeSelectable,
    },

    // Plugins that wrap each rendered widget.
    widgetPlugins: [
        DefaultHandler, // handles `default` keyword

        // Runs SchemaPlugins, connects to SchemaResource (if enabled)
        schemaPluginsAdapterBuilder([
            // runs `validate` and related schema postprocessing
            validatorPlugin,

            // injects the `required` prop
            requiredPlugin,
        ]),

        SchemaGridHandler, // MUI v5/6 Grid item

        ValidityReporter, // keeps `valid`/`errors` in sync with `store`
    ],
}
