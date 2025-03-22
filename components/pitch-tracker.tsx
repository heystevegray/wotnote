"use client"

import AudioVisualizer from "@/lib/components/audio-visualizer"
import { useMeyda } from "@/lib/hooks/use-meyda"
import { cn } from "@/lib/utils"

import Container from "./container"

const PitchTracker = () => {
  const { recording } = useMeyda()

  return (
    <Container className="flex flex-col items-center justify-center space-y-4">
      <AudioVisualizer />
    </Container>
  )
}

export default PitchTracker
