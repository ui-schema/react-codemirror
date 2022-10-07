import { useUIStore } from '@ui-schema/ui-schema/UIStore'
import React from 'react'
import { StoreSchemaType } from '@ui-schema/ui-schema'
import { CustomCodeMirror } from './CustomCodeMirror'
import { json } from '@codemirror/lang-json'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export const SchemaDebug: React.FC<{ schema: StoreSchemaType }> = ({schema}) => {
    const {store} = useUIStore()
    const extensions = React.useMemo(() => [
        json(),
    ], [])

    return <React.Fragment>
        <Box mt={1} mb={2}>
            <Typography variant={'caption'} component={'p'} color={'secondary'} gutterBottom>Store Values</Typography>
            <CustomCodeMirror
                value={JSON.stringify(store?.valuesToJS(), undefined, 4)}
                extensions={extensions}
            />
        </Box>
        <Box mb={2}>
            <Typography variant={'caption'} component={'p'} color={'secondary'} gutterBottom>Schema</Typography>
            <CustomCodeMirror
                value={JSON.stringify(schema?.toJS(), undefined, 4)}
                extensions={extensions}
            />
        </Box>
    </React.Fragment>
}
