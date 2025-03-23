"use client"

import React, { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"

import { urlParams } from "../lib/config"
import { useMeyda } from "../lib/hooks/use-meyda"
import PianoRoll from "./piano/piano-roll"
import { Slider } from "./ui/slider"

const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number | null>(null)

  const {
    analyzerNode,
    recording,
    audio,
    midi,
    settings,
    startRecording,
    stopRecording,
  } = useMeyda()

  useEffect(() => {
    startRecording()
  }, [])

  const searchParams = useSearchParams()
  const color = searchParams?.get(urlParams.color) as string

  // console.log(
  //   midi,
  //   midi.midiNotes.map((note) => `${note.key} ${note.code}`)
  // )

  useEffect(() => {
    if (!recording || !analyzerNode) {
      const canvas = canvasRef.current
      if (canvas) {
        const canvasCtx = canvas.getContext("2d")
        if (canvasCtx) {
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
        }
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
        animationIdRef.current = null
      }

      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const canvasCtx = canvas.getContext("2d")
    if (!canvasCtx) return
    const bufferLength = analyzerNode.fftSize
    const dataArray = new Uint8Array(bufferLength)
    console.log("Starting drawing loop with buffer length:", bufferLength)

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw)
      analyzerNode.getByteTimeDomainData(dataArray)

      // Scale the canvas for high-DPI screens.
      const dpr = window.devicePixelRatio || 1
      // Set canvas width/height based on its client dimensions.
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      // Clear the canvas entirely, resulting in a transparent background.
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

      canvasCtx.fillStyle = "transparent"
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
      canvasCtx.lineWidth = 4
      canvasCtx.strokeStyle = color ?? "green"
      canvasCtx.beginPath()

      const sliceWidth = canvas.width / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * canvas.height) / 2
        if (i === 0) {
          canvasCtx.moveTo(x, y)
        } else {
          canvasCtx.lineTo(x, y)
        }
        x += sliceWidth
      }
      canvasCtx.lineTo(canvas.width, canvas.height / 2)
      canvasCtx.stroke()
    }

    draw()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [recording, analyzerNode, color])

  return (
    <Card className="w-full overflow-hidden">
      <div className="h-32 border-b border-border">
        <canvas className="size-full" ref={canvasRef} height={80} width={500} />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn("size-4 rounded-full bg-foreground", {
                "animate-pulse bg-red-500": recording,
              })}
            />
            <p>{recording ? "Recording" : "Not Recording"}</p>
          </div>
          <div>{audio.pitchClass}</div>
          <div>
            <Button
              aria-label="Toggle recording"
              onClick={() => {
                if (recording) {
                  stopRecording()
                } else {
                  startRecording()
                }
              }}
            >
              {recording ? <Icons.mic /> : <Icons.micOff />}
              {recording ? "Recording" : "Not Recording"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Slider
          defaultValue={[settings.thresholdRatio]}
          min={0}
          max={1}
          step={0.1}
          onValueChange={(values) => {
            settings.handleSliderChange(values[0])
          }}
        />
        <p>Sensitivity: {settings?.thresholdRatio}</p>
      </CardContent>
      {/* <CardContent>
        {Object.entries(audio).map(([key, value]) => {
          return (
            <Detail
              key={key}
              label={capitalizeFirstLetter(key)}
              value={value as ReactNode}
            />
          )
        })}
      </CardContent> */}
      <CardFooter className="bg-background p-0 md:p-0">
        <PianoRoll chordIndex={0} midiNotes={midi.midiNotes} />
      </CardFooter>
    </Card>
  )
}

export default AudioVisualizer
