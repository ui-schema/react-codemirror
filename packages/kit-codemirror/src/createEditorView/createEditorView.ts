import React from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState, Extension } from '@codemirror/state'
import { CodeMirrorOnChange, CodeMirrorOnExternalChange } from '@ui-schema/kit-codemirror/useCodeMirror'

export const replaceWholeDoc: CodeMirrorOnExternalChange = (editor, nextValue) => {
    editor?.dispatch({
        changes: {
            from: 0,
            to: editor.state.doc.length,
            insert: nextValue,
        },
    })
}

export const createEditorView = (
    parent: Element,
    lastValueRef: React.MutableRefObject<string>,
    extensions?: Extension[],
    onChangeRef?: React.MutableRefObject<CodeMirrorOnChange | undefined>,
) => {
    return new EditorView({
        state: EditorState.create({
            extensions: [
                ...(extensions || []),
                EditorView.updateListener.of((viewUpdate) => {
                    // todo: why is `view.destroyed` not typed?
                    // @ts-ignore
                    if(viewUpdate.view.destroyed) return
                    let texts: [undefined, undefined] | [string, string] = [undefined, undefined]
                    if(viewUpdate.docChanged) {
                        const next = viewUpdate.state.doc.toString()
                        const prev = lastValueRef.current
                        lastValueRef.current = next
                        texts = [next, prev]
                    }
                    const onChange = onChangeRef?.current
                    if(!onChange) {
                        return
                    }
                    onChange(viewUpdate, texts[0], texts[1])
                }),
            ],
            doc: lastValueRef.current,
        }),
        parent: parent,
    })
}
