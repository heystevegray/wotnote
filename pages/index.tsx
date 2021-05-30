import { makeStyles, createStyles, Theme, Grid, Typography, Select, MenuItem } from '@material-ui/core';
import Layout from '../components/layout';
import Keybard from '../components/keyboard/Keyboard';

import useMidiApi from '../hooks/use-midi';
import { useEffect } from 'react';
import util from 'util'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            minWidth: theme.breakpoints.values.sm,
            [theme.breakpoints.down('xs')]: {
                width: '100%',
                minWidth: 100,
            },
        },
        root: {
            padding: '2em',
        },
        linkButton: {
            marginLeft: '1em',
        },
    })
);

export default function Home() {
    const classes = useStyles();
    const data = useMidiApi()
    // console.log(util.inspect(data, { showHidden: false, depth: null }))

    return (
        <>
            <Layout title="Next.js example">
                <Grid container spacing={4} direction="column" className={classes.root}>
                    <Grid item container spacing={4} direction="column" xs={12} alignItems="center">
                        <Grid container item alignContent="center" justify="center">
                            <Keybard />
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography>
                            {JSON.stringify(data.midi, null, 2)}
                        </Typography>
                    </Grid>
                </Grid>
            </Layout>
        </>
    );
}