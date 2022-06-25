import { getContrastRatio, createTheme, Theme } from '@mui/material/styles'

const headingFont = '"Playfair Display", Didot, Georgia, "Times New Roman", Times, serif'
const headingBody = 'Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif'
const universal = {
    palette: {
        contrastThreshold: 2,
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 543,
            md: 768,
            lg: 1180,
            xl: 1920,
        },
    },
    typography: {
        fontSize: 14,
        h1: {
            fontFamily: headingFont,
            fontSize: '2.45rem',
        },
        h2: {
            fontFamily: headingFont,
            fontSize: '2.115rem',
        },
        h3: {
            fontFamily: headingFont,
            fontSize: '1.95rem',
        },
        h4: {
            fontFamily: headingFont,
            fontSize: '1.75rem',
        },
        h5: {
            fontFamily: headingFont,
            fontSize: '1.615rem',
        },
        h6: {
            fontFamily: headingFont,
            fontSize: '1.25rem',
        },
        body1: {
            fontFamily: headingBody,
            fontSize: '1.0125rem',
            letterSpacing: '0.0195em',
        },
        body2: {
            fontFamily: headingBody,
            fontSize: '0.95rem',
            letterSpacing: '0.021em',
        },
        subtitle1: {
            fontFamily: headingFont,
            fontSize: '1.25rem',
        },
        subtitle2: {
            fontFamily: headingFont,
            fontSize: '1rem',
        },
    },
    /*shape: {
        borderRadius: 0,
    },*/
}

export const customTheme = (primary: string): {
    dark: Theme
    light: Theme
} => {
    const getContrastText = (background: string) => {
        const contrastText =
            getContrastRatio(background, '#c6c4c4') >= 2 ?
                getContrastRatio(background, '#c6c4c4') <= 3 ?
                    '#ffffff' : '#c6c4c4' :
                getContrastRatio(background, '#001f29') <= 3 ?
                    '#000000' : '#001f29'

        if(process.env.NODE_ENV !== 'production') {
            const contrast = getContrastRatio(background, contrastText)
            if(contrast < 3) {
                console.error(
                    [
                        `MUI: The contrast ratio of ${contrast}:1 for ${contrastText} on ${background}`,
                        'falls below the WCAG recommended absolute minimum contrast ratio of 3:1.',
                        'https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast',
                    ].join('\n'),
                )
            }
        }

        return contrastText
    }
    const themeDark = createTheme({
        ...universal,
        palette: {
            ...universal.palette,
            mode: 'dark',
            primary: {
                //light: '#43c0d5',
                main: primary,
                //dark: '#033944',
            },
            secondary: {
                light: '#adf3e8',
                main: '#4ee3d7',
                dark: '#266e62',
            },
            background: {
                paper: '#13181c',
                default: '#010203',
            },
            text: {
                primary: '#c6c4c4',
                secondary: '#acc9c5',
            },
            info: {
                main: '#1872b9',
            },
            error: {
                main: '#9d190f',
                //main: '#b71c10',
            },
            warning: {
                main: '#d54600',
            },
            action: {
                hoverOpacity: 0.2,
            },
            getContrastText: getContrastText,
        },
        components: {
            MuiPaper: {
                styleOverrides: {root: {backgroundImage: 'unset'}},
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        //variant: '#6431f7',
                        '&$focused': {
                            color: '#7649f6',
                        },
                        '&$error': {
                            color: '#b71c10',
                        },
                    },
                },
            },
        },
    })

    const themeLight = createTheme({
        ...universal,
        palette: {
            ...universal.palette,
            mode: 'light',
            primary: {
                main: primary,
                //dark: '#033944',
            },
            secondary: {
                light: '#adf3e8',
                main: '#4cecd6',
                dark: '#266e62',
            },
            background: {
                //paper: '#e8e8e8',
                paper: '#f7f7f7',
                //default: '#d2d2d2',
                //default: '#e3e3e3',
                default: '#ececec',
            },
            text: {
                primary: '#001f29',
                secondary: '#001820',
            },
            warning: {
                dark: '#cc4c00',
                main: '#f05a00',
            },
            info: {
                main: '#3593dd',
            },
            action: {
                hoverOpacity: 0.2,
            },
            getContrastText: getContrastText,
        },
    })

    return {
        dark: themeDark,
        light: themeLight,
    }
}
