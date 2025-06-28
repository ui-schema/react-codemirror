import { Compartment, Extension, StateEffect } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'

export const useExtension = (
    setupExtension: () => Extension,
    editorRef: RefObject<EditorView | null>,
) => {
    const configuredRef = useRef<{ view: EditorView, cb: Function } | null>(null)
    const compartmentRef = useRef<Compartment>(new Compartment())

    useLayoutEffect(() => {
        if(
            configuredRef.current
            && configuredRef.current.cb === setupExtension
            && configuredRef.current.view === editorRef.current
        ) {
            return
        }
        const compartment = compartmentRef.current

        if(editorRef.current) {
            const isInitialSetup = configuredRef.current?.view !== editorRef.current
            // exists, reconfigure
            // new, append to config

            editorRef.current.dispatch({
                effects: isInitialSetup
                    ? StateEffect.appendConfig.of(compartment.of(setupExtension()))
                    : compartment.reconfigure(setupExtension()),
            })
            configuredRef.current = {view: editorRef.current, cb: setupExtension}
        } else {
            configuredRef.current = null
        }
    }, [editorRef, setupExtension])

    return {
        compartment: compartmentRef.current,
    }
}
