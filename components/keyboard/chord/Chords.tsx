import { Grid, Typography, Link } from "@material-ui/core"
import { Chord as ChordType } from "../PianoScale"
import Chord from "./Chord"

interface Props {
	chords: ChordType[]
}

const Chords = ({ chords }: Props) => {
	return (
		<Grid container item xs={12} justify="center">
			<Grid container item xs={12} spacing={3} justify="center">
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
				{chords.map((chord, index) => (
					<Grid container spacing={2} item xs={12} md={6} lg={3} key={`${chord.key}-${index}`}>
						<Grid item xs={12}>
							<Chord chord={chord} chordIndex={index} />
						</Grid>
					</Grid>
				))}
			</Grid>
		</Grid>
	)
}

export default Chords
