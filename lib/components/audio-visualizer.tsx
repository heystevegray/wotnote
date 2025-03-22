import React, { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"

import usePitch from "../hooks/pitch/use-pitch"

const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number | null>(null)

  const { analyserRef, recording, startRecording, stopRecording } = usePitch()

  useEffect(() => {
    if (!recording || !analyserRef.current) {
      console.log(
        "Visualizer not active: recording =",
        recording,
        "analyser =",
        analyserRef.current
      )
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    const canvasCtx = canvas.getContext("2d")
    if (!canvasCtx) return
    const analyser = analyserRef.current
    const bufferLength = analyser.fftSize
    const dataArray = new Uint8Array(bufferLength)
    console.log("Starting drawing loop with buffer length:", bufferLength)

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw)
      analyser.getByteTimeDomainData(dataArray)

      canvasCtx.fillStyle = "rgb(200, 200, 200)"
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height)

      canvasCtx.lineWidth = 2
      canvasCtx.strokeStyle = "rgb(0, 0, 0)"
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
  }, [recording, analyserRef])

  return (
    <div>
      <h2>Audio Visualizer</h2>
      <canvas ref={canvasRef} width={500} height={200} />
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
    </div>
  )
}

export default AudioVisualizer
