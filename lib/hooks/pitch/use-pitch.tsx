import { useEffect, useState } from "react"
import { toast } from "sonner"

// Helper function to convert frequency to a note
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

const usePitch = () => {
  const [recording, setRecording] = useState(false)
  const [pitch, setPitch] = useState<string | null>(null)
  const [frequency, setFrequency] = useState<number | null>(null)

  const requestPermission = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        toast.success("Microphone access granted")
      })
      .catch((error) => {
        toast.error("Error accessing microphone:", {
          description: (error as Error).message,
        })
      })
  }

  const stopRecording = () => {
    setRecording(false)
    setPitch(null)
    setFrequency(null)
  }

  const startRecording = () => {
    setRecording(true)
  }

  function autoCorrelate(
    buffer: Float32Array,
    sampleRate: number
  ): [number, number] {
    let SIZE = buffer.length
    let MAX_SAMPLES = Math.floor(SIZE / 2)
    let bestOffset = -1
    let bestCorrelation = 0
    let rms = 0

    for (let i = 0; i < SIZE; i++) {
      rms += buffer[i] * buffer[i]
    }
    rms = Math.sqrt(rms / SIZE)

    if (rms < 0.01) {
      return [-1, 0] // Too much noise
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

    if (bestCorrelation > 0.01) {
      let detectedFrequency = sampleRate / bestOffset
      return [detectedFrequency, bestCorrelation]
    }

    return [-1, 0] // No pitch detected
  }

  useEffect(() => {
    let audioContext: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let source: MediaStreamAudioSourceNode | null = null
    let rafId: number | null = null

    const getMicrophone = async () => {
      try {
        if (!recording) return

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        audioContext = new AudioContext()
        analyser = audioContext.createAnalyser()
        source = audioContext.createMediaStreamSource(stream)

        analyser.fftSize = 2048 // Adjust for accuracy
        source.connect(analyser)

        const buffer = new Float32Array(analyser.fftSize)

        const detectPitch = () => {
          if (!analyser) return

          analyser.getFloatTimeDomainData(buffer)
          const [detectedFrequency, clarity] = autoCorrelate(
            buffer,
            audioContext?.sampleRate ?? 0
          )

          console.log({ detectedFrequency, clarity })

          if (clarity > 0.9) {
            setFrequency(detectedFrequency)
            setPitch(detectedFrequencyToNote(detectedFrequency))
          }

          rafId = requestAnimationFrame(detectPitch)
        }

        detectPitch()
        setRecording(true)
      } catch (error) {
        toast.error("Error accessing microphone:", {
          description: (error as Error).message,
        })
      }
    }

    getMicrophone()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (audioContext) audioContext.close()
    }
  }, [recording])

  return {
    pitch,
    frequency,
    recording,
    requestPermission,
    startRecording,
    stopRecording,
  }
}

export default usePitch
