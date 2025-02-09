"use client"

import React from "react"

import useMidi from "@/lib/hooks/use-midi"
import { cn } from "@/lib/utils"
import MidiKeyboard from "@/components/midi-keyboard"

const Play = () => {
  const midiConfig = useMidi()

  return (
    <div className="flex h-[calc(100svh-64px)] flex-col">
      <div className="flex-1 flex-col text-center">
        <h2
          className={cn(
            "flex h-full flex-col items-center justify-center text-8xl text-muted-foreground",
            {
              "text-cyan-500": midiConfig.chords.chordName,
            }
          )}
        >
          {midiConfig.chords.chordName}
          {/* // "Play at least two notes simultaneously..."} */}
        </h2>
        {/* <pre>{JSON.stringify(midiConfig, null, 2)}</pre> */}
      </div>
      <div className="">
        <MidiKeyboard disableScale />
      </div>
    </div>
  )
}

export default Play
