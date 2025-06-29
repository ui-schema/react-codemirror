import { Compartment, Extension, StateEffect } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'

type SetupExtension = (() => Extension) | Extension

export const useExtension = (
    setupExtension: SetupExtension,
    editorRef: RefObject<EditorView | null>,
) => {
    const configuredRef = useRef<{ view: EditorView, cb: SetupExtension } | null>(null)
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

            const extension = typeof setupExtension === 'function' ? setupExtension() : setupExtension

            editorRef.current.dispatch({
                effects: isInitialSetup
                    ? StateEffect.appendConfig.of(compartment.of(extension))
                    : compartment.reconfigure(extension),
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
