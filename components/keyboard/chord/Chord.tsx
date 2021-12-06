import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Chord as ChordType, Note } from '../PianoScale';

const useStyles = makeStyles((theme) => ({
    container: {
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 8,
        padding: theme.spacing(2),
    },
}));

interface Props {
    chord: ChordType;
    chordNumber: number;
}

const Chord = ({ chord, chordNumber }: Props) => {
    const classes = useStyles();
    const index = chordNumber === 8 ? 1 : chordNumber;

    return (
        <Grid container className={classes.container} alignItems="center">
            <Grid item xs={12}>
                <Typography color="textSecondary">{index}</Typography>
            </Grid>
            <Grid container item xs={12} direction="column" alignItems="center">
                <Grid item xs={12}>
                    <Typography variant="h3">{chord.key}</Typography>
                </Grid>
            </Grid>
            <Grid container item xs={12}>
                {chord.notes.map((note: Note) => (
                    <Grid container item xs justify="center">
                        <Typography variant="h4" color="textSecondary">
                            {note.key}
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

export default Chord;
