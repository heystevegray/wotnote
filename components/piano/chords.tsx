import { ChordProps } from "@/lib/core/Piano"

import Chord from "./chord-card"

interface Props {
  chords: ChordProps[]
}

const Chords = ({ chords = [] }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
      {chords
        .filter((chord) => Boolean(chord?.notes?.length >= 3))
        .map((chord, index) => {
          return <Chord chord={chord} chordIndex={index} key={chord.id} />
        })}
    </div>
  )
}

export default Chords
