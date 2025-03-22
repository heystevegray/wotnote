"use client"

import { createContext, ReactNode, useContext, useRef, useState } from "react"
import Meyda, { MeydaFeaturesObject } from "meyda"
import { MeydaAnalyzer } from "meyda/dist/esm/meyda-wa"

import { Note } from "../core/Piano"

const noteNames = [
  "c",
  "c#",
  "d",
  "d#",
  "e",
  "f",
  "f#",
  "g",
  "g#",
  "a",
  "a#",
  "b",
]

// Define a type for frequency values.
export type Frequency = {
  value: number
  formatted: string // e.g., "440.00 Hz"
}

const getMidiFromFrequencies = (frequencies: Frequency[]): Note[] => {
  // Convert frequencies to MIDI note numbers.
  return frequencies.map((freq) => {
    const midiNumber = Math.round(69 + 12 * Math.log2(freq.value / 440)) // A4 is MIDI note 69
    return {
      key: getNotesFromFrequencies([freq])[0] as Note["key"], // Get the note name from frequency.
      code: midiNumber,
    }
  })
}

// Helper function to compute frequency from note name with a default octave.
// For simplicity, we assume the note string is like "C4", "A4", etc.
const getFrequencyFromNote = (noteWithOctave: string): number => {
  // Extract note letter(s) and octave.
  const match = noteWithOctave.match(/^([a-g]#?)(\d)$/)
  if (!match) return 0
  const [, notePart, octaveStr] = match
  const octave = parseInt(octaveStr, 10)
  // MIDI number: (octave+1)*12 + note index.
  const noteIndex = noteNames.indexOf(notePart)
  const midiNumber = (octave + 1) * 12 + noteIndex
  return 440 * Math.pow(2, (midiNumber - 69) / 12)
}

const getFrequencyFromChroma = (chromaValue: number): number => {
  // Assuming chromaValue is a value from 0 to 1 representing the strength of a note.
  // Map it to a frequency using a simple linear scale for demonstration.
  // This is a placeholder; you may want to use a more sophisticated mapping.
  const baseFrequency = 440 // A4
  return baseFrequency * (1 + chromaValue) // Adjust as needed.
}

const getNotesFromFrequencies = (frequencies: Frequency[]): Note["key"][] => {
  // Convert frequencies to note names.
  return frequencies.map((freq) => {
    const midiNumber = Math.round(69 + 12 * Math.log2(freq.value / 440)) // A4 is MIDI note 69
    const octave = Math.floor(midiNumber / 12) - 1 // Adjust for octave
    const noteIndex = midiNumber % 12
    return `${noteNames[noteIndex]}${octave}` as Note["key"] // Return note name with octave.
  })
}

const useMeydaAudio = () => {
  const [recording, setRecording] = useState(false)
  const [features, setFeatures] = useState<MeydaFeaturesObject | undefined>(
    undefined
  )
  // New states for chroma-based note recognition.
  const [notes, setNotes] = useState<string[]>([])
  const [frequencies, setFrequencies] = useState<Frequency[]>([])
  const [activeNotes, setActiveNotes] = useState<Note[]>([])

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

          // Check the RMS value (volume threshold). Adjust the threshold as needed.
          const rmsThreshold = 0.02
          if (!extractedFeatures.rms || extractedFeatures.rms < rmsThreshold) {
            // If volume is too low, clear chroma-based detections.
            setNotes([])
            setFrequencies([])
            return
          }

          // Process chroma data for polyphonic (chord) detection.
          if (
            extractedFeatures.chroma &&
            Array.isArray(extractedFeatures.chroma)
          ) {
            const chroma = extractedFeatures.chroma as number[]
            // Use a relative threshold based on the maximum value in the chroma vector.
            const maxChroma = Math.max(...chroma)
            const threshold = 1 * maxChroma
            const activeFrequencies: Frequency[] = []
            const notes = []

            // For each of the 12 pitch classes.
            for (let index = 0; index < chroma.length; index++) {
              if (chroma[index] >= threshold) {
                const noteStr = noteNames[index]
                notes.push(noteStr)

                // const freq = getFrequencyFromChroma(chroma[index])
                const freq = getFrequencyFromNote(`${noteStr}4`) // Assuming octave 4 for simplicity.
                activeFrequencies.push({
                  value: freq,
                  formatted: `${freq.toFixed(2)} Hz`,
                })
              }
            }
            // console.log("notes", notes)
            const activeNotes = getMidiFromFrequencies(activeFrequencies)
            console.log(
              "activeNotes",
              activeNotes.map((n) => n.key)
            )
            console.log(
              "activeFrequencies",
              activeFrequencies.map((f) => f.value)
            )

            setNotes(notes)
            setActiveNotes(activeNotes)
            // console.log({ activeFrequencies })
            setFrequencies(activeFrequencies)
          } else {
            setNotes([])
            setFrequencies([])
            setActiveNotes([])
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
    midi: {
      activeNotes: activeNotes,
    },
    audio: {
      // rms: features?.rms ?? 0, // Default to 0 if undefined.
      notes: notes.sort(), // Sort notes for consistent display.
      frequencies: frequencies.map((freq) => freq.formatted).sort(),
      // chroma: features?.chroma ?? [], // Default to empty array if undefined.
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
