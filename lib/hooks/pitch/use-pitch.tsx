import { useEffect, useState } from "react"
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

  // Compute root mean square to determine the overall signal level.
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i]
  }
  rms = Math.sqrt(rms / SIZE)
  if (rms < 0.01) {
    return [-1, 0] // Signal too weak (e.g., silence or noise).
  }

  console.log("RMS value:", rms)

  let lastCorrelation = 1
  // Try different offsets to find the one with the highest correlation.
  for (let offset = 0; offset < MAX_SAMPLES; offset++) {
    let correlation = 0
    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += buffer[i] * buffer[i + offset]
    }
    correlation = correlation / MAX_SAMPLES

    // Use a threshold to determine if a reliable pitch is detected.
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

  return [-1, 0] // No clear pitch was detected.
}

const usePitch = () => {
  const [recording, setRecording] = useState(false)
  const [pitch, setPitch] = useState<string | null>(null)
  const [frequency, setFrequency] = useState<number | null>(null)

  // Request microphone permission.
  const requestPermission = ({ onSuccess }: { onSuccess: () => void }) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        toast.success("Microphone access granted")
        onSuccess()
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
    toast.info("Recording stopped")
  }

  const startRecording = () => {
    requestPermission({
      onSuccess: () => {
        setRecording(true)
      },
    })
  }

  useEffect(() => {
    let audioContext: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let source: MediaStreamAudioSourceNode | null = null
    let rafId: number | null = null

    // Function to get microphone access and start processing audio.
    const getMicrophone = async () => {
      try {
        // Only proceed if recording is enabled.
        if (!recording) return

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        audioContext = new AudioContext()
        analyser = audioContext.createAnalyser()
        source = audioContext.createMediaStreamSource(stream)

        analyser.fftSize = 2048 // FFT size can be adjusted for accuracy.
        source.connect(analyser)

        const buffer = new Float32Array(analyser.fftSize)
        console.log("Buffer sample:", buffer.slice(0, 10))

        // Recursive function to continuously detect pitch.
        const detectPitch = () => {
          if (!analyser) return

          analyser.getFloatTimeDomainData(buffer)

          // Log the first few samples and computed RMS
          const currentRMS = Math.sqrt(
            buffer.reduce((acc, cur) => acc + cur * cur, 0) / buffer.length
          )
          console.log("Buffer sample:", buffer.slice(0, 10))
          console.log("Current RMS:", currentRMS)

          const [detectedFrequency, clarity] = autoCorrelate(
            buffer,
            audioContext!.sampleRate
          )

          console.log({ detectedFrequency, clarity })

          // Update the frequency and pitch state if the detection is clear.
          if (clarity > 0.9) {
            setFrequency(detectedFrequency)
            setPitch(detectedFrequencyToNote(detectedFrequency))
          }
          rafId = requestAnimationFrame(detectPitch)
        }

        detectPitch()
      } catch (error) {
        toast.error("Error accessing microphone:", {
          description: (error as Error).message,
        })
      }
    }

    getMicrophone()

    // Cleanup: cancel the animation frame and close the audio context.
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (audioContext) audioContext.close()
    }
  }, [recording])

  return {
    pitch,
    frequency,
    recording,
    startRecording,
    stopRecording,
  }
}

export default usePitch
