import React from 'react'
import { EditorView } from '@codemirror/view'
import { Extension } from '@codemirror/state'
import useTheme from '@mui/material/styles/useTheme'
import { TextFieldProps } from '@mui/material'

export interface EditorThemeCustomStyles {
    // for all standard texts
    textColor?: React.CSSProperties['color']
    // for headlines, with fallback to `textColor`
    headlineColor?: React.CSSProperties['color']
    backgroundColor?: React.CSSProperties['backgroundColor']
    lineHeight?: React.CSSProperties['lineHeight']
    lineHeightDense?: React.CSSProperties['lineHeight']
    selectionMatch: React.CSSProperties['backgroundColor']
    activeLineGutter: React.CSSProperties['backgroundColor']
    activeLine: React.CSSProperties['backgroundColor']
    activeSelection: React.CSSProperties['backgroundColor']
    // defaults to `100%`, set no width at all with `null`
    width: React.CSSProperties['width'] | null
}

export const useEditorTheme = (
    readOnly?: boolean,
    dense?: boolean,
    customVariant?: TextFieldProps['variant'] | 'embed',
    // overwrite some colors & styles easily, must be memoized to not force reapplying theme on each render
    customStyles?: EditorThemeCustomStyles,
): Extension => {
    const {palette, spacing, shape, components} = useTheme()
    const variant = customVariant || components?.MuiTextField?.defaultProps?.variant || 'standard'
    // @ts-ignore
    const styleBorderRadius = components?.MuiOutlinedInput?.styleOverrides?.root?.borderRadius
    const borderRadiusTmp = typeof styleBorderRadius !== 'undefined' ? styleBorderRadius : shape.borderRadius
    const borderRadius = variant === 'standard' ? typeof borderRadiusTmp === 'number' ? borderRadiusTmp + 'px' : borderRadiusTmp : 0

    const styleMap = React.useMemo(
        () => ({
            textColor: customStyles?.textColor || palette.text.primary,
            headlineColor: customStyles?.headlineColor || customStyles?.textColor || palette.text.primary,
            backgroundColor: customStyles?.backgroundColor || palette.background.paper,
            lineHeight: dense ? customStyles?.lineHeightDense || '1.3em' : customStyles?.lineHeight || '1.43125em',
            linePadding: dense ? '0 2px 0 4px' : '0px 3px 0px 4px',
            contentPadding: dense ? 0 : spacing(0.5) + ' 0',
            borderDefault: palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
            borderFocused: palette.primary.main,
            borderInvalid: palette.error.main,
            selectionMatch: customStyles?.selectionMatch || '#ae38a782',
            activeLineGutter: customStyles?.activeLineGutter || palette.divider,
            activeLine: customStyles?.activeLine || palette.divider,
            activeSelection: customStyles?.activeSelection || (palette.mode === 'light' ? palette.info.light : palette.info.dark),
            width: customStyles?.width === null ? null : typeof customStyles?.width === 'undefined' ? '100%' : customStyles?.width,
        }),
        [customStyles, dense, palette, spacing],
    )
    return React.useMemo(
        () =>
            EditorView.theme(
                {
                    '&': {
                        color: styleMap.textColor,
                        backgroundColor: styleMap.backgroundColor,
                        ...(typeof styleMap.width === 'undefined' || styleMap.width === null ? {} : {
                            width: styleMap.width,
                        }),
                    },
                    '&.cm-editor': {
                        outline: '1px solid ' + (
                            variant === 'standard' ?
                                styleMap.borderDefault :
                                'transparent'
                        ),
                        borderRadius: borderRadius,
                    },
                    ...(variant !== 'standard' || readOnly ? {} : {
                        '&.cm-editor:hover': {
                            outline: '1px solid ' + styleMap.textColor,
                        },
                    }),
                    ...(variant === 'standard' ?
                        {
                            // `invalid` is a custom class used by `WidgetCode` when not valid to schema
                            '&.cm-editor.invalid': {
                                outline: '1px solid ' + styleMap.borderInvalid,
                            },
                            '&.cm-editor.cm-focused': {
                                outline: '2px solid ' + styleMap.borderFocused,
                            },
                            // `invalid` is a custom class used by `WidgetCode` when not valid to schema
                            '&.cm-editor.cm-focused.invalid': {
                                outline: '2px solid ' + styleMap.borderInvalid,
                            },
                        } :
                        variant === 'embed' ?
                            {
                                '&.cm-editor.invalid': {
                                    outline: '1px solid ' + styleMap.borderInvalid,
                                },
                                '&.cm-editor.cm-focused': {
                                    outline: 0,
                                },
                                // `invalid` is a custom class used by `WidgetCode` when not valid to schema
                                '&.cm-editor.cm-focused.invalid': {
                                    outline: '2px solid ' + styleMap.borderInvalid,
                                },
                            } : {}),
                    '& .cm-content': {
                        caretColor: styleMap.textColor,
                        padding: styleMap.contentPadding,
                        lineHeight: styleMap.lineHeight,
                    },
                    '& .cm-scroller': {
                        lineHeight: styleMap.lineHeight,
                    },
                    '&.cm-focused .cm-cursor': {
                        borderLeftColor: styleMap.textColor,
                    },
                    '&.cm-editor .cm-line': {
                        padding: styleMap.linePadding,
                    },
                    '&.cm-editor.cm-focused .cm-activeLine': {
                        backgroundColor: styleMap.activeLine,
                    },
                    '&.cm-editor .cm-activeLine': {
                        backgroundColor: 'transparent',
                    },
                    '&.cm-editor .cm-selectionMatch': {
                        backgroundColor: styleMap.selectionMatch,
                    },
                    '&.cm-editor.cm-focused .cm-gutterElement.cm-activeLineGutter': {
                        backgroundColor: styleMap.activeLineGutter,
                    },
                    '& .cm-gutterElement.cm-activeLineGutter': {
                        backgroundColor: 'transparent',
                    },
                    '&.cm-focused .cm-selectionBackground, ::selection': {
                        backgroundColor: styleMap.activeSelection,
                    },
                    '& .cm-gutters': {
                        backgroundColor: palette.background.default,
                        color: palette.text.secondary,
                        border: 'none',
                        borderTopLeftRadius: borderRadius,
                        borderBottomLeftRadius: borderRadius,
                    },
                    '& .cm-gutters .cm-lineNumbers .cm-gutterElement': {
                        paddingLeft: spacing(1),
                    },
                    '&.cm-editor .cm-foldPlaceholder': {
                        padding: '0 ' + spacing(0.5),
                        backgroundColor: palette.mode === 'light' ? palette.background.default : palette.background.paper,
                        borderColor: palette.divider,
                        color: palette.primary.main,
                    },
                },
                {dark: palette.mode === 'dark'},
            ),
        [palette, spacing, readOnly, styleMap, borderRadius, variant],
    )
}
