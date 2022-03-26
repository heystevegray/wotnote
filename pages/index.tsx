import { AppBar, Box, Grid, makeStyles, Tab, Tabs, Theme, Typography } from '@material-ui/core';
import Layout from '../components/layout';
import Keyboard from '../components/keyboard/Keyboard';
import Head from 'next/head';
import { useState } from 'react';
import { Shuffle } from '@material-ui/icons';
import useMidiApi from '../hooks/use-midi';

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
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

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
                <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Chords" {...a11yProps(0)} />
                        <Tab label="Shuffle" {...a11yProps(1)} />
                        <Tab label="Midi" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <Keyboard />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Shuffle chords={[]} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Typography>{JSON.stringify(data.midi, null, 2)}</Typography>
                </TabPanel>
            </Layout>
        </>
    );
}
