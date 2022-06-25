import { useUIStore } from '@ui-schema/ui-schema/UIStore'
import React from 'react'
import { List } from 'immutable'
import { StoreSchemaType, useUIStoreActions } from '@ui-schema/ui-schema'
import useTheme from '@mui/material/styles/useTheme'
import { ImmutableEditor, themeMaterial } from 'react-immutable-editor'
import Paper from '@mui/material/Paper'

const StyledEditor: React.FC<{
    data: any
    onChange: any
    getVal: any
}> = p => {
    const theme = useTheme()
    return <Paper
        square
        variant={'outlined'}
        style={{
            margin: theme.spacing(2) + ' ' + theme.spacing(1),
            padding: '0 ' + theme.spacing(1),
        }}
        elevation={0}>

        <ImmutableEditor
            {...p}
            theme={{
                ...themeMaterial,
                type: theme.palette.mode,
                base00: theme.palette.background.paper,
                base0D: theme.palette.text.secondary,
                base0B: theme.palette.text.primary,
            }}
        />
    </Paper>
}

export const SchemaDebug: React.FC<{ schema: StoreSchemaType }> = ({schema}) => {
    const {store} = useUIStore()
    const {onChange} = useUIStoreActions()

    return <React.Fragment>
        <React.Fragment>
            <StyledEditor
                data={store?.getValues()}
                onChange={(keys, value) => {
                    onChange({
                        storeKeys: List(keys),
                        scopes: ['value'],
                        type: 'update',
                        updater: () => ({value: value}),
                        required: false,
                    })
                }}
                getVal={keys => store?.getValues().getIn(keys)}
            />
            <StyledEditor data={schema} onChange={() => console.log('not implemented')} getVal={keys => schema.getIn(keys)}/>
        </React.Fragment>
    </React.Fragment>
}
