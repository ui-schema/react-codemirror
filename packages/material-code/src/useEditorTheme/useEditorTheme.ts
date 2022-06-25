import React from 'react'
import { EditorView } from '@codemirror/view'
import { Extension } from '@codemirror/state'
import useTheme from '@mui/material/styles/useTheme'

export const useEditorTheme = (readOnly?: boolean): Extension => {
    const {palette, shape, components} = useTheme()
    const variant = components?.MuiTextField?.defaultProps?.variant || 'standard'
    // @ts-ignore
    const styleBorderRadius = components?.MuiOutlinedInput?.styleOverrides?.root?.borderRadius
    const borderRadiusTmp = typeof styleBorderRadius !== 'undefined' ? styleBorderRadius : shape.borderRadius
    const borderRadius = variant === 'standard' ? typeof borderRadiusTmp === 'number' ? borderRadiusTmp + 'px' : borderRadiusTmp : 0
    return React.useMemo(
        () =>
            EditorView.theme(
                {
                    '&': {
                        color: palette.text.primary,
                        backgroundColor: palette.background.paper,
                    },
                    '&.cm-editor': {
                        outline: '1px solid ' + (variant === 'standard' ? palette.divider : 'transparent'),
                        borderRadius: borderRadius,
                    },
                    ...(variant !== 'standard' || readOnly ? {} : {
                        '&.cm-editor:hover': {
                            outline: '1px solid ' + palette.text.primary,
                        },
                    }),
                    ...(variant !== 'standard' ? {} : {
                        // `invalid` is a custom class used by `WidgetCode` when not valid to schema
                        '&.cm-editor.invalid': {
                            outline: '1px solid ' + palette.error.main,
                        },
                        '&.cm-editor.cm-focused': {
                            outline: '2px solid ' + palette.primary.main,
                        },
                        // `invalid` is a custom class used by `WidgetCode` when not valid to schema
                        '&.cm-editor.cm-focused.invalid': {
                            outline: '2px solid ' + palette.error.main,
                        },
                    }),
                    '& .cm-content': {
                        caretColor: palette.text.primary,
                    },
                    '&.cm-focused .cm-cursor': {
                        borderLeftColor: palette.text.primary,
                        // borderLeftColor: palette.primary.main,
                    },
                    '&.cm-editor.cm-focused .cm-activeLine': {
                        backgroundColor: palette.divider,
                    },
                    '&.cm-editor .cm-activeLine': {
                        backgroundColor: 'transparent',
                    },
                    '&.cm-editor.cm-focused .cm-gutterElement.cm-activeLineGutter': {
                        backgroundColor: palette.divider,
                    },
                    '& .cm-gutterElement.cm-activeLineGutter': {
                        backgroundColor: 'transparent',
                    },
                    '&.cm-focused .cm-selectionBackground, ::selection': {
                        backgroundColor: palette.divider,
                    },
                    '& .cm-gutters': {
                        backgroundColor: palette.background.default,
                        color: palette.text.secondary,
                        border: 'none',
                        borderTopLeftRadius: borderRadius,
                        borderBottomLeftRadius: borderRadius,
                    },
                    '& .cm-gutters .cm-lineNumbers .cm-gutterElement': {
                        paddingLeft: '8px',
                    },
                },
                {dark: palette.mode === 'dark'},
            ),
        [palette, readOnly, borderRadius, variant],
    )
}
