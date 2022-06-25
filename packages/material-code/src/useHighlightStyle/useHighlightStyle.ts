import React from 'react'
import { tags } from '@lezer/highlight'
import { HighlightStyle } from '@codemirror/language'
import useTheme from '@mui/material/styles/useTheme'

export const useHighlightStyle = (): HighlightStyle => {
    const {palette} = useTheme()
    return React.useMemo(() => HighlightStyle.define([
        {
            tag: tags.meta,
            color: '#7a757a',
        },
        {
            tag: tags.link,
            textDecoration: 'underline',
        },
        {
            tag: tags.heading,
            textDecoration: 'underline',
            fontWeight: 'bold',
        },
        {
            tag: tags.emphasis,
            fontStyle: 'italic',
        },
        {
            tag: tags.strong,
            fontWeight: 'bold',
        },
        {
            tag: tags.strikethrough,
            textDecoration: 'line-through',
        },
        {
            tag: tags.keyword,
            color: '#770088',
        },
        {
            tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName],
            color: palette.mode === 'dark' ? '#7f72d7' : '#221199',
        },
        {
            tag: [tags.literal, tags.inserted],
            color: palette.mode === 'dark' ? '#2da273' : '#116644',
        },
        {
            tag: [tags.deleted],
            color: palette.mode === 'dark' ? '#d22c2c' : '#aa1111',
        },
        {
            tag: [tags.brace],
            color: palette.text.secondary,
            // color: palette.mode === 'dark' ? '#ea66b1' : '#b02c77',
        },
        {
            tag: [tags.bracket],
            color: palette.text.secondary,
            // color: palette.mode === 'dark' ? '#ea66b1' : '#b02c77',
        },
        {
            tag: [tags.string],
            color: palette.mode === 'dark' ? '#ea66b1' : '#b02c77',
        },
        {
            tag: [tags.regexp, tags.escape, tags.special(tags.string)],
            color: '#ee4400',
        },
        {
            tag: tags.definition(tags.variableName),
            color: '#0000ff',
        },
        {
            tag: tags.local(tags.variableName),
            color: '#3300aa',
        },
        {
            tag: [tags.typeName, tags.namespace],
            color: '#008855',
        },
        {
            tag: tags.className,
            color: '#116677',
        },
        {
            tag: [tags.special(tags.variableName), tags.macroName],
            color: '#225566',
        },
        {
            tag: tags.definition(tags.propertyName),
            color: '#0000cc',
        },
        {
            tag: tags.comment,
            color: '#994400',
        },
        {
            tag: tags.invalid,
            color: '#ff0000',
        },
    ]), [palette])
}
