import React from 'react'
import Container from '@mui/material/Container'
import { Nav } from '../components/Nav'

export const PageHome: React.ComponentType = () => {
    return <>
        <Container maxWidth={'md'} fixed>
            <Nav/>
        </Container>
    </>
}
