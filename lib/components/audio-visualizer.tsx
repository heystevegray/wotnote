import React, { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Container from "@/components/container"
import Detail from "@/components/detail"
import { Icons } from "@/components/icons"

import { UNAVAILABLE, urlParams } from "../config"
import { useMeyda } from "../hooks/use-meyda"
import { cn } from "../utils"

const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number | null>(null)

  const {
    analyzerNode,
    recording,
    pitch,
    features,
    note,
    frequency,
    startRecording,
    stopRecording,
  } = useMeyda()

  const searchParams = useSearchParams()
  const color =
    (searchParams?.get(urlParams.color) as string) ??
    "hsl(var(--key-highlight))"

  useEffect(() => {
    if (!recording || !analyzerNode) {
      console.log(
        "Visualizer not active: recording =",
        recording,
        "analyzer =",
        analyzerNode
      )
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
      canvasCtx.strokeStyle = color
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
    <Container>
      <Card className="w-full max-w-md overflow-hidden">
        <div className="h-32 border-b border-border">
          <canvas className="w-full" ref={canvasRef} height={128} width={500} />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn("size-4 rounded-full bg-muted-foreground", {
                  "animate-pulse bg-red-500": recording,
                })}
              />
              <p>{recording ? "Recording" : "Not Recording"}</p>
            </div>
            <div>
              <Button
                variant="ghost"
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
          <Detail label="Pitch" value={pitch ?? UNAVAILABLE} />
          <Detail label="Frequency" value={frequency ?? UNAVAILABLE} />
          <Detail label="Note" value={note ?? UNAVAILABLE} />
          <Detail
            label="Features"
            value={
              <pre className="overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(features, null, 2) ?? UNAVAILABLE}
              </pre>
            }
          />
        </CardContent>
      </Card>
    </Container>
  )
}

export default AudioVisualizer
