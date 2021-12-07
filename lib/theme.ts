import { createMuiTheme, responsiveFontSizes, ThemeOptions } from '@material-ui/core/styles';

const THEME: ThemeOptions = {
    typography: {
        fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
        body1: {
            fontSize: '1.25rem',
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
