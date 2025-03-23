"use client"

import { Chord as ChordType, detectChord, MidiNote } from "@/lib/core/keyboard"
import { MIDIChordProps } from "@/lib/hooks/use-midi"
import ChordName from "@/components/chord-name"
import Inversion from "@/components/inversion"

import Detail from "./detail"
import PianoRoll from "./piano/piano-roll"

const detailOrder: (keyof ChordType)[] = [
  "symbol",
  "tonic",
  "quality",
  "alias",
  "notes",
  "midiNotes",
  "semitones",
  "degrees",
]

const ChordDetection = ({ midiNotes }: { midiNotes: MidiNote[] }) => {
  const chord: MIDIChordProps["chord"] = detectChord(
    new Set(midiNotes.map((note) => note.code))
  )

  const sortedDetails = detailOrder.map((key) => ({
    key,
    value: chord?.[key],
  }))

  return (
    <div className="flex size-full flex-col">
      <div className="relative flex-1 flex-col p-4 text-center">
        <div className="flex h-full flex-col">
          <div className="flex flex-1 flex-col items-center justify-center">
            <ChordName chord={chord} />
          </div>
          <div className="flex w-full items-end justify-between">
            <div className="flex flex-col items-start">
              {sortedDetails.map(({ key, value }) => (
                <Detail key={key} label={key} value={value} />
              ))}
            </div>
            <Inversion value={chord?.inversion} />
          </div>
        </div>
      </div>
      <div className="">
        {/* <MidiKeyboard disableScale /> */}
        <PianoRoll chordIndex={0} midiNotes={midiNotes} />
      </div>
    </div>
  )
}

export default ChordDetection
