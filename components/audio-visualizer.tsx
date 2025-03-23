"use client"

import React, { forwardRef, PropsWithChildren, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"

import { cn, hzToLog, logToHz, roundToNearest } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

import { urlParams } from "../lib/config"
import { useMeyda } from "../lib/hooks/use-meyda"
import { Slider } from "./ui/slider"

const Visualizer = forwardRef<HTMLCanvasElement, PropsWithChildren>(
  ({ children }, ref) => {
    return (
      <div className="relative h-32 w-full overflow-hidden rounded-lg border-b border-border bg-background md:h-64">
        <canvas className="size-full" ref={ref} />
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    )
  }
)

Visualizer.displayName = "Visualizer"

const AudioVisualizer = () => {
  const frequencyCanvasRef = useRef<HTMLCanvasElement>(null)
  const spectrumCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number | null>(null)

  const {
    analyzerNode,
    recording,
    audio,
    settings,
    startRecording,
    stopRecording,
  } = useMeyda()

  useEffect(() => {
    startRecording()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const searchParams = useSearchParams()
  const color = searchParams?.get(urlParams.color) as string

  useEffect(() => {
    if (!recording || !analyzerNode) {
      const canvas = frequencyCanvasRef.current
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

    const frequencyCanvas = frequencyCanvasRef.current
    if (!frequencyCanvas) return
    const frequencyCanvasCtx = frequencyCanvas.getContext("2d")
    if (!frequencyCanvasCtx) return
    const bufferLength = analyzerNode.fftSize
    const dataArray = new Uint8Array(bufferLength)
    console.log("Starting drawing loop with buffer length:", bufferLength)

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw)
      analyzerNode.getByteTimeDomainData(dataArray)

      // Scale the canvas for high-DPI screens.
      const dpr = window.devicePixelRatio || 1
      // Set canvas width/height based on its client dimensions.
      const rect = frequencyCanvas.getBoundingClientRect()

      frequencyCanvas.width = rect.width * dpr
      frequencyCanvas.height = rect.height * dpr

      // Clear the canvas entirely, resulting in a transparent background.
      frequencyCanvasCtx.clearRect(
        0,
        0,
        frequencyCanvas.width,
        frequencyCanvas.height
      )

      frequencyCanvasCtx.fillStyle = "transparent"
      frequencyCanvasCtx.fillRect(
        0,
        0,
        frequencyCanvas.width,
        frequencyCanvas.height
      )
      frequencyCanvasCtx.lineWidth = 4
      frequencyCanvasCtx.strokeStyle = color ?? "green"
      frequencyCanvasCtx.beginPath()

      const sliceWidth = frequencyCanvas.width / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * frequencyCanvas.height) / 2
        if (i === 0) {
          frequencyCanvasCtx.moveTo(x, y)
        } else {
          frequencyCanvasCtx.lineTo(x, y)
        }
        x += sliceWidth
      }
      frequencyCanvasCtx.lineTo(
        frequencyCanvas.width,
        frequencyCanvas.height / 2
      )
      frequencyCanvasCtx.stroke()

      if (spectrumCanvasRef.current && analyzerNode) {
        const spectrumCanvas = spectrumCanvasRef.current
        const spectrumCtx = spectrumCanvas.getContext("2d")
        if (!spectrumCtx) return

        // High-DPI scaling
        const dpr = window.devicePixelRatio || 1
        const rect = spectrumCanvas.getBoundingClientRect()
        spectrumCanvas.width = rect.width * dpr
        spectrumCanvas.height = rect.height * dpr
        spectrumCtx.scale(dpr, dpr)

        const freqData = new Uint8Array(analyzerNode.frequencyBinCount)
        analyzerNode.getByteFrequencyData(freqData)

        // Zero out low frequencies below the high pass filter threshold
        const nyquist = analyzerNode.context.sampleRate / 2
        const thresholdFreq = settings.highPassFilter
        const thresholdBin = Math.floor(
          (thresholdFreq / nyquist) * freqData.length
        )

        for (let i = 0; i < thresholdBin; i++) {
          freqData[i] = 0
        }

        const barWidth = rect.width / freqData.length
        spectrumCtx.clearRect(0, 0, rect.width, rect.height)

        for (let i = 0; i < freqData.length; i++) {
          const value = freqData[i]
          const barHeight = (value / 255) * rect.height
          spectrumCtx.fillStyle = color ?? "green"
          spectrumCtx.fillRect(
            i * barWidth,
            rect.height - barHeight,
            barWidth,
            barHeight
          )
        }
      }
    }

    draw()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [recording, analyzerNode, color, settings.highPassFilter])

  return (
    <Card className="w-full overflow-hidden">
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
            {recording ? <Icons.micOff /> : <Icons.mic />}
            {recording ? "Stop Recording" : "Start Recording"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Visualizer ref={frequencyCanvasRef}>
          <div className="flex size-16 items-center justify-center rounded-full bg-card backdrop-blur md:size-32">
            <p className="flex size-full items-center justify-center text-center text-2xl md:text-6xl">
              {audio.pitchClass}
            </p>
          </div>
        </Visualizer>
        <Slider
          label="Mic Sensitivity"
          description="Small values like 0.001 allow detecting very quiet signals (including noise). Higher values like 0.01–0.05 block out quiet/noisy input and only detect strong signals like speech or instruments."
          defaultValue={[settings.thresholdRatio]}
          min={0}
          max={1}
          step={0.1}
          onValueChange={(values) => {
            settings.setThresholdRatio(values[0])
          }}
        />
        <Visualizer ref={spectrumCanvasRef} />
        <Slider
          label="High Pass Filter"
          description="Cuts out low frequencies below the selected value. Helps reduce rumble or mic noise."
          unit="Hz"
          defaultValue={[hzToLog(settings.highPassFilter)]}
          displayValue={roundToNearest(settings.highPassFilter)}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(values) => {
            const freq = logToHz(values[0])
            settings.setHighPassFilter(freq)
          }}
        />
      </CardContent>
    </Card>
  )
}

export default AudioVisualizer
