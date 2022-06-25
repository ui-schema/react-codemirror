import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Nav } from '../components/Nav'
import Link from '@mui/material/Link'
import { createOrderedMap, createStore, injectPluginStack, JsonSchema, onChangeHandler, storeUpdater, UIStoreProvider } from '@ui-schema/ui-schema'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import { OrderedMap } from 'immutable'
import { SchemaDebug } from '../components/SchemaDebug'

export const PageDemoLangSelectable: React.ComponentType = () => {
    return <>
        <Container maxWidth={'md'} fixed style={{display: 'flex'}}>
            <Nav/>

            <Box mx={2} py={1} style={{flexGrow: 1}}>
                <Box mb={2}>
                    <Typography variant={'h1'} gutterBottom>UI-Schema Widgets Selectable</Typography>
                    <Typography variant={'body1'}>UI-Schema widgets with support to select the language.</Typography>
                    <Typography variant={'body1'}>
                        <Link
                            href={'https://github.com/ui-schema/react-codemirror/blob/main/packages/demo/src/pages/PageDemoLangSelectable.tsx'}
                            target={'_blank'} rel={'noopener noreferrer'}
                        >source page</Link>
                        {', '}
                        <Link
                            href={'https://github.com/ui-schema/react-codemirror/blob/main/packages/demo/src/components/UISchema.tsx'}
                            target={'_blank'} rel={'noopener noreferrer'}
                        >ui-schema setup</Link>
                    </Typography>
                </Box>
                <Box mb={2}>
                    <DemoComponent/>
                </Box>
            </Box>
        </Container>
    </>
}

const schema = createOrderedMap({
    type: 'object',
    properties: {
        as_array: {
            type: 'array',
            widget: 'CodeSelectable',
            format: ['css', 'json', 'javascript'],
            formatDefault: 'css',
        },
        as_object: {
            type: 'object',
            widget: 'CodeSelectable',
            format: ['css', 'json', 'javascript'],
            formatDefault: 'css',
        },
        readOnly: {
            type: 'object',
            widget: 'CodeSelectable',
            format: ['css', 'json', 'javascript'],
            formatDefault: 'css',
            readOnly: true,
        },
    },
} as JsonSchema)

const GridStack = injectPluginStack(GridContainer)
const DemoComponent = () => {
    const showValidity = true
    const [store, setStore] = React.useState(() => createStore(OrderedMap({
        readOnly: OrderedMap({code: '.h1 {\n    font-size: 1rem;\n    font-weight: 700;\n    border-bottom: 1px solid #fefefe;\n}'}),
    })))

    const onChange: onChangeHandler = React.useCallback(
        (actions) => setStore(storeUpdater(actions)),
        [setStore],
    )

    return <React.Fragment>
        <UIStoreProvider
            store={store}
            onChange={onChange}
            showValidity={showValidity}
        >
            <GridStack
                schema={schema}
                showValidity={showValidity}
                isRoot
            />
            <Box mt={2}>
                <Typography variant={'subtitle1'} gutterBottom>Store & Schema Debug</Typography>
                <SchemaDebug schema={schema}/>
            </Box>
        </UIStoreProvider>
    </React.Fragment>
}

