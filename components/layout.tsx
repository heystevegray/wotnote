import { makeStyles, createStyles, Typography, Grid, Select, MenuItem, FormControl, InputLabel, Theme } from '@material-ui/core';
import { ReactElement, useEffect, useState } from 'react';
import Head from 'next/head';
import useMidiApi from '../hooks/use-midi';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            padding: theme.spacing(2),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 150,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    })
);

interface LayoutProps {
    children: ReactElement[] | ReactElement | string;
    title: string;
}

const Layout = ({ children, title }: LayoutProps): ReactElement => {
    const classes = useStyles();
    const data = useMidiApi()
    const devices = data.inputs.map(input => input.deviceName)
    const [selectedDevice, setSelectedDevice] = useState('');

    useEffect(() => {
        const selected = selectedDevice ? selectedDevice : devices[0]
        setSelectedDevice(selected)
    }, [data.inputs])


    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedDevice(event.target.value as string);
    };

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <header className={classes.header}>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            wotnote
                        </Typography>
                    </Grid>
                    <Grid item container xs={6} justify="flex-end">
                        <FormControl className={classes.formControl}>
                            <InputLabel id="device-select-label">MIDI Devices</InputLabel>
                            <Select
                                labelId="device-select-label"
                                id="device-select"
                                value={selectedDevice ? selectedDevice : ""}
                                onChange={handleChange}
                            >
                                {devices.map((device, index) => {
                                    return <MenuItem key={device + index} value={device}>{device}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>


                </Grid>
            </header>
            <main>{children}</main>
        </>
    );
};

export default Layout;
