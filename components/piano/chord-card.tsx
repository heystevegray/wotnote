import { ChordProps, Note, convertToFlat } from "@/lib/core/Piano"
import { capitalizeFirstLetter, cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  chord: ChordProps
  chordIndex?: number
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

const Chord = ({ chord }: Props) => {
  const degree = scaleDegrees[chord.scaleDegree]

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row gap-2 items-center space-y-0">
        <CardTitle>
          <div
            className={cn(
              "bg-foreground text-background rounded-full flex items-center justify-center size-6 text-sm text-center",
              degree?.color
            )}
          >
            {chord.scaleDegree}
          </div>
        </CardTitle>
        <CardDescription>{degree?.value}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col items-center">
        <h2 className="text-3xl text-center font-bold">
          {capitalizeFirstLetter(convertToFlat(chord.key))}
        </h2>
        {/* <PianoRoll activeNotes={chord.notes} chordIndex={chordIndex} /> */}
        <div className="flex gap-4">
          {chord.notes.map((note: Note) => (
            <div key={note.code}>
              <p className="text-xl">
                {capitalizeFirstLetter(convertToFlat(note.key))}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        {chord?.lyrics ? (
          <p className="text-sm text-muted-foreground">{chord.lyrics}</p>
        ) : null}
      </CardFooter>
    </Card>
  )
}

export default Chord
