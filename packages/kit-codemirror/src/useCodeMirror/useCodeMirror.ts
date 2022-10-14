import React from 'react'
import { EditorView, ViewUpdate } from '@codemirror/view'
import { Compartment, Extension } from '@codemirror/state'
import { createEditorView, replaceWholeDoc } from '@ui-schema/kit-codemirror/createEditorView'

export type CodeMirrorOnChange = (view: ViewUpdate, nextValue: string | undefined, prevValue: string | undefined) => void

export type CodeMirrorOnExternalChange = (editor: EditorView, nextValue: string, prevValue: string) => void

export const useCodeMirror = (
    containerRef: React.MutableRefObject<HTMLDivElement | null>,
    onChange?: CodeMirrorOnChange,
    // the latest value of the editor in the parent state
    value: string = '',
    extensions?: Extension[],
    // effects to be consumed with next `layoutEffect`
    // use e.g. `effectsRef.current.splice(0, effectsRef.current.length)`,
    // to pass them down and remove them - so they won't get run again on next render
    effects?: ((editor: EditorView) => void)[],
    // handle when `value` has changed from some other instance than this
    onExternalChange: CodeMirrorOnExternalChange = replaceWholeDoc,
): EditorView => {
    const lastValueRef = React.useRef<string>(value)
    const onChangeRef = React.useRef<CodeMirrorOnChange | undefined>(undefined)
    // as onChange relies on the mounting state, this can't be solved with a "normal Compartment style" extension,
    // these ref hacks should be the safest/fastest option
    onChangeRef.current = onChange

    const readOnlyCompartment = React.useRef<Compartment>(new Compartment())

    const editor: EditorView = React.useMemo(() => {
        return createEditorView(
            containerRef.current as Element,
            lastValueRef,
            [
                ...extensions || [],
                readOnlyCompartment.current.of(EditorView.editable.of(Boolean(onChangeRef.current))),
            ],
            onChangeRef,
        )
    }, [containerRef, lastValueRef, extensions, onChangeRef])

    React.useLayoutEffect(() => {
        if(!editor) {
            return
        }
        containerRef.current?.append(editor.dom)
        return () => {
            editor?.destroy()
        }
    }, [containerRef, editor])

    // re-execution protection for no-effects with "splice"
    effects = effects?.length === 0 ? undefined : effects
    React.useLayoutEffect(() => {
        if(effects && effects.length > 0 && !editor) {
            console.error('received effects but editor is not ready', effects)
            return
        }
        if(!effects || !editor) return
        effects.forEach(effect => {
            effect(editor)
        })
    }, [effects, editor])

    React.useEffect(() => {
        if(!editor) {
            return
        }
        editor.dispatch({
            effects: readOnlyCompartment.current.reconfigure(EditorView.editable.of(Boolean(onChange))),
        })
    }, [editor, onChange])

    React.useLayoutEffect(() => {
        // changing whole doc when value changed - and change was not the last one from within CodeMirror
        if(editor && containerRef.current && lastValueRef.current !== value) {
            if(lastValueRef.current === value) {
                // be sure that it still isn't the same value to not unnecessarily dispatch a re-draw
                return
            }
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
    }, [containerRef, value, editor, onExternalChange])

    return editor
}
