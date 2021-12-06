import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import Piano from '../piano/Piano';
import { Chord as ChordType, Note } from '../PianoScale';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(2),
        width: '100%',
    },
}));

interface Props {
    chord: ChordType;
    chordIndex: number;
}

const Chord = ({ chord, chordIndex }: Props) => {
    const classes = useStyles();
    const chordNumber = chordIndex + 1
    const index = chordNumber === 8 ? 1 : chordNumber;

    return (
        <Paper elevation={6} className={classes.container} >
            <Grid container alignItems="center">
                <Grid item xs={12}>
                    <Typography color="textSecondary">Chord {index}</Typography>
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
                    <Grid container item xs={3}>
                        {chord.notes.map((note: Note) => (
                            <Grid container item xs justify="center" key={note.code}>
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
