import React from 'react'
import { tags } from '@lezer/highlight'
import { HighlightStyle } from '@codemirror/language'
import useTheme from '@mui/material/styles/useTheme'

export const useHighlightStyle = (): HighlightStyle => {
    const {palette} = useTheme()
    return React.useMemo(() => HighlightStyle.define([
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
            tag: tags.meta,
            color: palette.mode === 'dark' ? '#43978b' : '#2a719b',
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
            color: palette.mode === 'dark' ? '#f746ec' : '#8e0b99',
        },
        {
            tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName],
            color: palette.mode === 'dark' ? '#978ed3' : '#121cb1',
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
        },
        {
            tag: [tags.bracket],
            color: palette.mode === 'dark' ? '#4b88d7' : '#0d64d5',
        },
        {
            tag: [tags.string],
            color: palette.mode === 'dark' ? '#83ca69' : '#08822c',
        },
        {
            tag: [tags.regexp, tags.escape, tags.special(tags.string)],
            color: '#ee4400',
        },
        {
            tag: tags.definition(tags.variableName),
            color: palette.mode === 'dark' ? '#5279ec' : '#255fb9',
        },
        {
            tag: tags.local(tags.variableName),
            color: '#3300aa',
        },
        {
            tag: [tags.typeName, tags.namespace],
            color: palette.mode === 'dark' ? '#ec4837' : '#b7382b',
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
            color: palette.mode === 'dark' ? '#738284' : '#6b7677',
        },
        {
            tag: tags.invalid,
            color: '#ff0000',
        },
    ]), [palette])
}
