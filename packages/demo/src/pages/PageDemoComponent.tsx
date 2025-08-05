import { isRemoteChange } from '@ui-schema/kit-codemirror/isRemoteChange'
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
import { Compartment, EditorState } from '@codemirror/state'
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'

export const PageDemoComponent: React.ComponentType = () => {
    return <>
        <Container maxWidth={'md'} fixed style={{display: 'flex'}}>
            <Nav/>
            <Box mx={2} py={1} style={{flexGrow: 1}}>
                <Box mb={2}>
                    <Typography variant={'h1'} gutterBottom>Component</Typography>
                    <Typography variant={'body1'}>Plain React components demo, no UI-Schema widgets, only standard theme.</Typography>
                    <Typography variant={'body1'}>
                        <Link
                            href={'https://github.com/ui-schema/react-codemirror/blob/main/packages/demo/src/pages/PageDemoComponent.tsx'}
                            target={'_blank'} rel={'noopener noreferrer'}
                        >demo source</Link>
                    </Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant={'h2'} gutterBottom>Basic</Typography>
                    <DemoComponent/>
                </Box>
                <Box mb={2}>
                    <Typography variant={'h2'} gutterBottom>Switchable ReadOnly</Typography>
                    <DemoComponentReadOnly/>
                </Box>
            </Box>
        </Container>
    </>
}

const CustomCodeMirror: React.FC<CodeMirrorComponentProps> = (
    {
        value,
        extensions,
        onChange,
    },
) => {
    const {palette} = useTheme()
    const themeMode = palette.mode
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
        EditorView.theme(
            {},
            {dark: themeMode === 'dark'},
        ),
        ...(extensions || []),
    ], [extensions, themeMode])

    const onViewLifecycle: CodeMirrorProps['onViewLifecycle'] = React.useCallback((view) => {
        console.log('on-view-lifecycle', view)
    }, [])

    return <CodeMirror
        value={value || ''}
        extensions={extensionsAll}
        onChange={onChange}
        onViewLifecycle={onViewLifecycle}
    />
}


const DemoComponent = () => {
    const [value, setValue] = React.useState('')

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
        />
    </React.Fragment>
}

const DemoComponentReadOnly = () => {
    const [readOnly, setReadOnly] = React.useState(false)
    const [value, setValue] = React.useState('')

    const onChange: CodeMirrorOnChange = React.useCallback((update, newValue) => {
        if(!update.docChanged || typeof newValue !== 'string' || isRemoteChange(update)) {
            return
        }
        setValue(newValue)
    }, [setValue])

    return <React.Fragment>
        <CustomCodeMirror
            value={value}
            onChange={readOnly ? undefined : onChange}
        />
        <Button onClick={() => setReadOnly(r => !r)}>{readOnly ? 'allow edits' : 'read-only'}</Button>
    </React.Fragment>
}
