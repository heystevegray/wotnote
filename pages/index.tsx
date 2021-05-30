import { GetServerSideProps } from 'next';
import { makeStyles, createStyles, Theme, Grid, Typography } from '@material-ui/core';
import Layout from '../components/layout';
import Keybard from '../components/keyboard/Keyboard';

import { tools } from '../lib/tools';
import useMidiApi from '../hooks/use-midi';
import { useEffect } from 'react';

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

export type Image = { src: string; width: number; height: number };
interface Props {
    tools: { name: string; image?: Image }[];
}

// { tools = [] }: Props
export default function Home() {
    const classes = useStyles();
    const data = useMidiApi()
    useEffect(() => console.log({ data }), [data])


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
                            {JSON.stringify(data, null, 2)}
                        </Typography>
                    </Grid>
                </Grid>
            </Layout>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    return {
        props: {
            tools: tools.map(({ name, image }) => ({
                name,
                image,
            })),
        },
    };
};
