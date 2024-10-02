import React from 'react'
import { tags } from '@lezer/highlight'
import { HighlightStyle } from '@codemirror/language'
import { useTheme } from '@mui/material/styles'

export const useHighlightStyle = (
    {
        headlineUnderline = true,
    }: {
        headlineUnderline?: boolean
    } = {},
): HighlightStyle => {
    const {palette} = useTheme()
    return React.useMemo(() => HighlightStyle.define([
        {
            tag: tags.link,
            textDecoration: 'underline',
        },
        {
            tag: tags.heading,
            ...headlineUnderline ? {textDecoration: 'underline'} : {},
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
            tag: [tags.atom, tags.bool, tags.null, tags.url, tags.contentSeparator, tags.labelName],
            color: palette.mode === 'dark' ? '#978ed3' : '#121cb1',
        },
        {
            tag: [tags.literal], // numbers in json+yaml
            color: palette.mode === 'dark' ? '#2da273' : '#116644',
        },
        {
            tag: [tags.inserted],
            color: palette.mode === 'dark' ? '#1a9544' : '#068248',
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
            tag: [
                tags.definition(tags.variableName),
                // e.g. sass-vars
                tags.special(tags.variableName),
                tags.variableName,
                tags.attributeName,
            ],
            color: palette.mode === 'dark' ? '#5279ec' : '#255fb9',
        },
        {
            tag: tags.local(tags.variableName),
            color: palette.mode === 'dark' ? '#8e6bdf' : '#6b38e1',
        },
        {
            tag: [tags.typeName, tags.namespace],
            color: palette.mode === 'dark' ? '#ec4837' : '#b7382b',
        },
        {
            tag: tags.className,
            color: palette.mode === 'dark' ? '#3c8b9b' : '#116677',
        },
        {
            tag: [tags.macroName],
            color: '#225566',
        },
        {
            tag: tags.definition(tags.propertyName),
            color: palette.mode === 'dark' ? '#2981df' : '#0000cc',
        },
        {
            tag: tags.comment,
            color: palette.mode === 'dark' ? '#738284' : '#6b7677',
        },
        {
            tag: tags.invalid,
            color: palette.error.main,
        },
    ]), [headlineUnderline, palette.mode, palette.text.secondary, palette.error.main])
}
