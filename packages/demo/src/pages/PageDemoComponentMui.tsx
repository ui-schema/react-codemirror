import Button from '@mui/material/Button'
import { isRemoteChange } from '@ui-schema/kit-codemirror/isRemoteChange'
import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Nav } from '../components/Nav'
import { CodeMirrorOnChange, CodeMirrorOnViewLifeCycle } from '@ui-schema/kit-codemirror/useCodeMirror'
import { CodeMirrorComponentProps, CodeMirror, CodeMirrorOnSetup } from '@ui-schema/kit-codemirror/CodeMirror'
import {
    lineNumbers, highlightActiveLineGutter, highlightSpecialChars,
    drawSelection, dropCursor,
    rectangularSelection, highlightActiveLine, keymap,
    // crosshairCursor,
} from '@codemirror/view'
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap } from '@codemirror/language'
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { lintKeymap } from '@codemirror/lint'
import { Compartment, EditorState } from '@codemirror/state'
import { json } from '@codemirror/lang-json'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { MuiCodeMirrorStyleProps, useEditorTheme, useHighlightStyle } from '@ui-schema/material-code'

export const PageDemoComponentMui: React.ComponentType = () => {
    return <>
        <Container maxWidth={'xl'} fixed style={{display: 'flex', flexGrow: 1, overflow: 'auto'}}>
            <Nav/>
            <Box mx={2} py={1} style={{display: 'flex', flexDirection: 'column', overflow: 'auto', flexGrow: 1}}>
                <Box mb={2}>
                    <Typography variant={'h1'} gutterBottom>Component</Typography>
                    <Typography variant={'body1'}>Plain React components demo, no UI-Schema widgets, using Material-UI styling with <code>@mui</code>.</Typography>
                    <Typography variant={'body1'}>Page filling style, where the scrollable area is the CodeMirror Editor, use <code>{'variant: "embed"'}</code> to deactivate outlined/borders-radius.</Typography>
                    <Typography variant={'body1'}>
                        <Link
                            href={'https://github.com/ui-schema/react-codemirror/blob/main/packages/demo/src/pages/PageDemoComponentMui.tsx'}
                            target={'_blank'} rel={'noopener noreferrer'}
                        >demo source</Link>
                    </Typography>
                </Box>
                <Box
                    mb={2}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto',
                        flexGrow: 1,
                    }}
                >
                    <Typography variant={'h2'} gutterBottom>Content Editor</Typography>
                    <DemoComponent/>
                </Box>
            </Box>
        </Container>
    </>
}

const formats = {
    json: json,
    javascript: javascript,
    html: html,
    css: css,
}

const CustomCodeMirror: React.FC<CodeMirrorComponentProps & MuiCodeMirrorStyleProps> = (
    {
        value,
        onChange,
        // MUI style props
        dense, variant,
        // make this a reusable `CodeMirror` component
        // otherwise use `Pick<CodeMirrorComponentProps, 'value' | 'onChange'>` as props
        extensions,
        ...props
    },
) => {
    const [format] = React.useState('html')

    const theme = useEditorTheme(typeof onChange === 'undefined', dense, variant)
    const highlightStyle = useHighlightStyle()

    const extensionsAll = React.useMemo(() => [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        // crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        new Compartment().of(EditorState.tabSize.of(4)),
        keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
            ...lintKeymap,
            indentWithTab,
        ]),
        theme,
        syntaxHighlighting(highlightStyle || defaultHighlightStyle, {fallback: true}),
        ...formats[format] ? [formats[format]()] : [],
        ...(extensions || []),
    ], [extensions, format, highlightStyle, theme])

    const onViewLifecycle: CodeMirrorOnViewLifeCycle = React.useCallback((view) => {
        console.log('on-view-lifecycle', view)
        // note: using any `setState` here will cause performance degradation,
        // due to forcing a sync re-rendering after the first layout effect (which internally configures the editor view)
        // setView(view)
    }, [])

    // a special configure effect, which runs whenever it's reference is changed,
    // use it for adding event listeners to the editor view.
    const onSetup: CodeMirrorOnSetup = React.useCallback((view) => {
        if(!view) return
        const onFocus = (evt) => {
            console.log('focus', evt)
        }
        view.dom.addEventListener('focus', onFocus)

        // normal cleanup function, like in any react effect
        return () => view.dom.removeEventListener('focus', onFocus)
    }, [])

    return <CodeMirror
        value={value || ''}
        extensions={extensionsAll}
        onChange={onChange}
        onViewLifecycle={onViewLifecycle}
        onSetup={onSetup}
        {...props}
    />
}

const initialHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>React App</title>
    <style>
        body, html {
            height: 100%;
            margin: 0;
            padding: 0;
        }
    </style>
</head>
<body>
<h1>Lorem ipsum</h1>
<p>Dolor sit amet, consectutor adipisci.</p>
</body>
</html>`

const DemoComponent = () => {
    const [variant] = React.useState('standard')
    const [value, setValue] = React.useState(initialHtml)
    const [readOnly, setReadOnly] = React.useState(false)
    const [showDouble, setShowDouble] = React.useState(false)

    const onChange: CodeMirrorOnChange = React.useCallback((update, newValue) => {
        if(!update.docChanged || typeof newValue !== 'string') {
            return
        }

        // the editors value is controlled internally, if the `value` prop changes the editors value,
        // an onChange with the remote annotation is dispatched,
        // while if the changes comes from the user, this annotation doesn't exist.
        // if this sets the value, it is important to ignore these events for correct controlled behaviour.
        // const isFromRemote = view.transactions.some(t => t.annotation(Transaction.remote))
        if(isRemoteChange(update)) {
            console.log('isFromRemote', update.changes, update.transactions)
            return
        }
        setValue(newValue)
    }, [setValue])

    return <React.Fragment>
        <Box
            sx={{
                display: 'flex',
                overflow: 'auto',
                flexGrow: 1,
            }}
        >
            <CustomCodeMirror
                value={value}
                onChange={readOnly ? undefined : onChange}
                style={{
                    display: 'flex',
                    flexGrow: 1,
                    overflow: 'auto',
                    ...(variant === 'standard' ? {
                        padding: 2,// otherwise outline won't work (or use some hacky negative margin tricks etc.)
                    } : {}),
                }}
            />
            {showDouble ?
                <CustomCodeMirror
                    value={value}
                    onChange={onChange}
                    style={{
                        display: 'flex',
                        flexGrow: 1,
                        overflow: 'auto',
                        ...(variant === 'standard' ? {
                            padding: 2,// otherwise outline won't work (or use some hacky negative margin tricks etc.)
                        } : {}),
                    }}
                /> : null}
        </Box>
        <Button sx={{mt: 1}} onClick={() => setReadOnly(s => !s)}>{readOnly ? 'edit' : 'read'}</Button>
        <Button sx={{mt: 1}} onClick={() => setShowDouble(s => !s)}>{showDouble ? 'single' : 'double'}</Button>
    </React.Fragment>
}
