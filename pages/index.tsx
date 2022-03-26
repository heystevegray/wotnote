import { AppBar, Box, Grid, makeStyles, Tab, Tabs, Theme, Typography } from '@material-ui/core';
import Layout from '../components/layout';
import Keyboard from '../components/keyboard/Keyboard';
import Head from 'next/head';
import { useState } from 'react';
import useMidiApi from '../hooks/use-midi';
import Shuffle from '../components/keyboard/chord/Shuffle';
import KeySelector from '../components/keyboard/KeySelector';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

const midiIndex = 2;

export default function Home() {
    const data = useMidiApi();
    // console.log(util.inspect(data, { showHidden: false, depth: null }))
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Head>
                <title>wotnote</title>
                <meta name="description" content="Write music faster" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <AppBar position="static" color="transparent">
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                aria-label="simple tabs example"
                                indicatorColor="primary"
                            >
                                <Tab label="Chords" {...a11yProps(0)} />
                                <Tab label="Shuffle" {...a11yProps(1)} />
                                <Tab label="Midi" {...a11yProps(midiIndex)} />
                            </Tabs>
                        </AppBar>
                    </Grid>
                    <Grid item xs={12}>
                        {value !== midiIndex && <KeySelector />}
                    </Grid>
                </Grid>
                <TabPanel value={value} index={0}>
                    <Keyboard />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Shuffle />
                </TabPanel>
                <TabPanel value={value} index={midiIndex}>
                    <Box p={2}>
                        <Typography>{JSON.stringify(data.midi, null, 2)}</Typography>
                    </Box>
                </TabPanel>
            </Layout>
        </>
    );
}
