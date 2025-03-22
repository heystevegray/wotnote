"use client"

import { createContext, ReactNode, useContext, useRef, useState } from "react"
import Meyda, { MeydaFeaturesObject } from "meyda" // Make sure to install Meyda via npm/yarn
import { MeydaAnalyzer } from "meyda/dist/esm/meyda-wa"

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

// Helper function to convert frequency to a note name.
const detectedFrequencyToNote = (frequency: number) => {
  const A4 = 440
  const semitoneOffset = Math.round(12 * Math.log2(frequency / A4))
  const noteIndex = (semitoneOffset + 69) % 12
  const octave = Math.floor((semitoneOffset + 69) / 12)
  return `${noteNames[noteIndex]}${octave}`
}

const useMeydaAudio = () => {
  const [recording, setRecording] = useState(false)
  const [features, setFeatures] = useState<MeydaFeaturesObject | undefined>(
    undefined
  )
  const [pitch, setPitch] = useState<number | null>(null)
  const [frequency, setFrequency] = useState<number | null>(null)
  const [note, setNote] = useState<string | null>(null)

  // Refs to store audio context, source, analyzer node, and Meyda analyzer.
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const meydaAnalyzerRef = useRef<MeydaAnalyzer | null>(null)
  const analyzerNodeRef = useRef<AnalyserNode | null>(null)
  // Ref to hold our smoothed spectral centroid value.
  const smoothedCentroidRef = useRef<number>(0)

  const startRecording = async () => {
    if (recording) return
    try {
      // Request microphone access.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      // Create an audio source from the microphone.
      const source = audioContext.createMediaStreamSource(stream)
      sourceRef.current = source

      // Create an AnalyserNode for visualization and smoothing.
      const analyzerNode = audioContext.createAnalyser()
      // Set the smoothingTimeConstant (range 0 to 1, with higher values smoothing more).
      analyzerNode.smoothingTimeConstant = 0.8
      analyzerNodeRef.current = analyzerNode
      // Connect the source to the analyzer node.
      source.connect(analyzerNode)

      // Initialize Meyda analyzer using the audio context, source, and explicitly providing the analyzer node.
      const meydaAnalyzer = Meyda.createMeydaAnalyzer({
        audioContext,
        source,
        analyzer: analyzerNode,
        bufferSize: 2048,
        featureExtractors: ["rms", "spectralCentroid", "chroma"],
        callback: (extractedFeatures: MeydaFeaturesObject) => {
          // Extract features from the callback.
          setFeatures(extractedFeatures)
          // Use the spectral centroid as a proxy for the dominant frequency.
          const currentFrequency = extractedFeatures.spectralCentroid
          if (currentFrequency) {
            // Apply a simple low-pass filter to smooth the value.
            const alpha = 0.2 // Smoothing factor; lower means smoother.
            // Initialize smoothedCentroidRef if it hasn't been set yet.
            if (smoothedCentroidRef.current === 0) {
              smoothedCentroidRef.current = currentFrequency
            }
            const newSmoothed =
              alpha * currentFrequency +
              (1 - alpha) * smoothedCentroidRef.current
            smoothedCentroidRef.current = newSmoothed

            setFrequency(newSmoothed)
            setPitch(newSmoothed) // Using spectral centroid as "pitch" here.
            setNote(detectedFrequencyToNote(newSmoothed))
          } else {
            setFrequency(null)
            setPitch(null)
            setNote(null)
          }
        },
      })
      meydaAnalyzer.start()
      meydaAnalyzerRef.current = meydaAnalyzer

      setRecording(true)
      console.log("Meyda analyzer started.")
    } catch (error) {
      console.error("Error starting Meyda analyzer:", error)
    }
  }

  const stopRecording = () => {
    if (meydaAnalyzerRef.current) {
      meydaAnalyzerRef.current.stop()
      meydaAnalyzerRef.current = null
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (analyzerNodeRef.current) {
      analyzerNodeRef.current.disconnect()
      analyzerNodeRef.current = null
    }
    setRecording(false)
    setFeatures(undefined)
    setPitch(null)
    setFrequency(null)
    setNote(null)
    console.log("Meyda analyzer stopped and audio context closed.")
  }

  return {
    recording,
    features, // raw features extracted by Meyda
    pitch, // smoothed spectral centroid used as pitch
    frequency, // smoothed frequency value
    note, // converted note name (e.g., "A4")
    analyzerNode: analyzerNodeRef.current, // Expose the AnalyzerNode for visualization
    startRecording,
    stopRecording,
  }
}

//
// Create a context for the Meyda audio state.
//
type MeydaContextType = ReturnType<typeof useMeydaAudio>
const MeydaContext = createContext<MeydaContextType | undefined>(undefined)

export const MeydaProvider = ({ children }: { children: ReactNode }) => {
  const meydaState = useMeydaAudio()
  return (
    <MeydaContext.Provider value={meydaState}>{children}</MeydaContext.Provider>
  )
}

export const useMeyda = () => {
  const context = useContext(MeydaContext)
  if (context === undefined) {
    throw new Error("useMeyda must be used within a MeydaProvider")
  }
  return context
}

export default useMeydaAudio
