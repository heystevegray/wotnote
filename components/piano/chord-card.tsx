import { MidiNote } from "@/lib/core/keyboard"
import { ChordProps, convertToFlat } from "@/lib/core/Piano"
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
  const loading = chord?.notes?.every((note) => note.key) === false

  return (
    <Card
      className={cn(
        "shadow-lg transition-transform ease-in-out hover:scale-110 hover:shadow-2xl",
        {
          "scale-110 shadow-2xl blur-sm transition-transform ease-in-out":
            loading,
        }
      )}
    >
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <CardTitle>
          <div
            className={cn(
              "flex size-6 items-center justify-center rounded-full bg-foreground text-center text-sm text-background",
              degree?.color
            )}
          >
            {chord.scaleDegree}
          </div>
        </CardTitle>
        <CardDescription>{degree?.value}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <h2 className="text-center text-3xl font-bold">
          {capitalizeFirstLetter(convertToFlat(chord.key))}
        </h2>
        {/* <PianoRoll activeNotes={chord.notes} chordIndex={chordIndex} /> */}
        <div className="flex gap-4">
          {chord.notes.map((note: MidiNote) => (
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
          <div className="w-full border-t pt-2 text-center">
            <p className="text-xs text-muted-foreground">{chord.lyrics}</p>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  )
}

export default Chord
