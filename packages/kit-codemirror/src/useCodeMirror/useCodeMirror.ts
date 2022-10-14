import React from 'react'
import { EditorView, ViewUpdate } from '@codemirror/view'
import { Compartment, Extension } from '@codemirror/state'
import { createEditorView, replaceWholeDoc } from '@ui-schema/kit-codemirror/createEditorView'

export type CodeMirrorOnChange = (view: ViewUpdate, nextValue: string | undefined, prevValue: string | undefined) => void

export type CodeMirrorOnExternalChange = (editor: EditorView, nextValue: string, prevValue: string) => void

export type CodeMirrorOnViewLifeCycle = (editor: EditorView | undefined, destroyed?: boolean) => void

export const useCodeMirror = (
    onChange?: CodeMirrorOnChange,
    // the latest value of the editor in the parent state
    value: string = '',
    extensions?: Extension[],
    // effects to be consumed with next `layoutEffect`
    // use e.g. `effectsRef.current.splice(0, effectsRef.current.length)`,
    // to pass them down and remove them - so they won't get run again on next render
    effects?: ((editor: EditorView) => void)[],
    // the container, if set must be set from start on, otherwise editor won't behave correctly
    // if not set, use the `onViewLifecycle` callback to mount the editor yourself
    containerRef?: { current: HTMLDivElement | null },
    // handle when `value` has changed from some other instance than this
    onExternalChange: CodeMirrorOnExternalChange = replaceWholeDoc,
    // could be called multiple times, every time an editor is re-created, e.g. because of full extensions change
    // - will receive the previous editor, and `true` if deleted
    // - is called after setting to state (and if containerRef is set, after mounting to container), but within same render cycle
    // - is called in cleanup, but before actual destroying the editor (directly afterwards)
    onViewLifecycle?: CodeMirrorOnViewLifeCycle,
): EditorView | undefined => {
    const lastValueRef = React.useRef<string>(value)
    const onChangeRef = React.useRef<CodeMirrorOnChange | undefined>(undefined)
    const [editor, setEditor] = React.useState<EditorView | undefined>(undefined)
    // as onChange relies on the mounting state, this can't be solved with a "normal Compartment style" extension,
    // these ref hacks should be the safest/fastest option
    onChangeRef.current = onChange

    const readOnlyCompartment = React.useRef<Compartment>(new Compartment())

    React.useLayoutEffect(() => {
        const editor = createEditorView(
            lastValueRef,
            [
                ...extensions || [],
                readOnlyCompartment.current.of(EditorView.editable.of(Boolean(onChangeRef.current))),
            ],
            onChangeRef,
        )

        if(containerRef) {
            containerRef.current?.append(editor.dom)
        }
        setEditor(editor)
        onViewLifecycle?.(editor)

        return () => {
            onViewLifecycle?.(editor, true)
            editor?.destroy()
            setEditor(undefined)
        }
    }, [containerRef, extensions, onViewLifecycle])

    React.useEffect(() => {
        if(!editor) return
        editor.dispatch({
            effects: readOnlyCompartment.current.reconfigure(EditorView.editable.of(Boolean(onChange))),
        })
    }, [editor, onChange])

    //
    // ! 1. process external changes
    React.useLayoutEffect(() => {
        if(!editor) return
        // changes doc when props-value changed - and change was not the last one from within this `CodeMirror`
        // = maybe changes from another user
        if(lastValueRef.current !== value) {
            // todo: really rely on `state.doc`?
            //       as `lastValueRef.current` may be updated before `editor` has finished consuming the last change,
            //       building a diff with that "actual-latest" value will produce invalid `changes.from/to` ranges.
            const textA = editor.state.doc.toString()// lastValueRef.current
            const textB = value
            onExternalChange(editor, textB, textA)
            lastValueRef.current = textB
        } else {
            lastValueRef.current = value
        }
    }, [value, editor, onExternalChange, containerRef])

    //
    // ! 2. process own changes
    //
    effects = effects?.length === 0 ? undefined : effects // re-execution protection for no-effects with "splice"
    React.useLayoutEffect(() => {
        if(!editor && effects) {
            console.error('received effects but editor is not ready', effects)
            return
        }
        if(!effects || !editor) return
        effects.forEach(effect => {
            effect(editor)
        })
    }, [effects, editor])

    return editor
}
