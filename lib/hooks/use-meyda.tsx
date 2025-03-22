"use client"

import { createContext, ReactNode, useContext, useRef, useState } from "react"
import Meyda from "meyda"

// Helper function to convert frequency to a note name.
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

const useMeydaAudio = () => {
  const [recording, setRecording] = useState(false)
  const [features, setFeatures] = useState<any>({})
  const [pitch, setPitch] = useState<number | null>(null)
  const [frequency, setFrequency] = useState<number | null>(null)
  const [note, setNote] = useState<string | null>(null)

  // Refs to store audio context, source, analyzer node, and Meyda analyzer.
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const meydaAnalyzerRef = useRef<any>(null)
  const analyzerNodeRef = useRef<AnalyserNode | null>(null)

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

      // Create an AnalyserNode for additional visualization needs and store it in a ref.
      const analyzerNode = audioContext.createAnalyser()
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
        callback: (extractedFeatures: any) => {
          // Extract features from the callback.
          setFeatures(extractedFeatures)
          // Use the spectral centroid as a proxy for the dominant frequency.
          const currentFrequency = extractedFeatures.spectralCentroid
          if (currentFrequency) {
            setFrequency(currentFrequency)
            setPitch(currentFrequency) // Using spectral centroid as "pitch" here.
            setNote(detectedFrequencyToNote(currentFrequency))
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
    setFeatures({})
    setPitch(null)
    setFrequency(null)
    setNote(null)
    console.log("Meyda analyzer stopped and audio context closed.")
  }

  return {
    recording,
    features, // raw features extracted by Meyda
    pitch, // estimated pitch (in this case, the spectral centroid)
    frequency, // frequency value from the spectral centroid
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
