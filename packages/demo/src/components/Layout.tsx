import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { PageHome } from '../pages/PageHome'
import { PageDemoWidget } from '../pages/PageDemoWidget'
import { PageDemoLangSelectable } from '../pages/PageDemoLangSelectable'
import { PageDemoComponent } from '../pages/PageDemoComponent'

export const Layout: React.ComponentType<{}> = () => {
    const scrollWrapper = React.useRef<HTMLDivElement | null>(null)

    return <div
        ref={scrollWrapper}
        style={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '100%',
            position: 'relative',
            color: '#ffffff',
            overflow: 'auto',
            padding: '0 12px',
        }}
    >
        <Routes>
            <Route path={'/'} element={<PageHome/>}/>
            <Route path={'/component'} element={<PageDemoComponent/>}/>
            <Route path={'/widget'} element={<PageDemoWidget/>}/>
            <Route path={'/selectable'} element={<PageDemoLangSelectable/>}/>
        </Routes>
    </div>
}
