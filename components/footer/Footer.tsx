import { Grid, Typography, Link } from '@material-ui/core';
import { MY_WEBSITE_URL } from '../../lib/config';

const Footer = () => {
    return (
        <Grid container justify="center" alignItems="center">
            <Typography align="center">
                Created by{' '}
                <Link color="primary" target="_blank" href={MY_WEBSITE_URL}>
                    Steve Gray
                </Link>
            </Typography>
        </Grid>
    );
};

export default Footer;
