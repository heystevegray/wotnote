import { MouseEventHandler, useState } from "react"

import { Chord as ChordType } from "../Piano"
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
      {chords.map((chord, index) => (
        <Chord chord={chord} chordIndex={index} key={`${chord.key}-${index}`} />
      ))}
    </div>
  )
}

export default Chords
