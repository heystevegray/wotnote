"use client"

import { useSearchParams } from "next/navigation"

import { urlParams } from "@/lib/config"
import useMidi from "@/lib/hooks/use-midi"
import { cn } from "@/lib/utils"

import Detail from "./detail"
import Inversion from "./inversion"
import MidiKeyboard from "./midi-keyboard"

const ChordDetection = () => {
  const midiConfig = useMidi()

  const searchParams = useSearchParams()
  const color =
    (searchParams?.get(urlParams.color) as string) ??
    "hsl(var(--key-highlight))"

  const bassNote = midiConfig.chords.chord?.bassNote
    ? `/ ${midiConfig.chords.chord?.bassNote}`
    : ""

  return (
    <div className="flex size-full flex-col">
      <div className="relative flex-1 flex-col p-4 text-center">
        <div className="absolute left-0 top-0 p-4 text-start">
          <Detail
            label="Alias"
            value={midiConfig.chords.details?.aliases.join(", ")}
          />
          <Detail
            label="Notes"
            value={midiConfig.chords.details?.notes.join(", ")}
          />
          <Detail
            label="Quality"
            value={
              midiConfig.chords.details?.quality === "Unknown"
                ? ""
                : midiConfig.chords.details?.quality
            }
          />
          <Detail label="Tonic" value={midiConfig.chords.details?.tonic} />
          <Detail label="Type" value={midiConfig.chords.details?.type} />
        </div>
        <div className={cn("flex h-full flex-col")}>
          <div className="flex flex-1 flex-col items-center justify-center">
            <h2
              className="min-h-[60px] text-6xl md:min-h-[128px] md:text-9xl lg:min-h-[160px] lg:text-[10rem]"
              style={{
                color,
              }}
            >
              {midiConfig.chords.chord?.tonic}{" "}
              {midiConfig.chords.chord?.quality} {bassNote}
            </h2>
          </div>
          <div className="flex w-full justify-end">
            <Inversion value={midiConfig.chords.chord?.inversion} />
          </div>
          {/* <pre className="text-left text-sm text-muted-foreground">
            {JSON.stringify(midiConfig.chords.details, null, 2)}
          </pre> */}
        </div>
      </div>
      <div className="">
        <MidiKeyboard disableScale />
      </div>
    </div>
  )
}

export default ChordDetection
