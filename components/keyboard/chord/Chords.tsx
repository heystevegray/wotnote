import { Grid, Typography, IconButton, Popover, Link, makeStyles } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import { MouseEventHandler, useState } from 'react';
import { Chord as ChordType } from '../../../lib/classes/PianoScale';
import Chord from './Chord';

export interface ChordProps {
    chords: ChordType[];
}

const useStyles = makeStyles((theme) => ({
    popover: {
        padding: theme.spacing(4),
    },
}));

const Chords = ({ chords }: ChordProps) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'chord info' : undefined;

    return (
        <Grid container item xs={12} justify="center">
            <Grid container item xs={12} spacing={2} justify="center">
                <Grid container item xs={12} spacing={1} justify="center" alignItems="center">
                    <Grid item>
                        <Typography align="center">Diatonic Chords</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton aria-label="Diatonic Chord Info" aria-describedby={id} onClick={handleClick}>
                            <Info />
                        </IconButton>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                        >
                            <Grid container className={classes.popover} justify="center" alignItems="center">
                                <Grid item xs={12}>
                                    <Typography align="center" variant="body1">
                                        "Diatonic chords are chords built on the notes of a particular scale." |{' '}
                                        <Link target="_blank" href="https://www.pianote.com/blog/diatonic-chords/">
                                            Source
                                        </Link>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Popover>
                    </Grid>
                </Grid>
                {chords.map((chord, index) => (
                    <Grid container spacing={2} item xs={12} md={6} lg={3} key={`${chord.key}-${index}`}>
                        <Grid item xs={12}>
                            <Chord chord={chord} chordIndex={index} />
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

export default Chords;
