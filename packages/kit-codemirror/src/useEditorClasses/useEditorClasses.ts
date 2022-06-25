import React from 'react'
import { EditorView } from '@codemirror/view'
import { Compartment } from '@codemirror/state'

export const useEditorClasses = (
    compartment: Compartment,
    editor: EditorView | undefined,
    classNamesContent?: string[],
) => {
    React.useEffect(() => {
        if(!editor || !classNamesContent || classNamesContent.length === 0) return
        editor.dispatch({
            effects: compartment.reconfigure(EditorView.editorAttributes.of({class: classNamesContent.join(' ')})),
        })
        // todo: optimize this, so it will only remove classes,
        //       which are no longer wanted and adds only classes which are not already existing
        return () => editor.dispatch({
            effects: compartment.reconfigure(EditorView.editorAttributes.of({class: ''})),
        })
    }, [compartment, editor, classNamesContent])
}
