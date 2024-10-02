import React from 'react'
import { EditorView } from '@codemirror/view'
import { Compartment, Extension } from '@codemirror/state'
import { CodeMirrorOnChange, CodeMirrorOnExternalChange, CodeMirrorOnViewLifeCycle, useCodeMirror } from '@ui-schema/kit-codemirror/useCodeMirror'
import { useEditorClasses } from '@ui-schema/kit-codemirror/useEditorClasses'

export interface CodeMirrorComponentProps {
    onChange?: CodeMirrorOnChange
    value?: string
    extensions?: Extension[]
    classNamesContent?: string[]
    effects?: ((editor: EditorView) => void)[]
    style?: React.CSSProperties
}

export interface CodeMirrorProps extends CodeMirrorComponentProps, Omit<React.HTMLProps<HTMLDivElement>, 'onChange' | 'value'> {
    onViewLifecycle?: CodeMirrorOnViewLifeCycle
    onExternalChange?: CodeMirrorOnExternalChange
    className?: string
}

export const CodeMirror: React.FC<CodeMirrorProps> = (
    {
        classNamesContent,
        onChange,
        onViewLifecycle, onExternalChange,
        value = '',
        extensions,
        effects,
        ...props
    },
) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    // refs for extensions need to be created before the extension
    const editorAttributesCompartment = React.useRef<Compartment>(new Compartment())

    const extensionsAll = React.useMemo(() => [
        editorAttributesCompartment.current.of(EditorView.editorAttributes.of({})),
        ...(extensions || []),
    ], [extensions])

    const editor = useCodeMirror(
        onChange,
        value,
        extensionsAll,
        effects,
        containerRef,
        onExternalChange,
        onViewLifecycle,
    )

    // but extensions need to receive both: Compartment and Editor (and optionally their values)
    // to be able to dispatch the correct effects
    useEditorClasses(editorAttributesCompartment.current, editor, classNamesContent)

    return <div
        ref={containerRef}
        {...props}
    />
}
