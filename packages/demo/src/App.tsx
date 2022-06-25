import React from 'react'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { customTheme } from './theme'
import { Layout } from './components/Layout'
import { BrowserRouter } from 'react-router-dom'
import { UIMetaProvider } from '@ui-schema/ui-schema/UIMeta'
import CircularProgress from '@mui/material/CircularProgress'
import { browserT } from './t'
import { customWidgets } from './components/UISchema'

const customThemes = customTheme('#05aeca')

export const App: React.ComponentType<{}> = () => {
    const [themeId] = React.useState<'dark' | 'light'>('dark')

    const [theme, setTheme] = React.useState(customThemes[themeId])
    React.useEffect(() => {
        setTheme({...customThemes[themeId]})
    }, [setTheme, themeId])

    return <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <CssBaseline/>

            <BrowserRouter>
                <React.Suspense fallback={<CircularProgress/>}>
                    <UIMetaProvider t={browserT} widgets={customWidgets}>
                        <Layout/>
                    </UIMetaProvider>
                </React.Suspense>
            </BrowserRouter>
        </ThemeProvider>
    </StyledEngineProvider>
}
