"use client"

import { createContext, ReactNode, useContext, useRef, useState } from "react"
import Meyda, { MeydaFeaturesObject } from "meyda"
import { MeydaAnalyzer } from "meyda/dist/esm/meyda-wa"

import { MidiNote } from "../core/keyboard"

export type PitchClass =
  | "C"
  | "C♯"
  | "D"
  | "D♯"
  | "E"
  | "F"
  | "F♯"
  | "G"
  | "G♯"
  | "A"
  | "A♯"
  | "B"

const pitchClasses: PitchClass[] = [
  "C",
  "C♯",
  "D",
  "D♯",
  "E",
  "F",
  "F♯",
  "G",
  "G♯",
  "A",
  "A♯",
  "B",
]

// Define a type for frequency values.
export type Frequency = {
  value: number
  formatted: string // e.g., "440.00 Hz"
}

const useMeydaAudio = () => {
  const [recording, setRecording] = useState(false)
  const [pitchClass, setPitchClass] = useState<PitchClass | undefined>(
    undefined
  )
  const [midiNotes, setMidiNotes] = useState<MidiNote[]>([])
  const [, setFeatures] = useState<MeydaFeaturesObject | undefined>(undefined)

  // Refs for audio objects.
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const meydaAnalyzerRef = useRef<MeydaAnalyzer | null>(null)
  const analyzerNodeRef = useRef<AnalyserNode | null>(null)
  const thresholdRef = useRef(0.3)

  const handleSliderChange = (value: number) => {
    thresholdRef.current = value
  }

  /**
   *  Calculates the how much of each chromatic pitch class (C, C♯, D, D♯, E, F, F♯, G, G♯, A, A♯, B
   * exists in the signal.
   *
   * What Is It Used For: Often used to analyze the harmonic content of recorded music, such as
   * in chord or key detection.
   *
   * Range: 0.0 - 1.0 for each pitch class.
   *
   * @see https://meyda.js.org/audio-features#chroma
   */
  const getDominantPitchClass = (extractedFeatures: MeydaFeaturesObject) => {
    const chroma = extractedFeatures.chroma
    if (chroma) {
      const maxIndex = chroma.indexOf(Math.max(...chroma))
      return pitchClasses[maxIndex]
    } else {
      return undefined
    }
  }

  const getActiveNotesFromSpectrum = ({
    extractedFeatures,
    sampleRate,
    bufferSize,
    thresholdRatio,
  }: {
    extractedFeatures: MeydaFeaturesObject
    sampleRate: number
    bufferSize: number
    /**
     * Ratio of max amplitude to use as threshold for peak detection
     */
    thresholdRatio: number
  }): MidiNote[] => {
    const spectrum = extractedFeatures.amplitudeSpectrum
    if (!spectrum) return []

    console.log({ thresholdRatio })

    const maxVal = Math.max(...spectrum)
    const threshold = thresholdRatio * maxVal

    const midiNotes: MidiNote[] = []

    for (let index = 1; index < spectrum.length - 1; index++) {
      const amp = spectrum[index]
      const isPeak =
        amp > threshold &&
        amp > spectrum[index - 1] &&
        amp > spectrum[index + 1]
      if (isPeak) {
        const freq = (index * sampleRate) / bufferSize
        const midiCode = Math.round(69 + 12 * Math.log2(freq / 440))
        const pitchIndex = midiCode % 12
        const pitchKey = pitchClasses[pitchIndex] as MidiNote["key"]

        midiNotes.push({ code: midiCode, key: pitchKey })
      }
    }

    return midiNotes
  }

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
        featureExtractors: ["rms", "chroma", "amplitudeSpectrum"],
        callback: (extractedFeatures: MeydaFeaturesObject) => {
          setFeatures(extractedFeatures)

          // Inside your Meyda callback after verifying that RMS > threshold
          const rmsThreshold = 0.01
          if (!extractedFeatures.rms || extractedFeatures.rms < rmsThreshold) {
            setPitchClass(undefined)
            return
          }

          setPitchClass(getDominantPitchClass(extractedFeatures))

          const sampleRate = audioContextRef.current?.sampleRate ?? 44100
          const midiNotes = getActiveNotesFromSpectrum({
            extractedFeatures,
            sampleRate,
            bufferSize: 2048,
            thresholdRatio: thresholdRef.current,
          })
          setMidiNotes(midiNotes)
        },
      })

      meydaAnalyzer.start()
      meydaAnalyzerRef.current = meydaAnalyzer

      setRecording(true)
      console.debug("Meyda analyzer started.")
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
    setPitchClass(undefined)
    console.debug("Meyda analyzer stopped and audio context closed.")
  }

  return {
    recording,
    audio: {
      pitchClass,
      // features,
    },
    midi: {
      midiNotes,
    },
    settings: {
      thresholdRatio: thresholdRef.current,
      handleSliderChange,
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
