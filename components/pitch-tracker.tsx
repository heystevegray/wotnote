"use client"

import AudioVisualizer from "@/lib/components/audio-visualizer"
import { useMeyda } from "@/lib/hooks/use-meyda"
import { cn } from "@/lib/utils"

import Container from "./container"

const PitchTracker = () => {
  const { recording } = useMeyda()

  return (
    <Container className="flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center justify-center gap-2">
        <div
          className={cn("size-4 rounded-full bg-muted-foreground", {
            "animate-pulse bg-red-500": recording,
          })}
        />
        <p>{recording ? "Recording" : "Not Recording"}</p>
      </div>
      <AudioVisualizer />
    </Container>
  )
}

export default PitchTracker
