import { useRef, useState } from "react"
import { toast } from "sonner"

// Helper function to convert a detected frequency to a musical note.
const detectedFrequencyToNote = (frequency: number) => {
  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ]
  const A4 = 440
  const semitoneOffset = Math.round(12 * Math.log2(frequency / A4))
  const noteIndex = (semitoneOffset + 69) % 12
  const octave = Math.floor((semitoneOffset + 69) / 12)
  return `${noteNames[noteIndex]}${octave}`
}

// Auto-correlation algorithm to estimate the pitch from a buffer of audio data.
function autoCorrelate(
  buffer: Float32Array,
  sampleRate: number
): [number, number] {
  const SIZE = buffer.length
  const MAX_SAMPLES = Math.floor(SIZE / 2)
  let bestOffset = -1
  let bestCorrelation = 0
  let rms = 0

  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i]
  }
  rms = Math.sqrt(rms / SIZE)
  if (rms < 0.01) {
    return [-1, 0] // Signal too weak.
  }

  let lastCorrelation = 1
  for (let offset = 0; offset < MAX_SAMPLES; offset++) {
    let correlation = 0
    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += buffer[i] * buffer[i + offset]
    }
    correlation = correlation / MAX_SAMPLES

    if (correlation > 0.9 && correlation > lastCorrelation) {
      bestCorrelation = correlation
      bestOffset = offset
    }
    lastCorrelation = correlation
  }

  if (bestCorrelation > 0.01 && bestOffset !== -1) {
    const detectedFrequency = sampleRate / bestOffset
    return [detectedFrequency, bestCorrelation]
  }
  return [-1, 0]
}

const usePitch = () => {
  const [recording, setRecording] = useState(false)
  const [pitch, setPitch] = useState<string | null>(null)
  const [frequency, setFrequency] = useState<number | null>(null)
  // Expose the analyser node using a ref.
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startRecording = async () => {
    if (recording) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      toast.success("Microphone access granted")
      streamRef.current = stream
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      analyserRef.current = analyser
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      setRecording(true)

      console.log("Audio context and analyser initialized.")

      const buffer = new Float32Array(analyser.fftSize)

      const detectPitch = () => {
        if (!analyser) return
        analyser.getFloatTimeDomainData(buffer)
        const [detectedFrequency, clarity] = autoCorrelate(
          buffer,
          audioContext.sampleRate
        )
        console.log({ detectedFrequency, clarity })

        if (clarity > 0.9) {
          setFrequency(detectedFrequency)
          setPitch(detectedFrequencyToNote(detectedFrequency))
        } else {
          setFrequency(null)
          setPitch(null)
        }

        requestAnimationFrame(detectPitch)
      }

      detectPitch()
    } catch (error) {
      toast.error("Error accessing microphone:", {
        description: (error as Error).message,
      })
    }
  }

  const stopRecording = () => {
    setRecording(false)
    setPitch(null)
    setFrequency(null)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    analyserRef.current = null
    console.log("Recording stopped and audio context closed.")
  }

  return {
    pitch,
    frequency,
    recording,
    startRecording,
    stopRecording,
    analyserRef,
  }
}

export default usePitch
