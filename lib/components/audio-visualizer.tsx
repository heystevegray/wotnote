import React, { useEffect, useRef } from "react"

const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    const startVisualization = async () => {
      try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        // Create an AudioContext
        audioContextRef.current = new ((window.AudioContext ||
          (window as any).webkitAudioContext) as typeof AudioContext)()
        // Create a MediaStream source from the microphone stream
        const source = audioContextRef.current.createMediaStreamSource(stream)
        // Create an AnalyserNode for audio processing
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 2048
        source.connect(analyserRef.current)

        const canvas = canvasRef.current
        if (!canvas) return
        const canvasCtx = canvas.getContext("2d")
        if (!canvasCtx) return

        const bufferLength = analyserRef.current.fftSize
        const dataArray = new Uint8Array(bufferLength)

        // Function to draw the waveform on the canvas
        const draw = () => {
          animationIdRef.current = requestAnimationFrame(draw)
          analyserRef.current!.getByteTimeDomainData(dataArray)

          // Clear the canvas
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
      } catch (error) {
        console.error("Error accessing microphone:", error)
      }
    }

    startVisualization()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return (
    <div>
      <h2>Audio Visualizer</h2>
      <canvas ref={canvasRef} width={500} height={200} />
    </div>
  )
}

export default AudioVisualizer
