// https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-midi-api/

import { useEffect, useRef, useState } from "react"
import { Chord, chord as tonalChord } from "@tonaljs/chord"

type ChordQuality =
  | "Major" // Major
  | "min" // Minor
  | "dim" // Diminished
  | "aug" // Augmented
  | "Maj 7th" // Major 7
  | "min 7th" // Minor 7
  | "7" // Dominant 7 (C7)
  | "dim7" // Diminished 7
  | "m7♭5" // Half-Diminished 7 (also written as "ø7")
  | "6" // Major 6
  | "m6" // Minor 6
  | "sus2" // Suspended 2
  | "sus4" // Suspended 4
  | "9" // 9th
  | "Maj 9th" // Major 9
  | "min9" // Minor 9
  | "11" // 11th
  | "Maj 11th" // Major 11
  | "min 11th" // Minor 11
  | "13" // 13th
  | "Maj13" // Major 13
  | "min13" // Minor 13
  | "add9" // Add 9
  | "add11" // Add 11
  | "add13" // Add 13
  | "Maj 3rd" // Major 3rd
  | "min 3rd" // Minor 3rd
  | "perfect 4" // Perfect 4th
  | "tritone" // tritone
  | "perfect 5" // Power Chord (C5)
  | "aug5" // Augmented 5th
  | "dim5" // Diminished 5th
  | "Maj 6th" // Major 6th
  | "min 6th" // Minor 6th
  | "octave" // Octave

export interface MIDInterface extends ChordProps {
  midiAccess: WebMidi.MIDIAccess | undefined
  midiConnectionEvent: WebMidi.MIDIConnectionEvent | undefined
  midiSupported: boolean | undefined
  midiPort?: WebMidi.MIDIPort | undefined
  midi: MidiNote
  inputs: Device[]
}

interface ChordProps {
  chords: {
    activeNotes: Key[]
    chord: ActiveChord | null
    details?: Chord
  }
}

interface Key {
  midiNote: number
  name: string
  octave: number
}

interface MidiNote extends Key {
  velocity: number
  on: boolean
}

interface Device {
  deviceName: string
  id: string
  connection: string
  name: string
  manufacturer: string
  state: string
  type: string
  version: string
}

type ChordType = {
  tonic: string
  quality: ChordQuality
}

type Inversion = "root" | "first" | "second" | "third"

type ActiveChord = {
  inversion: Inversion
} & ChordType

type NoteInfo = {
  name: string
  sharp?: string
  flat?: string
}

const NOTES: Record<number, NoteInfo> = {
  0: { name: "C", sharp: "C♯" },
  1: { name: "C♯", flat: "D♭" },
  2: { name: "D", sharp: "D♯" },
  3: { name: "D♯", flat: "E♭" },
  4: { name: "E", flat: "F♭" }, // F♭ is enharmonic to E
  5: { name: "F", sharp: "F♯" },
  6: { name: "F♯", flat: "G♭" },
  7: { name: "G", sharp: "G♯" },
  8: { name: "G♯", flat: "A♭" },
  9: { name: "A", sharp: "A♯" },
  10: { name: "A♯", flat: "B♭" },
  11: { name: "B", flat: "C♭" }, // C♭ is enharmonic to B
}

// Intervals for different chords
const CHORD_INTERVALS: Record<ChordQuality, number[]> = {
  // **Basic Triads**
  Major: [0, 4, 7], // Major
  min: [0, 3, 7], // Minor
  dim: [0, 3, 6], // Diminished
  aug: [0, 4, 8], // Augmented

  // **Seventh Chords**
  "Maj 7th": [0, 4, 7, 11], // Major 7
  "min 7th": [0, 3, 7, 10], // Minor 7
  "7": [0, 4, 7, 10], // Dominant 7 (C7)
  dim7: [0, 3, 6, 9], // Diminished 7
  "m7♭5": [0, 3, 6, 10], // Half-Diminished 7 (Cm7♭5 / Cø7)

  // **Sixth Chords**
  "6": [0, 4, 7, 9], // Major 6
  m6: [0, 3, 7, 9], // Minor 6

  // **Suspended Chords**
  sus2: [0, 2, 7], // Suspended 2
  sus4: [0, 5, 7], // Suspended 4

  // **Extended Chords**
  "9": [0, 4, 7, 10, 14], // 9th
  "Maj 9th": [0, 4, 7, 11, 14], // Major 9
  min9: [0, 3, 7, 10, 14], // Minor 9
  "11": [0, 4, 7, 10, 14, 17], // 11th
  "Maj 11th": [0, 4, 7, 11, 14, 17], // Major 11
  "min 11th": [0, 3, 7, 10, 14, 17], // Minor 11
  "13": [0, 4, 7, 10, 14, 17, 21], // 13th
  Maj13: [0, 4, 7, 11, 14, 17, 21], // Major 13
  min13: [0, 3, 7, 10, 14, 17, 21], // Minor 13

  // **Added-Tone Chords**
  add9: [0, 4, 7, 14], // Add 9
  add11: [0, 4, 7, 17], // Add 11
  add13: [0, 4, 7, 21], // Add 13

  // **All Two-Note Chords (Dyads)**
  "Maj 3rd": [0, 4], // Major 3rd
  "min 3rd": [0, 3], // Minor 3rd
  "perfect 4": [0, 5], // Perfect 4th
  tritone: [0, 6], // Perfect 4th
  "perfect 5": [0, 7], // Perfect 5th
  aug5: [0, 8], // Augmented 5th
  dim5: [0, 6], // Diminished 5th
  "Maj 6th": [0, 9], // Major 6th
  "min 6th": [0, 8], // Minor 6th

  octave: [0, 12], // Octave
}

/**
 * Generate all possible chord permutations for all 12 roots.
 * @example
  '0,4,7': [
    {
      tonic: 'C',
      quality: 'Major',
    },
    {
      tonic: 'C♯',
      quality: 'Major',
    },
  ]
 * @example 
 '0,3': [
    { tonic: 'C', quality: 'min3' },
    { tonic: 'C♯', quality: 'min3' },
    { tonic: 'D♯', quality: 'Maj6' },
    { tonic: 'E♭', quality: 'Maj6' }
  ]
 * 
 */
const generateChordDictionary = (): Record<string, ChordType[]> => {
  const chordDict: Record<string, ChordType[]> = {}

  for (let root = 0; root < 12; root++) {
    const noteInfo = NOTES[root] // Get note info (C, C♯, D♭, etc.)

    for (const [quality, intervals] of Object.entries(CHORD_INTERVALS)) {
      const semitones = intervals
        .map((interval) => (root + interval) % 12)
        .sort((a, b) => a - b)
      const key = semitones.join(",")

      if (!chordDict[key]) chordDict[key] = []

      // Store both sharp and flat spellings for selection later
      chordDict[key].push(
        { tonic: noteInfo.name, quality: quality as ChordQuality }, // Default spelling
        ...(noteInfo.flat
          ? [{ tonic: noteInfo.flat, quality: quality as ChordQuality }]
          : []), // Flat version if available
        ...(noteInfo.sharp
          ? [{ tonic: noteInfo.sharp, quality: quality as ChordQuality }]
          : []) // Sharp version if available
      )
    }
  }

  return chordDict
}

// ✅ Precompute permutations at startup
const CHORD_PERMUTATIONS = generateChordDictionary()
console.log(CHORD_PERMUTATIONS)

/**
 * Get the inversion of a chord.
 */
const getInversion = (midiNotes: Set<number>): Inversion => {
  if (midiNotes.size < 3) return "root" // Inversions only apply to triads+

  // Convert MIDI notes to pitch classes while keeping the played order
  const semitones = [...midiNotes].map((note) => note % 12)

  // Compute the intervals **based on the played order**
  const intervals = semitones.map((note, index, arr) =>
    index === 0 ? 0 : (note - arr[0] + 12) % 12
  )

  // Convert to interval pattern string
  const pattern = intervals.join(",")

  // Recognizing inversion patterns based on **played order**
  if (pattern === "0,4,7" || pattern === "0,3,7" || pattern === "0,3,6")
    return "root" // Root position
  if (pattern === "0,3,8" || pattern === "0,4,9") return "first" // First inversion
  if (pattern === "0,5,9" || pattern === "0,6,10") return "second" // Second inversion

  return "root" // Default if unknown pattern
}

/**
 * Convert MIDI notes to sorted, unique semi-tone intervals (0-11).
 *
 * @example getSemitones(new Set([60, 64, 67])) // [0, 4, 7]
 * @example getSemitones(new Set([60, 64, 67, 71])) // [0, 4, 7, 11]
 */
const getSemitones = (midiNotes: Set<number>) => {
  return [...new Set([...midiNotes].map((midiNote) => midiNote % 12))].sort(
    (a, b) => a - b
  )
}

// Flat keys (more common in flats)
const FLAT_KEYS = new Set([1, 3, 5, 6, 8, 10]) // D♭, E♭, F, G♭, A♭, B♭

// Sharp keys (more common in sharps)
const SHARP_KEYS = new Set([1, 4, 6, 8, 9, 11]) // C♯, E, F♯, G♯, A, B

/**
 * Get the best enharmonic spelling based on common key signatures.
 */
const getBestEnharmonicName = (rootSemitone: number): "flat" | "sharp" => {
  if (FLAT_KEYS.has(rootSemitone)) return "flat"
  if (SHARP_KEYS.has(rootSemitone)) return "sharp"
  return "flat" // Default to flats if unclear
}

/**
 * Detect the chord from active MIDI notes.
 */
const detectChord = (midiNotes: Set<number>): ActiveChord | null => {
  if (!midiNotes.size) return null

  // Convert MIDI notes to semitones
  const semitones = getSemitones(midiNotes)
  console.log({ semitones })

  const key = semitones.join(",") // Match CHORD_PERMUTATIONS key format

  // Lookup possible chords
  const possibleChords = CHORD_PERMUTATIONS[key] ?? null
  if (!possibleChords) return null

  // Extract the lowest semitone to determine the root
  const rootSemitone = semitones[0]

  // Determine the best notation (flats or sharps)
  const preferredAccidental = getBestEnharmonicName(rootSemitone)
  const noteInfo = NOTES[rootSemitone]

  // Select the correct spelling dynamically
  const rootName =
    preferredAccidental === "flat" && noteInfo.flat
      ? noteInfo.flat
      : (noteInfo.sharp ?? noteInfo.name)

  return {
    tonic: rootName,
    quality: possibleChords[0].quality, // Use the first match (assuming same quality for different spellings)
    inversion: getInversion(midiNotes),
  }
}

const initialNote: MidiNote = {
  midiNote: 0,
  octave: 0,
  name: "N/a",
  velocity: 0,
  on: false,
}

const useMidi = (): MIDInterface => {
  const [activeNotes, setActiveNotes] = useState<Key[]>([])
  const [midiConfig, setMidiConfig] = useState<MIDInterface>({
    midiSupported: undefined,
    midiAccess: undefined,
    midiConnectionEvent: undefined,
    midi: initialNote,
    inputs: [],
    chords: {
      activeNotes: [],
      chord: null,
      details: undefined,
    },
  })

  const midiConfigRef = useRef(midiConfig)

  const update = (data: Partial<MIDInterface>): void => {
    const merged = { ...midiConfigRef.current, ...data }
    midiConfigRef.current = merged
    setMidiConfig(merged)
  }

  const getKey = (midiNote: number): Key => {
    const octave: number = Math.floor(midiNote / 12 - 1)
    const noteIndex: number = midiNote % 12
    const name = NOTES[noteIndex].name
    return { midiNote, octave, name }
  }

  const getInputName = (input: WebMidi.MIDIInput): string => {
    return `${input.manufacturer} ${input.name}`.trim()
  }

  const onMIDISuccess = (midiAccess: any): void => {
    // Subscribe to Midi messages
    const inputs = midiAccess.inputs.values()
    const inputDevices: Device[] = []
    for (
      let input = inputs.next();
      input && !input.done;
      input = inputs.next()
    ) {
      inputDevices.push({
        connection: input.value.connection,
        id: input.value.id,
        name: input.value.name,
        manufacturer: input.value.manufacturer,
        state: input.value.state,
        type: input.value.type,
        version: input.value.version,
        deviceName: getInputName(input.value),
      })
      input.value.onmidimessage = getMIDIMessage
    }
    // Subscribe to Midi state changes
    midiAccess.onstatechange = getStateChange
    update({ midiSupported: true, midiAccess, inputs: inputDevices })
  }

  const onMIDIFailure = (message: string): void => {
    update({ midiSupported: false })
    console.log("Failed to get MIDI access - " + message)
  }

  const getStateChange = (message: WebMidi.MIDIConnectionEvent): void => {
    update({ midiConnectionEvent: message, midiPort: message.port })
  }

  const getMIDIMessage = (message: WebMidi.MIDIMessageEvent): void => {
    const command = message.data[0]
    const note = message.data[1]
    // a velocity value might not be included with a noteOff command
    const velocity = message.data.length > 2 ? message.data[2] : 0

    switch (command) {
      case 144: // note on
        if (velocity > 0) {
          update({ midi: { ...getKey(note), velocity, on: true } })

          // At least two notes to make a chord
          setActiveNotes((prev) => [...prev, getKey(note)])
        } else {
          update({ midi: { ...getKey(note), velocity, on: false } })
        }
        break
      case 128: // note off
        update({ midi: { ...getKey(note), velocity, on: false } })
        setActiveNotes((prev) => prev.filter((key) => key.midiNote !== note))
        // onNoteEndCallback
        break
    }
  }

  useEffect(() => {
    const initialize = async (): Promise<any> => {
      try {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure)
      } catch (error) {
        console.log({ error })
        update({ midiSupported: false })
      }
    }

    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chord = detectChord(new Set(activeNotes.map((key) => key.midiNote)))

  return {
    ...midiConfig,
    chords: {
      activeNotes: activeNotes?.length > 1 ? activeNotes : [],
      chord,
      details: chord ? tonalChord(`${chord.tonic}${chord.quality}`) : undefined,
    },
  }
}

export default useMidi
