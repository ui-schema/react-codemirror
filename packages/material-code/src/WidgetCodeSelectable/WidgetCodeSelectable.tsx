import { isRemoteChange } from '@ui-schema/kit-codemirror/isRemoteChange'
import React from 'react'
import { StoreKeyType, WithScalarValue } from '@ui-schema/ui-schema/UIStore'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { TransTitle } from '@ui-schema/ui-schema/Translate/TransTitle'
import { Trans } from '@ui-schema/ui-schema/Translate/Trans'
import { CodeMirrorOnChange } from '@ui-schema/kit-codemirror/useCodeMirror'
import { WidgetCodeProps } from '@ui-schema/material-code/WidgetCode'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { List } from 'immutable'
import { CodeBar, CodeBarProps } from '@ui-schema/material-code/CodeBar'
import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'

export interface WidgetCodeSelectProps {
    value: string | undefined
    formatKey: StoreKeyType
    valueKey: StoreKeyType
    selectSize?: 'small' | 'medium'
    CodeBar?: React.FC<CodeBarProps>
    onChangeFormat?: (format: string) => void
}

export const WidgetCodeSelectable: React.ComponentType<WidgetProps & WithScalarValue & Omit<WidgetCodeProps, 'barBegin'> & WidgetCodeSelectProps> = (
    {
        storeKeys, schema, value, onChange,
        valid, required, errors, showValidity,
        readOnly: readOnlyProp,
        CodeMirror, extensions,
        formatValue,
        formatKey, valueKey,
        barContent, barEnd,
        selectSize = 'small',
        onChangeFormat,
        CodeBar: CustomCodeBar,
    },
) => {
    const handleOnChange: CodeMirrorOnChange = React.useCallback((update, newValue) => {
        if(!update.docChanged || typeof newValue !== 'string') {
            return
        }
        if(isRemoteChange(update)) {
            return
        }
        onChange({
            storeKeys: storeKeys.push(valueKey),
            scopes: ['value'],
            type: 'set',
            data: {
                value: newValue,
            },
            schema,
            required,
        })
    }, [onChange, storeKeys, schema, required, valueKey])

    const handleOnChangeFormat: (e: SelectChangeEvent) => void = React.useCallback((e) => {
        if(onChangeFormat) {
            onChangeFormat(e.target.value)
        }
        onChange({
            storeKeys: storeKeys.push(formatKey),
            scopes: ['value'],
            type: 'set',
            data: {
                value: e.target.value,
            },
            schema,
            required,
        })
    }, [onChange, onChangeFormat, storeKeys, schema, required, formatKey])

    const hideTitle = schema?.getIn(['view', 'hideTitle'])
    const readOnly = readOnlyProp || schema?.get('readOnly')

    const classNameContent = React.useMemo(
        () => (!showValidity || valid ? undefined : 'invalid'),
        [valid, showValidity],
    )
    const CodeBarComp = CustomCodeBar || CodeBar
    return <>
        {hideTitle ? null :
            <Box mb={0.5}>
                <FormLabel error={(!valid && showValidity)}>
                    <TransTitle storeKeys={storeKeys} schema={schema}/>
                    {required ? ' *' : null}
                </FormLabel>
            </Box>}

        <CodeMirror
            value={value || ''}
            onChange={readOnly ? undefined : handleOnChange}
            extensions={extensions}
            classNameContent={classNameContent}
            dense={schema.getIn(['view', 'dense']) as boolean}
        />

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>

        <CodeBarComp
            schema={schema}
            barBegin={
                <Select
                    onChange={handleOnChangeFormat}
                    value={formatValue || ''}
                    size={selectSize}
                    disabled={readOnly}
                >
                    {(schema?.get('format') as List<string>)?.map(
                        f =>
                            <MenuItem key={f} value={f} dense>
                                <Trans text={'formats.' + f} fallback={f}/>
                            </MenuItem>,
                    )}
                </Select>
            }
            barContent={barContent}
            barEnd={barEnd}
        />
    </>
}
