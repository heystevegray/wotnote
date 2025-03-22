"use client"

import { useEffect } from "react"
import { PitchDetector } from "pitchy"

import AudioVisualizer from "@/lib/components/audio-visualizer"
import { UNAVAILABLE } from "@/lib/config"
import usePitch from "@/lib/hooks/pitch/use-pitch"
import { cn } from "@/lib/utils"

// import { UNAVAILABLE } from "@/lib/config"

import Container from "./container"
import Detail from "./detail"
import { Button } from "./ui/button"

// import Detail from "./detail"
// import { Button } from "./ui/button"

const PitchTracker = () => {
  const { recording, pitch, frequency, startRecording, stopRecording } =
    usePitch()

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
      <Button
        onClick={() => {
          if (recording) {
            stopRecording()
          } else {
            startRecording()
          }
        }}
      >
        {recording ? "Stop" : "Start"} Recording
      </Button>
      <AudioVisualizer />
      <Detail label="Pitch" value={pitch ?? UNAVAILABLE} />
      <Detail label="Frequency" value={frequency ?? UNAVAILABLE} />
    </Container>
  )
}

export default PitchTracker
