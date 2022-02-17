import { Toolbar, Grid, Typography, Link } from '@material-ui/core';

const Footer = () => {
    return (
        <Toolbar>
            <Grid container justify="center" alignItems="center">
                <Typography align="center">
                    Created by{' '}
                    <Link color="primary" target="_blank" href="https://heystevegray.dev/">
                        Steve Gray
                    </Link>
                </Typography>
            </Grid>
        </Toolbar>
    );
};

export default Footer;
