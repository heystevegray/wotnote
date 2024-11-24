import { ChordProps } from "@/lib/core/Piano"

import Chord from "./chord-card"

interface Props {
  chords: ChordProps[]
}

const Chords = ({ chords }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      {chords.map((chord, index) => (
        <Chord chord={chord} chordIndex={index} key={`${chord.key}-${index}`} />
      ))}
    </div>
  )
}

export default Chords
