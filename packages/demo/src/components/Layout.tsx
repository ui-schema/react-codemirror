import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { PageHome } from '../pages/PageHome'
import { PageDemoWidget } from '../pages/PageDemoWidget'
import { PageDemoLangSelectable } from '../pages/PageDemoLangSelectable'
import { PageDemoComponent } from '../pages/PageDemoComponent'
import { Button } from '@mui/material'
import { PageDemoComponentMui } from '../pages/PageDemoComponentMui'

export const Layout: React.ComponentType<{ setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>> }> = ({setTheme}) => {
    const scrollWrapper = React.useRef<HTMLDivElement | null>(null)

    return <div
        ref={scrollWrapper}
        style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            maxHeight: '100%',
            position: 'relative',
            overflow: 'auto',
            padding: '0 12px',
        }}
    >
        <Routes>
            <Route path={'/'} element={<PageHome/>}/>
            <Route path={'/component'} element={<PageDemoComponent/>}/>
            <Route path={'/component-mui'} element={<PageDemoComponentMui/>}/>
            <Route path={'/widget'} element={<PageDemoWidget/>}/>
            <Route path={'/selectable'} element={<PageDemoLangSelectable/>}/>
        </Routes>
        <Button size={'small'} onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
            switch theme
        </Button>
    </div>
}
