import Head from "next/head"
import { Grid } from "@material-ui/core"

import Layout from "../components/layout"
import Keyboard from "../components/piano/Keyboard"

// import useMidiApi from '../hooks/use-midi';

export default function Home() {
  // const data = useMidiApi();
  // console.log(util.inspect(data, { showHidden: false, depth: null }))

  return (
    <>
      <Head>
        <title>wotnote</title>
        <meta name="description" content="Write music faster" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Grid container spacing={4} direction="column">
          <Grid item container direction="column" xs={12} alignItems="center">
            <Grid container item alignContent="center" justify="center">
              <Keyboard />
            </Grid>
          </Grid>
          {/* <Grid item>
                    <Typography>{JSON.stringify(data.midi, null, 2)}</Typography>
                </Grid> */}
        </Grid>
      </Layout>
    </>
  )
}
