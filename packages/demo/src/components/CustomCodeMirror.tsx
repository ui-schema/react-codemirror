import React from 'react'
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
import { Compartment, EditorState, Extension } from '@codemirror/state'
import { useEditorTheme } from '@ui-schema/material-code/useEditorTheme'
import { useHighlightStyle } from '@ui-schema/material-code/useHighlightStyle'
import { CodeMirrorComponentProps, CodeMirror, CodeMirrorProps } from '@ui-schema/kit-codemirror/CodeMirror'
import { useExtension } from '@ui-schema/kit-codemirror/useExtension'

export const CustomCodeMirror: React.FC<CodeMirrorComponentProps> = (
    {
        // values we want to override in this component
        value, extensions, effects,
        // everything else is just passed down
        ...props
    },
) => {
    const {onChange} = props
    const theme = useEditorTheme(typeof onChange === 'undefined')
    const highlightStyle = useHighlightStyle()
    const {init: initHighlightExt, effects: effectsHighlightExt} = useExtension(
        () => syntaxHighlighting(highlightStyle || defaultHighlightStyle, {fallback: true}),
        [highlightStyle],
    )
    const {init: initThemeExt, effects: effectsThemeExt} = useExtension(
        () => theme,
        [theme],
    )
    const themeCompartment = React.useRef<Compartment>(new Compartment())
    const effectsRef = React.useRef<((editor: EditorView) => void)[]>(effects || [])

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
        initHighlightExt(),
        initThemeExt(),
        // themeCompartment.current.of(themeRef.current),// only initial theme here to not re-create extensions
        ...(extensions || []),
    ], [extensions, initHighlightExt, initThemeExt])

    React.useMemo(() => {
        if(!effects) return
        effectsRef.current.push(...effects)
    }, [effects])
    React.useMemo(() => {
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
    React.useMemo(() => {
        effectsRef.current.push(...effectsThemeExt)
    }, [effectsThemeExt])

    const onViewLifecycle: CodeMirrorProps['onViewLifecycle'] = React.useCallback((view) => {
        console.log('on-view-lifecycle', view)
    }, [])

    return <CodeMirror
        value={value || ''}
        extensions={extensionsAll}
        onViewLifecycle={onViewLifecycle}
        effects={effectsRef.current.splice(0, effectsRef.current.length)}
        {...props}
        // className={className}
    />
}
