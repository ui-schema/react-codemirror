import React from 'react'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { customTheme } from './theme'
import { Layout } from './components/Layout'
import { BrowserRouter } from 'react-router-dom'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import CircularProgress from '@mui/material/CircularProgress'
import { browserT } from './t'
import { customBinding } from './components/UISchema'
import { Validator } from '@ui-schema/json-schema/Validator'
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { requiredValidatorLegacy } from '@ui-schema/json-schema/Validators/RequiredValidatorLegacy'

const validator = Validator([
    ...standardValidators,
    requiredValidatorLegacy, // opinionated validator, HTML-like, empty-string = invalid
])
const validate = validator.validate

const customThemes = customTheme('#05aeca')

export const App: React.ComponentType<{}> = () => {
    const [themeId, setThemeId] = React.useState<'dark' | 'light'>('dark')

    const [theme, setTheme] = React.useState(customThemes[themeId])
    React.useEffect(() => {
        setTheme({...customThemes[themeId]})
    }, [setTheme, themeId])

    return <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <CssBaseline/>

            <BrowserRouter>
                <React.Suspense fallback={<CircularProgress/>}>
                    <UIMetaProvider
                        t={browserT}
                        binding={customBinding}
                        validate={validate}
                    >
                        <Layout setTheme={setThemeId}/>
                    </UIMetaProvider>
                </React.Suspense>
            </BrowserRouter>
        </ThemeProvider>
    </StyledEngineProvider>
}
