import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Nav } from '../components/Nav'
import { CodeMirrorOnChange } from '@ui-schema/kit-codemirror/useCodeMirror'
import { CodeMirrorComponentProps, CodeMirror, CodeMirrorProps } from '@ui-schema/kit-codemirror/CodeMirror'
import {
    lineNumbers, highlightActiveLineGutter, highlightSpecialChars,
    drawSelection, dropCursor,
    rectangularSelection, highlightActiveLine, keymap, EditorView,
    // crosshairCursor,
} from '@codemirror/view'
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap } from '@codemirror/language'
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { lintKeymap } from '@codemirror/lint'
import { Compartment, EditorState, Extension } from '@codemirror/state'
import { json } from '@codemirror/lang-json'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { MuiCodeMirrorStyleProps, useEditorTheme, useHighlightStyle } from '@ui-schema/material-code'
import { useExtension } from '@ui-schema/kit-codemirror'

export const PageDemoComponentMui: React.ComponentType = () => {
    return <>
        <Container maxWidth={'md'} fixed style={{display: 'flex', flexGrow: 1, overflow: 'auto'}}>
            <Nav/>
            <Box mx={2} py={1} style={{display: 'flex', flexDirection: 'column', overflow: 'auto', flexGrow: 1}}>
                <Box mb={2}>
                    <Typography variant={'h1'} gutterBottom>Component</Typography>
                    <Typography variant={'body1'}>Plain React components demo, no UI-Schema widgets, using Material-UI styling with <code>@mui</code>.</Typography>
                    <Typography variant={'body1'}>Page filling style, where the scrollable area is the CodeMirror Editor, use <code>variant: &qout;embed&qout;</code> to deactivate outlined/borders-radius.</Typography>
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

export const CustomCodeMirror: React.FC<CodeMirrorComponentProps & MuiCodeMirrorStyleProps> = (
    {
        value,
        onChange,
        // MUI style props
        dense, variant,
        // make this a reusable `CodeMirror` component
        // otherwise use `Pick<CodeMirrorComponentProps, 'value' | 'onChange'>` as props
        extensions,
        effects,
        ...props
    },
) => {
    const [format] = React.useState('html')

    // using a "direct plugin integration with reconfigure support"
    const theme = useEditorTheme(typeof onChange === 'undefined', dense, variant)
    const themeRef = React.useRef<Extension>(theme)
    const themeCompartment = React.useRef<Compartment>(new Compartment())

    // using the `useExtension` hook to help with compartment plugins:
    const highlightStyle = useHighlightStyle()
    const {init: initHighlightExt, effects: effectsHighlightExt} = useExtension(
        () => syntaxHighlighting(highlightStyle || defaultHighlightStyle, {fallback: true}),
        [highlightStyle],
    )

    const effectsRef = React.useRef<((editor: EditorView) => void)[]>(effects || [])

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
        themeCompartment.current.of(themeRef.current),// only initial theme here to not re-create extensions
        initHighlightExt(),
        ...(format === 'json' ? [json()] : []),
        ...(format === 'javascript' ? [javascript()] : []),
        ...(format === 'html' ? [html()] : []),
        ...(format === 'css' ? [css()] : []),
        ...(extensions || []),
    ], [extensions, format, initHighlightExt])

    // attach parent plugin effects first
    React.useMemo(() => {
        if(!effects) return
        effectsRef.current.push(...effects)
    }, [effects])

    // attach each plugin effect separately (thus only the one which changes get reconfigured)
    React.useMemo(() => {
        // without `useExtension` you get direct access to the current `editor` inside of the effect
        // to otherwise access `editor`, you can't use the component `CodeMirror` but must use the hook `useCodeMirror`
        effectsRef.current.push(
            function updateTheme(editor) {
                editor.dispatch({
                    effects: themeCompartment.current.reconfigure(theme),
                })
            },
        )
    }, [theme])

    React.useMemo(() => {
        effectsRef.current.push(...effectsHighlightExt)
    }, [effectsHighlightExt])

    const onViewLifecycle: CodeMirrorProps['onViewLifecycle'] = React.useCallback((view) => {
        console.log('on-view-lifecycle', view)
    }, [])

    return <CodeMirror
        value={value || ''}
        extensions={extensionsAll}
        onChange={onChange}
        onViewLifecycle={onViewLifecycle}
        effects={effectsRef.current.splice(0, effectsRef.current.length)}
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

    const onChange: CodeMirrorOnChange = React.useCallback((editor, newValue) => {
        if(!editor.docChanged || typeof newValue !== 'string') {
            return
        }
        setValue(newValue)
    }, [setValue])

    return <React.Fragment>
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
        />
    </React.Fragment>
}
