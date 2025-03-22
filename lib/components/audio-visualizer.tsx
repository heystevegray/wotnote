"use client"

import React, { ReactNode, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { MeydaFeaturesObject } from "meyda"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Container from "@/components/container"
import Detail from "@/components/detail"
import { Icons } from "@/components/icons"
import PianoRoll from "@/components/piano/piano-roll"

import { urlParams } from "../config"
import { useMeyda } from "../hooks/use-meyda"
import { capitalizeFirstLetter, cn } from "../utils"

const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number | null>(null)

  const {
    analyzerNode,
    recording,
    midi,
    audio,
    startRecording,
    stopRecording,
  } = useMeyda()

  useEffect(() => {
    startRecording()
  }, [])

  const searchParams = useSearchParams()
  const color = searchParams?.get(urlParams.color) as string

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
    <Card className="w-full max-w-md overflow-hidden">
      <div className="h-32 border-b border-border">
        <canvas className="w-full" ref={canvasRef} height={128} width={500} />
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
          <div>
            <Button
              size="icon"
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
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(audio).map(([key, value]) => {
          return (
            <Detail
              key={key}
              label={capitalizeFirstLetter(key)}
              value={value as ReactNode}
            />
          )
        })}
      </CardContent>
      <CardFooter className="bg-background p-0 md:p-0">
        <PianoRoll chordIndex={0} activeNotes={midi.activeNotes} />
      </CardFooter>
    </Card>
  )
}

export default AudioVisualizer
