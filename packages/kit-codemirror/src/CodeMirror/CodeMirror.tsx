import { useExtension } from '@ui-schema/kit-codemirror/useExtension'
import { useCallback, useLayoutEffect, useRef } from 'react'
import type { CSSProperties, HTMLProps } from 'react'
import { EditorView } from '@codemirror/view'
import { Extension, Prec } from '@codemirror/state'
import { CodeMirrorOnChange, CodeMirrorOnExternalChange, CodeMirrorOnViewLifeCycle, useCodeMirror } from '@ui-schema/kit-codemirror/useCodeMirror'

export interface CodeMirrorComponentProps {
    onChange?: CodeMirrorOnChange
    value?: string
    extensions?: Extension[]
    classNameContent?: string
    style?: CSSProperties
}

export type CodeMirrorOnSetup = (editor: EditorView | null, destroyed?: boolean) => void | (() => void)

export interface CodeMirrorProps extends CodeMirrorComponentProps, Omit<HTMLProps<HTMLDivElement>, 'onChange' | 'value'> {
    onViewLifecycle?: CodeMirrorOnViewLifeCycle
    onExternalChange?: CodeMirrorOnExternalChange

    // Callback to set up custom extensions, and returns a cleanup function
    // runs after the editor was rendered, but before painted, inside a layout effect
    // can return a cleanup function
    onSetup?: CodeMirrorOnSetup

    className?: string
}

export const CodeMirror = (
    {
        classNameContent,
        onChange,
        onViewLifecycle,
        onSetup,
        onExternalChange,
        value = '',
        extensions,
        ...props
    }: CodeMirrorProps,
) => {
    const containerRef = useRef<HTMLDivElement | null>(null)

    const [editorRef] = useCodeMirror({
        onChange,
        value,
        extensions,
        containerRef,
        onExternalChange,
        onViewLifecycle,
    })

    // the `useExtension` hook must be called directly after `useCodeMirror`,
    // it takes care of adding the extension to the editorRef and keeping it up to date
    useExtension(
        useCallback(() => {
            return Prec.lowest(EditorView.editorAttributes.of({class: classNameContent || ''}))
        }, [classNameContent]),
        editorRef,
    )

    useLayoutEffect(() => {
        if(!onSetup) return
        return onSetup(editorRef.current)
    }, [editorRef, onSetup])

    return <div
        ref={containerRef}
        {...props}
    />
}
