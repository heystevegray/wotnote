import { makeStyles, createStyles, Theme, Grid, Typography, Select, MenuItem } from '@material-ui/core';
import Layout from '../components/layout';
import Keybard from '../components/keyboard/Keyboard';

import useMidiApi from '../hooks/use-midi';
import util from 'util'

export default function Home() {
    const data = useMidiApi()
    // console.log(util.inspect(data, { showHidden: false, depth: null }))

    return (
        <>
            <Layout title="Next.js example">
                <Grid container spacing={4} direction="column">
                    <Grid item container direction="column" xs={12} alignItems="center">
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