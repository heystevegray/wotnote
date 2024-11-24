import { MouseEventHandler, useState } from "react"

import { Chord as ChordType } from "../PianoScale"
import Chord from "./chord-card"

interface Props {
  chords: ChordType[]
}

const Chords = ({ chords }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "chord info" : undefined

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      {/* <Grid container item xs={12} spacing={2} justify="center">
        <Grid
          container
          item
          xs={12}
          spacing={1}
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <Typography align="center">Diatonic Chords</Typography>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="Diatonic Chord Info"
              aria-describedby={id}
              onClick={handleClick}
            >
              <Info />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <Grid container justify="center" alignItems="center">
                <Grid item xs={12}>
                  <Typography align="center" variant="body1">
                    "Diatonic chords are chords built on the notes of a
                    particular scale." |{" "}
                    <Link
                      target="_blank"
                      href="https://www.pianote.com/blog/diatonic-chords/"
                    >
                      Source
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Popover>
          </Grid>
        </Grid> */}
      {chords.map((chord, index) => (
        <Chord chord={chord} chordIndex={index} key={`${chord.key}-${index}`} />
      ))}
    </div>
  )
}

export default Chords
