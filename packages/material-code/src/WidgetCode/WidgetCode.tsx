import { isRemoteChange } from '@ui-schema/kit-codemirror/isRemoteChange'
import React from 'react'
import { WithScalarValue } from '@ui-schema/ui-schema/UIStore'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { TransTitle } from '@ui-schema/ui-schema/Translate/TransTitle'
import { Trans } from '@ui-schema/ui-schema/Translate/Trans'
import { CodeMirrorComponentProps } from '@ui-schema/kit-codemirror/CodeMirror'
import { CodeMirrorOnChange } from '@ui-schema/kit-codemirror/useCodeMirror'
import { Extension } from '@codemirror/state'
import { CodeBar, CodeBarProps } from '@ui-schema/material-code/CodeBar'
import Box from '@mui/material/Box'
import { TextFieldProps } from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'

export interface MuiCodeMirrorStyleProps {
    dense?: boolean
    variant?: TextFieldProps['variant'] | 'embed'
}

export interface WidgetCodeProps {
    CodeMirror: React.FC<CodeMirrorComponentProps & MuiCodeMirrorStyleProps>
    extensions?: Extension[]
    barBegin?: React.ReactElement
    barContent?: React.ReactElement
    barEnd?: React.ReactElement
    CodeBar?: React.FC<CodeBarProps>
    formatValue: string | undefined
    readOnly?: boolean
}

export const WidgetCode: React.ComponentType<WidgetProps & WithScalarValue & WidgetCodeProps> = (
    {
        storeKeys, schema, value, onChange,
        valid, required, errors, showValidity,
        readOnly: readOnlyProp,
        CodeMirror, extensions,
        barBegin, barContent, barEnd,
        formatValue,
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
            storeKeys,
            scopes: ['value'],
            type: 'set',
            data: {
                value: newValue,
            },
            schema,
            required,
        })
    }, [onChange, storeKeys, schema, required])

    const hideTitle = schema?.getIn(['view', 'hideTitle'])
    const readOnly = readOnlyProp || schema?.get('readOnly')

    const classNameContent = React.useMemo(
        () => (!showValidity || valid ? undefined : 'invalid'),
        [valid, showValidity],
    )
    const CodeBarComp = CustomCodeBar || CodeBar
    const showTitle = required || formatValue || !hideTitle
    return <>
        {showTitle ?
            <Box mb={0.5}>
                <FormLabel error={(!valid && showValidity)}>
                    {hideTitle ? null : <>
                        <TransTitle storeKeys={storeKeys} schema={schema}/>
                        {required ? ' *' : null}
                    </>}
                    {formatValue ? <>
                        {hideTitle ? null : ' ('}
                        <Trans text={'formats.' + formatValue} fallback={formatValue}/>
                        {hideTitle ? null : ')'}
                    </> : null}
                </FormLabel>
            </Box> : null}

        <CodeMirror
            value={(value as string) || ''}
            onChange={readOnly ? undefined : handleOnChange}
            extensions={extensions}
            classNameContent={classNameContent}
            dense={schema.getIn(['view', 'dense']) as boolean}
        />

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>

        <CodeBarComp
            schema={schema}
            barBegin={barBegin}
            barContent={barContent}
            barEnd={barEnd}
        />
    </>
}
