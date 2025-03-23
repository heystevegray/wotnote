"use client"

import { createContext, ReactNode, useContext, useRef, useState } from "react"
import Meyda, { MeydaFeaturesObject } from "meyda"
import { MeydaAnalyzer } from "meyda/dist/esm/meyda-wa"

import { Note } from "../core/Piano" // Assuming you have a Note type in your project.

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

export type DetectedNote = { name: string; octave: number }

const getNotesFromFrequencies = (frequencies: Frequency[]): Note["key"][] => {
  // Convert frequencies to note names.
  return frequencies.map((freq) => {
    const midiNumber = Math.round(69 + 12 * Math.log2(freq.value / 440)) // A4 is MIDI note 69
    const octave = Math.floor(midiNumber / 12) - 1 // Adjust for octave
    const noteIndex = midiNumber % 12
    return `${noteNames[noteIndex]}${octave}` as Note["key"] // Return note name with octave.
  })
}

// Helper to convert a frequency value to a note name.
// This function calculates the semitone offset relative to A4 (440 Hz)
// and returns a note string with an octave determined dynamically.
const detectedFrequencyToNote = (frequency: number): DetectedNote => {
  const A4 = 440
  const semitoneOffset = Math.round(12 * Math.log2(frequency / A4))
  const noteIndex = (semitoneOffset + 69) % 12
  const octave = Math.floor((semitoneOffset + 69) / 12)
  return {
    name: noteNames[noteIndex],
    octave: octave - 1, // Adjust for octave (0-based)
  }
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

const useMeydaAudio = () => {
  const [recording, setRecording] = useState(false)
  const [features, setFeatures] = useState<MeydaFeaturesObject | undefined>(
    undefined
  )
  // States for chord detection.
  const [notes, setNotes] = useState<DetectedNote[]>([])
  const [frequencies, setFrequencies] = useState<Frequency[]>([])
  const [activeNotes, setActiveNotes] = useState<Note[]>([]) // For MIDI conversion if needed.

  // Refs for audio objects.
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const meydaAnalyzerRef = useRef<MeydaAnalyzer | null>(null)
  const analyzerNodeRef = useRef<AnalyserNode | null>(null)

  const startRecording = async () => {
    if (recording) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      const source = audioContext.createMediaStreamSource(stream)
      sourceRef.current = source

      const analyzerNode = audioContext.createAnalyser()
      analyzerNode.smoothingTimeConstant = 0.8
      analyzerNodeRef.current = analyzerNode
      source.connect(analyzerNode)

      // Request amplitudeSpectrum along with rms and spectralCentroid.
      const meydaAnalyzer = Meyda.createMeydaAnalyzer({
        audioContext,
        source,
        analyzer: analyzerNode,
        bufferSize: 2048,
        featureExtractors: ["rms", "spectralCentroid", "amplitudeSpectrum"],
        callback: (extractedFeatures: MeydaFeaturesObject) => {
          setFeatures(extractedFeatures)

          // Apply an RMS threshold to filter out low-level noise.
          const rmsThreshold = 0.01

          // console.log({ rms: extractedFeatures.rms })
          // console.log({ s: extractedFeatures.amplitudeSpectrum })
          //
          if (!extractedFeatures.rms || extractedFeatures.rms < rmsThreshold) {
            setNotes([])
            setFrequencies([])
            return
          }

          // Use amplitudeSpectrum for chord detection.
          if (extractedFeatures.amplitudeSpectrum?.length > 0) {
            const spectrum = extractedFeatures.amplitudeSpectrum
            console.log({ spectrum })

            // Determine the maximum amplitude in the spectrum.
            const maxVal = Math.max(...spectrum)

            console.log({ maxVal })

            // Set a peak threshold at 50% of the maximum.
            const peakThreshold = 0.8 * maxVal
            const peakIndices: number[] = []
            for (let i = 1; i < spectrum.length - 1; i++) {
              if (
                spectrum[i] > peakThreshold &&
                spectrum[i] > spectrum[i - 1] &&
                spectrum[i] > spectrum[i + 1]
              ) {
                peakIndices.push(i)
              }
            }
            const sampleRate = audioContextRef.current?.sampleRate || 44100
            const bufferSize = 2048
            const detectedNotes: DetectedNote[] = []
            const detectedFrequencies: Frequency[] = []
            for (const bin of peakIndices) {
              // Compute the frequency for the bin.
              const freq = (bin * sampleRate) / bufferSize
              console.log({ freq })

              // Use the detectedFrequencyToNote helper to get a note with the proper octave.
              detectedNotes.push(detectedFrequencyToNote(freq))
              detectedFrequencies.push({
                value: freq,
                formatted: `${freq.toFixed(2)} Hz`,
              })
            }
            setNotes(detectedNotes)
            setFrequencies(detectedFrequencies)
            setActiveNotes(getMidiFromFrequencies(detectedFrequencies))
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
    midi: {
      activeNotes: activeNotes,
    },
    audio: {
      notes,
      // frequencies: frequencies.map((freq) => freq.formatted),
      // features,
    },
    analyzerNode: analyzerNodeRef.current,
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
