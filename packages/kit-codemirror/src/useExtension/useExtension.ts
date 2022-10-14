import { Compartment, Extension } from '@codemirror/state'
import React from 'react'
import { EditorView } from '@codemirror/view'

export const useExtension = (ext: () => Extension, deps?: any[]) => {
    const compartment = React.useRef<Compartment>(new Compartment())
    const hasInit = React.useRef<boolean>(false)
    const extRef = React.useRef<() => Extension>(ext)
    extRef.current = ext

    const init = React.useCallback((): Extension => {
        hasInit.current = true
        return compartment.current.of(extRef.current())
    }, [])

    const effects: ((editor: EditorView) => void)[] | undefined = React.useMemo(() => {
        if(!hasInit.current) return undefined
        return [
            function updateExtension(editor) {
                editor.dispatch({
                    effects: compartment.current.reconfigure(extRef.current()),
                })
            },
        ]
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps || [])

    return {
        init: init,
        effects: effects,
    }
}
