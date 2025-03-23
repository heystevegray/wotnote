"use client"

import useMidi from "@/lib/hooks/use-midi"
import ChordDetection from "@/components/chord-detection"

const Play = () => {
  const midiConfig = useMidi()

  return (
    <div className="h-[calc(100svh-64px)]">
      <ChordDetection midiNotes={midiConfig.midiNotes} />
    </div>
  )
}

export default Play
