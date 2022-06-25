import React from 'react'
import { EditorView, ViewUpdate } from '@codemirror/view'
import { Compartment, EditorState, Extension } from '@codemirror/state'

export type CodeMirrorOnChange = (editor: ViewUpdate, nextValue: string, prevValue: string) => void

export const useCodeMirror = (
    containerRef: React.MutableRefObject<HTMLDivElement | null>,
    onChange?: CodeMirrorOnChange,
    value: string = '',
    extensions?: Extension[],
): [EditorView | undefined, React.Dispatch<React.SetStateAction<EditorView | undefined>>] => {
    const lastValueRef = React.useRef<string>(value)
    const onChangeRef = React.useRef<CodeMirrorOnChange | undefined>(undefined)
    const [editor, setEditorView] = React.useState<EditorView | undefined>(undefined)
    const readOnlyCompartment = React.useRef<Compartment>(new Compartment())

    // as onChange relies on the mounting state, this can't be solved with a "normal Compartment style" extension,
    // these ref hacks should be the safest/fastest option
    onChangeRef.current = React.useMemo(() => onChange, [onChange])

    React.useEffect(() => {
        const instanceMounted = {
            current: 0,// tripple state, 0 = pre-init, 1 = ready, 2 = destroyed
        }
        const editorViewInternal = new EditorView({
            state: EditorState.create({
                extensions: [
                    ...(extensions || []),
                    EditorView.updateListener.of((viewUpdate) => {
                        if(instanceMounted.current === 0) {
                            // "just mounted" / editor-is-active hack
                            instanceMounted.current = 1
                            return
                        }
                        if(instanceMounted.current !== 1) {
                            // noop
                            return
                        }
                        const next = viewUpdate.state.doc.toString()
                        // todo: decide which position (before or after `onChange`) is safe against
                        //       detached component-state because of parent-state-changes in `onChange`
                        const prev = lastValueRef.current
                        lastValueRef.current = next
                        const onChange = onChangeRef.current
                        if(
                            !onChange ||
                            // todo: why is `view.destroyed` not typed?
                            // @ts-ignore
                            viewUpdate.view.destroyed
                        ) {
                            return
                        }
                        onChange(viewUpdate, next, prev)
                    }),
                    readOnlyCompartment.current.of(EditorView.editable.of(Boolean(onChangeRef.current))),
                ],
                doc: lastValueRef.current,
            }),
            // @ts-ignore
            parent: containerRef.current,
        })
        setEditorView(editorViewInternal)
        return () => {
            instanceMounted.current = 2
            editorViewInternal?.destroy()
            setEditorView(undefined)
        }
    }, [
        containerRef, lastValueRef, setEditorView,
        extensions, onChangeRef,
    ])

    React.useEffect(() => {
        if(!editor) {
            return
        }
        editor.dispatch({
            effects: readOnlyCompartment.current.reconfigure(EditorView.editable.of(Boolean(onChange))),
        })
    }, [editor, onChange])

    React.useEffect(() => {
        // changing whole doc when value changed - and change was not the last one from within CodeMirror
        if(containerRef.current && lastValueRef.current !== value) {
            setEditorView(editor => {
                if(lastValueRef.current === value) {
                    // be sure that it still isn't the same value to not unnecessarily dispatch a re-draw
                    return editor
                }
                editor?.dispatch({
                    changes: {
                        from: 0,
                        to: editor?.state.doc.length,
                        insert: value,
                    },
                })
                lastValueRef.current = value
                return editor
            })
        } else {
            lastValueRef.current = value
        }
    }, [containerRef, value, setEditorView])

    return [editor, setEditorView]
}
