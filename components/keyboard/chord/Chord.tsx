import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import Piano from '../piano/Piano';
import { Chord as ChordType, Note } from '../PianoScale';

interface Props {
    chord: ChordType;
    chordIndex: number;
}

const scaleDegrees = ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Leading', 'Octave'];

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(2),
        width: '100%',
    },
}));

const Chord = ({ chord, chordIndex }: Props) => {
    const classes = useStyles();
    const numberOfDegrees = 7;
    const chordNumber = (chordIndex % numberOfDegrees) + 1;

    return (
        <Paper elevation={6} className={classes.container}>
            <Grid container alignItems="center" spacing={2}>
                <Grid item xs={6}>
                    <Typography color="textSecondary">Chord {chordNumber}</Typography>
                </Grid>
                <Grid container item xs={6} justify="flex-end">
                    <Typography color="textSecondary">{scaleDegrees[chordIndex]}</Typography>
                </Grid>
                <Grid container item xs={12} direction="column" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h3">{chord.key}</Typography>
                    </Grid>
                </Grid>
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <Piano activeNotes={chord.notes} chordIndex={chordIndex} />
                    </Grid>
                </Grid>
                <Grid container item justify="center">
                    <Grid container item xs={12} justify="center">
                        {chord.notes.map((note: Note) => (
                            <Grid container item xs={2} justify="center" key={note.code}>
                                <Typography variant="h4" color="textSecondary">
                                    {note.key}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Chord;
