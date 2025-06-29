import Box from '@mui/material/Box'
import { useCodeMirror } from '@ui-schema/kit-codemirror'
import React, { useCallback, useMemo } from 'react'
import {
    lineNumbers, highlightActiveLineGutter, highlightSpecialChars,
    drawSelection, dropCursor,
    rectangularSelection, highlightActiveLine, keymap,
    EditorView,
    // crosshairCursor,
} from '@codemirror/view'
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap } from '@codemirror/language'
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { lintKeymap } from '@codemirror/lint'
import { Compartment, EditorState, Extension, Prec } from '@codemirror/state'
import { useEditorTheme } from '@ui-schema/material-code/useEditorTheme'
import { useHighlightStyle } from '@ui-schema/material-code/useHighlightStyle'
import { CodeMirrorComponentProps } from '@ui-schema/kit-codemirror/CodeMirror'
import { useExtension } from '@ui-schema/kit-codemirror/useExtension'
import { MuiCodeMirrorStyleProps } from '@ui-schema/material-code'

export const CustomCodeMirror: React.FC<CodeMirrorComponentProps & MuiCodeMirrorStyleProps & { minHeight?: number }> = (
    {
        value, extensions,
        dense, variant,
        onChange,
        style, classNameContent,
        minHeight,
        ...props
    },
) => {
    const extensionsAll: Extension[] = React.useMemo(() => [
        lineNumbers(),
        EditorView.lineWrapping,
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        new Compartment().of(EditorState.tabSize.of(4)),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        // crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
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
        ...(extensions || []),
    ], [extensions])

    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const [editorRef] = useCodeMirror({
        onChange,
        value: value || '',
        extensions: extensionsAll,
        containerRef,
        onViewLifecycle: React.useCallback((view) => {
            console.log('on-view-lifecycle', view)
        }, []),
    })

    useExtension(
        useMemo(() => {
            return Prec.lowest(EditorView.editorAttributes.of({class: classNameContent || ''}))
        }, [classNameContent]),
        editorRef,
    )

    const highlightStyle = useHighlightStyle()
    useExtension(
        useCallback(
            () => syntaxHighlighting(highlightStyle || defaultHighlightStyle, {fallback: true}),
            [highlightStyle],
        ),
        editorRef,
    )

    useExtension(
        useEditorTheme(typeof onChange === 'undefined', dense, variant),
        editorRef,
    )

    return <Box
        ref={containerRef}
        {...props}

        // use this to force any min height:
        style={minHeight ? {
            ...style,
            display: 'flex',
            minHeight: minHeight,
        } : style}
    />
}
