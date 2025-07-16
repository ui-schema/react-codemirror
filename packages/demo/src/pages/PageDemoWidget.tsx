import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Nav } from '../components/Nav'
import { UIStoreProvider, createStore } from '@ui-schema/react/UIStore'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { onChangeHandler } from '@ui-schema/react'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { OrderedMap } from 'immutable'
import { GridContainer } from '@ui-schema/ds-material/GridContainer'
import Link from '@mui/material/Link'
import { SchemaDebug } from '../components/SchemaDebug'

export const PageDemoWidget: React.ComponentType = () => {
    return <>
        <Container maxWidth={'md'} fixed style={{display: 'flex'}}>
            <Nav/>
            <Box mx={2} py={1} style={{flexGrow: 1}}>
                <Box mb={2}>
                    <Typography variant={'h1'} gutterBottom>UI-Schema Widgets</Typography>
                    <Typography variant={'body1'}>UI-Schema widgets with support for one language per field.</Typography>
                    <Typography variant={'body1'}>
                        <Link
                            href={'https://github.com/ui-schema/react-codemirror/blob/main/packages/demo/src/pages/PageDemoWidget.tsx'}
                            target={'_blank'} rel={'noopener noreferrer'}
                        >source page</Link>
                        {', '}
                        <Link
                            href={'https://github.com/ui-schema/react-codemirror/blob/main/packages/demo/src/components/UISchema.tsx'}
                            target={'_blank'} rel={'noopener noreferrer'}
                        >ui-schema setup</Link>
                    </Typography>
                </Box>
                <DemoComponent/>
            </Box>
        </Container>
    </>
}

const schema = createOrderedMap({
    type: 'object',
    properties: {
        plain: {
            type: 'string',
            widget: 'Code',
        },
        css_code: {
            type: 'string',
            widget: 'Code',
            format: 'css',
            title: 'CSS',
        },
        json_code: {
            type: 'string',
            widget: 'Code',
            format: 'json',
            title: 'JSON',
        },
        json_dense: {
            type: 'string',
            widget: 'Code',
            format: 'json',
            title: 'JSON [view dense]',
            view: {
                dense: true,
            },
        },
        no_title: {
            type: 'string',
            widget: 'Code',
            format: 'css',
            maxLength: 25,
            default: '.h1 {\n    font-size: 1rem;\n    font-weight: 700;\n    border-bottom: 1px solid #fefefe;\n}\n\n.h2 {\n    font-size: 1rem;\n    font-weight: 700;\n    border-bottom: 1px solid #fefefe;\n}\n\n.h3 {\n    font-size: 1rem;\n    font-weight: 700;\n    border-bottom: 1px solid #fefefe;\n}',
            view: {
                hideTitle: true,
            },
        },
        css_readonly: {
            type: 'string',
            widget: 'Code',
            format: 'css',
            readOnly: true,
        },
    },
})

const DemoComponent = () => {
    const showValidity = true
    const [store, setStore] = React.useState(() => createStore(OrderedMap({
        css_readonly: '.h1 {\n    font-size: 1rem;\n    font-weight: 700;\n    border-bottom: 1px solid #fefefe;\n}',
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
            <GridContainer>
                <WidgetEngine
                    schema={schema}
                    isRoot
                />
            </GridContainer>
            <Box mt={2}>
                <Typography variant={'subtitle1'} gutterBottom>Store & Schema Debug</Typography>
                <SchemaDebug schema={schema}/>
            </Box>
        </UIStoreProvider>
    </React.Fragment>
}
