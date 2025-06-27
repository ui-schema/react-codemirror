import { EditorView } from '@codemirror/view'
import { EditorState, Extension, Transaction } from '@codemirror/state'
import { CodeMirrorOnChange, CodeMirrorOnExternalChange } from '@ui-schema/kit-codemirror/useCodeMirror'

/**
 * changes whole doc with new text
 */
export const replaceWholeDoc: CodeMirrorOnExternalChange = (editor, nextValue) => {
    editor?.dispatch({
        annotations: Transaction.remote.of(true),
        changes: {
            from: 0,
            to: editor.state.doc.length,
            insert: nextValue,
        },
    })
}

export const createEditorView = (
    lastValueRef: { current: string },
    extensions?: Extension[],
    onChangeRef?: { current: CodeMirrorOnChange | undefined },
    parent?: Element,
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
