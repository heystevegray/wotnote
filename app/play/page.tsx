"use client"

import React from "react"
import { useSearchParams } from "next/navigation"

import { urlParams } from "@/lib/config"
import useMidi from "@/lib/hooks/use-midi"
import { cn } from "@/lib/utils"
import Container from "@/components/container"
import MidiKeyboard from "@/components/midi-keyboard"

const Detail = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) {
    return null
  }

  return (
    <p className="text-muted-foreground">
      {label}: <span className="text-foreground">{value}</span>
    </p>
  )
}

const Play = () => {
  const midiConfig = useMidi()

  const searchParams = useSearchParams()
  const color =
    (searchParams.get(urlParams.color) as string) ?? "hsl(var(--key-highlight))"

  return (
    <div className="flex h-[calc(100svh-64px)] flex-col">
      <Container className="relative flex-1 flex-col text-center">
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
        {/* {JSON.stringify(midiConfig.chords.activeNotes, null, 2)} */}
        <h2
          className={cn(
            "flex h-full flex-col items-center justify-center text-[10rem] text-muted-foreground"
          )}
          style={{
            color,
          }}
        >
          {midiConfig.chords.chordName}
          {/* // "Play at least two notes simultaneously..."} */}
        </h2>
      </Container>
      <div className="">
        <MidiKeyboard disableScale />
      </div>
    </div>
  )
}

export default Play
