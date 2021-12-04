import { createMuiTheme, responsiveFontSizes, ThemeOptions } from '@material-ui/core/styles';

const THEME: ThemeOptions = {
    palette: {
        type: 'dark',
        primary: {
            main: '#00ff00',
        },
        background: {
            default: '#181818',
            paper: '#202020',
        }
    },
};

const theme = responsiveFontSizes(createMuiTheme(THEME));

export default theme;
