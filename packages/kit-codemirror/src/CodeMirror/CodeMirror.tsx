import React from 'react'
import { EditorView } from '@codemirror/view'
import { Compartment, Extension } from '@codemirror/state'
import { CodeMirrorOnChange, useCodeMirror } from '@ui-schema/kit-codemirror/useCodeMirror'
import { useEditorClasses } from '@ui-schema/kit-codemirror/useEditorClasses'

export interface CodeMirrorComponentProps {
    onChange?: CodeMirrorOnChange
    value?: string
    extensions?: Extension[]
    classNamesContent?: string[]
    effects?: ((editor: EditorView) => void)[]
}

export interface CodeMirrorProps extends CodeMirrorComponentProps {
    // can be called multiple times, every time an editor is re-created, e.g. because of theming change
    // - called when editor is created with `value`
    // - when editor was created, will be called with `undefined` after the editor is destroyed OR on unmount
    onViewLifecycle?: (editor: EditorView | undefined) => void
    className?: string
    style?: React.CSSProperties
}

export const CodeMirror: React.FC<CodeMirrorProps> = (
    {
        className,
        classNamesContent,
        onChange,
        onViewLifecycle,
        value = '',
        style,
        extensions,
        effects,
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
        containerRef,
        onChange,
        value,
        extensionsAll,
        effects,
    )

    // but extensions need to receive both: Compartment and Editor (and optionally their values)
    // to be able to dispatch the correct effects
    useEditorClasses(editorAttributesCompartment.current, editor, classNamesContent)

    React.useEffect(() => {
        if(!onViewLifecycle || !editor) return
        onViewLifecycle(editor)
        return () => onViewLifecycle(undefined)
    }, [onViewLifecycle, editor])

    return <div className={className} style={style} ref={containerRef}/>
}
