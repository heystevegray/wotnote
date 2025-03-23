"use client"

import { detectChord } from "@/lib/core/keyboard"
import { useMeyda } from "@/lib/hooks/use-meyda"
import AudioVisualizer from "@/components/audio-visualizer"

import ChordDetection from "./chord-detection"
import Container from "./container"

const PitchTracker = () => {
  const { midi } = useMeyda()

  return (
    // <div className="h-[calc(100svh-64px)]">
    <Container className="flex flex-col items-center justify-center space-y-4">
      <AudioVisualizer />
      <ChordDetection
        chord={detectChord(new Set(midi.midiNotes.map((note) => note.code)))}
      />
    </Container>
    // </div>
  )
}

export default PitchTracker
