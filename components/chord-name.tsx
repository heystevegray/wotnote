"use client"

import { useSearchParams } from "next/navigation"

import { urlParams } from "@/lib/config"
import { MIDIChordProps } from "@/lib/hooks/use-midi"

const ChordName = ({ chord }: { chord?: MIDIChordProps["chord"] }) => {
  const searchParams = useSearchParams()
  const color =
    (searchParams?.get(urlParams.color) as string) ??
    "hsl(var(--key-highlight))"

  if (!chord) {
    return null
  }

  const { quality, symbol, semitones, tonic, bassNote } = chord
  const suffix = semitones.length > 2 && symbol ? symbol : quality
  const overNote = bassNote ? `/ ${bassNote}` : ""

  if (!chord) {
    return null
  }

  return (
    <h2
      className="min-h-[60px] text-6xl md:min-h-[128px] md:text-9xl lg:min-h-[160px] lg:text-[10rem]"
      style={{
        color,
      }}
    >
      {tonic} {suffix} {overNote}
    </h2>
  )
}

export default ChordName
