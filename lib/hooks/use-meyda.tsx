"use client"

import { createContext, ReactNode, useContext, useRef, useState } from "react"
import Meyda, { MeydaFeaturesObject } from "meyda"
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

// Define a type for frequency values.
export type Frequency = {
  value: number
  formatted: string // e.g., "440.00 Hz"
}

// Helper function to compute frequency from note name with a default octave.
// For simplicity, we assume the note string is like "C4", "A4", etc.
const getFrequencyFromNote = (noteWithOctave: string): number => {
  // Extract note letter(s) and octave.
  const match = noteWithOctave.match(/^([A-G]#?)(\d)$/)
  if (!match) return 0
  const [, notePart, octaveStr] = match
  const octave = parseInt(octaveStr, 10)
  // MIDI number: (octave+1)*12 + note index.
  const noteIndex = noteNames.indexOf(notePart)
  const midiNumber = (octave + 1) * 12 + noteIndex
  return 440 * Math.pow(2, (midiNumber - 69) / 12)
}

const useMeydaAudio = () => {
  const [recording, setRecording] = useState(false)
  const [features, setFeatures] = useState<MeydaFeaturesObject | undefined>(
    undefined
  )
  // New states for chroma-based note recognition.
  const [notes, setNotes] = useState<string[]>([])
  const [frequencies, setFrequencies] = useState<Frequency[]>([])

  // Refs to store audio context, source, analyzer node, and Meyda analyzer.
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const meydaAnalyzerRef = useRef<MeydaAnalyzer | null>(null)
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

      // Create an AnalyserNode for visualization and smoothing.
      const analyzerNode = audioContext.createAnalyser()
      // Set the smoothingTimeConstant (range 0 to 1, higher values smooth more).
      analyzerNode.smoothingTimeConstant = 0.8
      analyzerNodeRef.current = analyzerNode
      // Connect the source to the analyzer node.
      source.connect(analyzerNode)

      // Initialize Meyda analyzer using the audio context, source, and providing the analyzer node.
      const meydaAnalyzer = Meyda.createMeydaAnalyzer({
        audioContext,
        source,
        analyzer: analyzerNode,
        bufferSize: 2048,
        featureExtractors: ["rms", "spectralCentroid", "chroma"],
        callback: (extractedFeatures: MeydaFeaturesObject) => {
          // Set raw features.
          setFeatures(extractedFeatures)

          // Process chroma data for polyphonic (chord) detection.
          if (
            extractedFeatures.chroma &&
            Array.isArray(extractedFeatures.chroma)
          ) {
            const chroma = extractedFeatures.chroma as number[]
            // Use a relative threshold based on the maximum value in the chroma vector.
            const maxChroma = Math.max(...chroma)
            const threshold = 0.6 * maxChroma
            const activeNotes: string[] = []
            const activeFrequencies: Frequency[] = []
            // For each of the 12 pitch classes.
            for (let i = 0; i < chroma.length; i++) {
              if (chroma[i] >= threshold) {
                // Append a default octave (e.g., 4) to the note.
                const noteStr = `${noteNames[i]}4`
                activeNotes.push(noteStr)
                // Compute frequency for the note using the helper.
                const freq = getFrequencyFromNote(noteStr)
                activeFrequencies.push({
                  value: freq,
                  formatted: `${freq.toFixed(2)} Hz`,
                })
              }
            }
            setNotes(activeNotes)
            setFrequencies(activeFrequencies)
          } else {
            setNotes([])
            setFrequencies([])
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
    setNotes([])
    setFrequencies([])
    console.log("Meyda analyzer stopped and audio context closed.")
  }

  return {
    recording,
    audio: {
      notes,
      frequencies: frequencies.map((freq) => freq.formatted), // Format frequencies for display.
    },
    analyzerNode: analyzerNodeRef.current, // Expose the AnalyzerNode for visualization.
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
