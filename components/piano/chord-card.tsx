import { ChordProps, Note } from "@/lib/core/Piano"
import { capitalizeFirstLetter, cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import PianoRoll from "./piano-roll"

interface Props {
  chord: ChordProps
  chordIndex: number
}

const scaleDegrees = [
  { value: "Tonic", color: "bg-chord-1" },
  { value: "Supertonic", color: "bg-chord-2" },
  { value: "Mediant", color: "bg-chord-3" },
  { value: "Subdominant", color: "bg-chord-4" },
  { value: "Dominant", color: "bg-chord-5" },
  { value: "Submediant", color: "bg-chord-6" },
  { value: "Leading", color: "bg-chord-7" },
  { value: "Octave", color: "bg-chord-1" },
]

const Chord = ({ chord, chordIndex }: Props) => {
  const numberOfDegrees = 7
  const chordNumber = (chordIndex % numberOfDegrees) + 1
  const degree = scaleDegrees[chordIndex]

  return (
    <Card className="shadow-xl">
      <CardHeader className="flex flex-row gap-2 items-center space-y-0">
        <CardTitle>
          <div
            className={cn(
              "bg-foreground text-background rounded-full flex items-center justify-center size-6 text-sm text-center",
              degree.color
            )}
          >
            {chordNumber}
          </div>
        </CardTitle>
        <CardDescription>{degree.value}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col">
        <h2 className="text-3xl text-center font-bold">
          {capitalizeFirstLetter(chord.key)}
        </h2>
        <PianoRoll
          activeNotes={chord.notes}
          chordIndex={chordIndex}
          size={0.25}
        />
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        <div className="flex gap-4">
          {chord.notes.map((note: Note) => (
            <div key={note.code}>
              <p className="text-xl">{capitalizeFirstLetter(note.key)}</p>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

export default Chord
