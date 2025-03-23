"use client"

import { useMeyda } from "@/lib/hooks/use-meyda"
import AudioVisualizer from "@/components/audio-visualizer"

import ChordDetection from "./chord-detection"
import Container from "./container"

const PitchTracker = () => {
  const { midi } = useMeyda()

  // console.log(
  //   midi,
  //   midi.midiNotes.map((note) => `${note.key} ${note.code}`)
  // )

  return (
    <Container className="flex flex-col items-center justify-center space-y-4">
      <AudioVisualizer />
      {/* <div className="h-[500px] w-full">
        <ChordDetection midiNotes={midi?.midiNotes ?? []} />
      </div> */}
    </Container>
  )
}

export default PitchTracker
