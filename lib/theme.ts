import { createMuiTheme, responsiveFontSizes, ThemeOptions } from '@material-ui/core/styles';

const THEME: ThemeOptions = {
    typography: {
        fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        h1: {
            fontSize: '3rem',
        },
        h2: {
            fontSize: '3rem',
        },
        h3: {
            fontSize: '3rem',
        },
        h4: {
            fontSize: '2rem',
        },
        body1: {
            fontSize: '1.3rem',
        },
    },
    palette: {
        type: 'dark',
        primary: {
            main: '#0089ff',
        },
        background: {
            default: '#101010',
            paper: '#202020',
        },
    },
};

const theme = responsiveFontSizes(createMuiTheme(THEME));

export default theme;
