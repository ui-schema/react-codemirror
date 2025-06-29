import { useLayoutEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { EditorView, ViewUpdate } from '@codemirror/view'
import { Compartment, Extension } from '@codemirror/state'
import { createEditorView, replaceWholeDoc } from '@ui-schema/kit-codemirror/createEditorView'

export type CodeMirrorOnChange = (view: ViewUpdate, nextValue: string | undefined, prevValue: string | undefined) => void

export type CodeMirrorOnExternalChange = (editor: EditorView, nextValue: string, prevValue: string) => void

export type CodeMirrorOnViewLifeCycle = (editor: EditorView | null, destroyed?: boolean) => void

export const useCodeMirror = (
    {
        onChange,
        value = '',
        extensions,
        containerRef,
        onExternalChange = replaceWholeDoc,
        onViewLifecycle,
    }: {
        onChange?: CodeMirrorOnChange
        // The latest value of the editor in the parent state.
        value: string
        // Extensions to apply. Changes to this array will reconfigure the editor
        // without destroying and re-creating the entire EditorView instance.
        // For performance, memoize this array in the parent component.
        extensions?: Extension[]
        // The container, if set, must be stable. Changes will recreate the editor.
        containerRef?: { current: HTMLDivElement | null }
        // Callback to handle external value changes.
        onExternalChange?: CodeMirrorOnExternalChange
        // Callback for editor lifecycle events.
        onViewLifecycle?: CodeMirrorOnViewLifeCycle
    },
    // eslint-disable-next-line @typescript-eslint/no-deprecated
): [MutableRefObject<EditorView | null>, Compartment] => {
    const editorRef = useRef<EditorView | null>(null)

    const onChangeRef = useRef(onChange)
    const onExternalChangeRef = useRef(onExternalChange)
    const onViewLifecycleRef = useRef(onViewLifecycle)
    onChangeRef.current = onChange
    onExternalChangeRef.current = onExternalChange
    onViewLifecycleRef.current = onViewLifecycle

    const lastValueRef = useRef<string>(value)

    const readOnlyCompartment = useRef(new Compartment())
    const extensionCompartment = useRef(new Compartment())

    useLayoutEffect(() => {
        const editorView = createEditorView(
            lastValueRef,
            [
                extensionCompartment.current.of(extensions || []),
                readOnlyCompartment.current.of(EditorView.editable.of(Boolean(onChangeRef.current))),
            ],
            onChangeRef,
        )

        // todo: it could be that this DOM manipulation should happen after all initial extensions where added,
        //       as `useExtension` relies on the ref from this hook, these plugins are configured after the editor
        //       is added to DOM, which may be undesirable, needs verification in the future.
        if(containerRef) {
            containerRef.current?.append(editorView.dom)
        }
        editorRef.current = editorView
        onViewLifecycleRef.current?.(editorView)

        return () => {
            onViewLifecycleRef.current?.(null, true)
            editorView?.destroy()
            editorRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerRef])

    const editable = Boolean(onChange)
    useLayoutEffect(() => {
        editorRef.current?.dispatch({
            effects: readOnlyCompartment.current.reconfigure(EditorView.editable.of(editable)),
        })
    }, [editable])

    useLayoutEffect(() => {
        editorRef.current?.dispatch({
            effects: extensionCompartment.current.reconfigure(extensions || []),
        })
    }, [extensions])

    useLayoutEffect(() => {
        // changes doc when props-value changed - and change was not the last one from within this `CodeMirror`
        // = maybe changes from another user
        const editor = editorRef.current
        if(!editor) return
        if(lastValueRef.current !== value) {
            const previousValue = editor.state.doc.toString()
            onExternalChangeRef.current(editor, value, previousValue)
            // note: not updating `lastValueRef` here, as the `updateListener` must act as single source of truth
        }
    }, [value])

    return [editorRef, extensionCompartment.current] as const
}
