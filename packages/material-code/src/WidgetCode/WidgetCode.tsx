import React from 'react'
import { Trans, TransTitle, WidgetProps, WithScalarValue } from '@ui-schema/ui-schema'
import { CodeMirrorComponentProps } from '@ui-schema/kit-codemirror/CodeMirror'
import { CodeMirrorOnChange } from '@ui-schema/kit-codemirror/useCodeMirror'
import { Extension } from '@codemirror/state'
import { CodeBar, CodeBarProps } from '@ui-schema/material-code/CodeBar'
import { Box } from '@mui/material'
import FormLabel from '@mui/material/FormLabel'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'

export interface WidgetCodeProps {
    CodeMirror: React.FC<CodeMirrorComponentProps>
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
    const handleOnChange: CodeMirrorOnChange = React.useCallback((_editor, newValue, prevValue) => {
        if(newValue === prevValue) {
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

    const classNamesContent = React.useMemo(() => (valid ? undefined : ['invalid']), [valid])
    const CodeBarComp = CustomCodeBar || CodeBar
    return <>
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
        </Box>

        <CodeMirror
            value={(value as string) || ''}
            onChange={readOnly ? undefined : handleOnChange}
            extensions={extensions}
            classNamesContent={classNamesContent}
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
