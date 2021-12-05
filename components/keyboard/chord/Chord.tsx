import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Chord as ChordType } from '../PianoScale';

const useStyles = makeStyles((theme) => ({
	container: {
		border: `1px solid ${theme.palette.primary.main}`,
		borderRadius: 8,
		padding: theme.spacing(2)
	}
}))

const Chord = ({ chord }: { chord: ChordType }) => {
	const classes = useStyles();
	return (
		<Grid container className={classes.container} alignItems="center" direction="column">
			<Grid item xs={12}>
				<Typography variant="h3">{chord.key}</Typography>
			</Grid>
			<Grid container item xs={12}>
				{chord.notes.map((note) => (
					<Grid container item xs justify="center">
						<Typography variant='h4' color="textSecondary">{note.key}</Typography>
					</Grid>
				))}
			</Grid>
		</Grid >
	);
};

export default Chord;
