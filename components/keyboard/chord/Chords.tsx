import { Grid, Typography, Link, Container } from "@material-ui/core"
import { Chord as ChordType } from "../PianoScale"
import Chord from "./Chord"

interface Props {
	chords: ChordType[]
}

const Chords = ({ chords }: Props) => {
	return (
		<Grid container item xs={12} spacing={1} justify="center">
			<Grid container item xs={12}>
				<Grid item xs={12}>
					<Typography align="center" variant="h2">
						Diatonic Chords
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography align="center" variant="body1">
						"Diatonic chords are chords built on the notes of a particular scale." |{' '}
						<Link target="_blank" href="https://www.pianote.com/blog/diatonic-chords/">
							Source
						</Link>
					</Typography>
				</Grid>
			</Grid>
			{chords.map((chord, index) => (
				<Grid container item xs={12} md={6} lg={3} key={`${chord.key}-${index}`}>
					<Chord chord={chord} chordIndex={index} />
				</Grid>
			))}
		</Grid>
	)
}

export default Chords
