import * as React from 'react'
import { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import Box from '@mui/material/Box'

export interface CodeBarProps {
    schema: SomeSchema
    barBegin?: React.ReactElement
    barContent?: React.ReactElement
    barEnd?: React.ReactElement
}

export interface CodeBarPropsFull extends CodeBarProps {
    style?: React.CSSProperties
    spacingTop?: number
}

export const CodeBar: React.FC<CodeBarPropsFull> = (
    {
        barBegin,
        barContent,
        barEnd,
        style,
        spacingTop = 0.5,
    },
) => {
    return barBegin || barContent || barEnd ?
        <Box
            mt={spacingTop}
            style={{
                ...(style || {}),
                display: 'flex',
                alignItems: 'center',
                overflow: 'auto',
            }}
        >
            {barBegin || null}

            {barContent ?
                <Box
                    ml={barBegin && barContent ? 1 : 0}
                    mr={barEnd && barContent ? 1 : 0}
                    style={{overflow: 'auto'}}
                >
                    {barContent || null}
                </Box> : null}

            {barEnd || null}
        </Box> : null
}
