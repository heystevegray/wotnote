"use client"

import { Chord as ChordType } from "@/lib/core/keyboard"
import useMidi from "@/lib/hooks/use-midi"
import { camelCaseToTitleCase } from "@/lib/utils"
import ChordName from "@/components/chord-name"
import Inversion from "@/components/inversion"
import MidiKeyboard from "@/components/midi-keyboard"

const detailOrder: (keyof ChordType)[] = [
  "symbol",
  "tonic",
  "quality",
  "alias",
  "notes",
  "semitones",
  "degrees",
]

const Detail = ({
  label,
  value,
}: {
  label: string
  value?: string | string[] | number[] | null
}) => {
  let formattedValue = value

  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    formattedValue = value.join(", ")
  }

  return (
    <p className="text-muted-foreground">
      {camelCaseToTitleCase(label)}:{" "}
      <span className="text-foreground">{formattedValue}</span>
    </p>
  )
}

const ChordDetection = () => {
  const midiConfig = useMidi()
  const sortedDetails = detailOrder.map((key) => ({
    key,
    value: midiConfig.chord?.[key],
  }))

  return (
    <div className="flex h-[calc(100svh-64px)] flex-col">
      <div className="relative flex-1 flex-col p-4 text-center">
        <div className="flex h-full flex-col">
          <div className="flex flex-1 flex-col items-center justify-center">
            <ChordName chord={midiConfig.chord} />
          </div>
          <div className="flex w-full items-end justify-between">
            <div className="flex flex-col items-start">
              {sortedDetails.map(({ key, value }) => (
                <Detail key={key} label={key} value={value} />
              ))}
            </div>
            <Inversion value={midiConfig.chord?.inversion} />
          </div>
        </div>
      </div>
      <div className="">
        <MidiKeyboard disableScale />
      </div>
    </div>
  )
}

export default ChordDetection
