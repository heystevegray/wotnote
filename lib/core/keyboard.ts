import { z } from "zod"

export const KeyEnum = z.enum([
  "C",
  "C#",
  "D♭",
  "D",
  "D#",
  "E♭",
  "E",
  "F",
  "F#",
  "G♭",
  "G",
  "G#",
  "A♭",
  "A",
  "A#",
  "B♭",
  "B",
])

export type Key = z.infer<typeof KeyEnum>

type NoteInfo = {
  name: Key
  sharp?: string
  flat?: string
}

export type ChordProps = {
  quality: string
  symbol?: string
  alias?: string
  intervals: number[] // Semitone distances from root
}

export type Chord = {
  notes: string[]
  tonic: Key
} & ChordProps &
  InversionOutput

type Inversion = "root" | "first" | "second" | "third"

type InversionOutput = {
  inversion: Inversion
  bassNote?: string
}

export const NOTES: Record<number, NoteInfo> = {
  0: { name: "C", sharp: "C♯" },
  1: { name: "D♭", sharp: "C♯" }, // Default to flat
  2: { name: "D", sharp: "D♯" },
  3: { name: "E♭", sharp: "D♯" }, // Default to flat
  4: { name: "E", flat: "F♭" },
  5: { name: "F", sharp: "F♯" },
  6: { name: "G♭", sharp: "F♯" }, // Default to flat
  7: { name: "G", sharp: "G♯" },
  8: { name: "A♭", sharp: "G♯" }, // Default to flat
  9: { name: "A", sharp: "A♯" },
  10: { name: "B♭", sharp: "A♯" }, // Default to flat
  11: { name: "B", flat: "C♭" },
}

export const getChordNotes = (root: Key, chord: ChordProps): string[] => {
  const rootIndex = Object.values(NOTES).findIndex((note) => note.name === root)
  if (rootIndex === -1) throw new Error(`Invalid root note: ${root}`)

  return chord.intervals.map((interval) => {
    const noteIndex = (rootIndex + interval) % 12
    return Object.values(NOTES)[noteIndex].name
  })
}

export const CHORD_TYPES: ChordProps[] = [
  // Two-Note Chords (Dyads)
  { quality: "Octave", symbol: "1", intervals: [0] },
  { quality: "minor 2nd", symbol: "♭2", intervals: [0, 1] },
  { quality: "Major 2nd", symbol: "2", intervals: [0, 2] },
  { quality: "minor 3rd", symbol: "♭3", intervals: [0, 3] },
  { quality: "Major 3rd", symbol: "3", intervals: [0, 4] },
  { quality: "Perfect 4th", symbol: "4", intervals: [0, 5] },
  { quality: "Tritone", symbol: "♯4 / ♭5", intervals: [0, 6] },
  { quality: "Perfect 5th", symbol: "5", intervals: [0, 7] },
  { quality: "minor 6th", symbol: "♭6", intervals: [0, 8] },
  { quality: "Major 6th", symbol: "6", intervals: [0, 9] },
  { quality: "minor 7th", symbol: "♭7", intervals: [0, 10] },
  { quality: "Major 7th", symbol: "7", intervals: [0, 11] },
  { quality: "Octave", symbol: "8", intervals: [0, 12] },

  // Triads
  { quality: "Major", symbol: undefined, intervals: [0, 4, 7] },
  { quality: "minor", symbol: "m", intervals: [0, 3, 7] },
  { quality: "Diminished", symbol: "°", intervals: [0, 3, 6] },
  { quality: "Augmented", symbol: "+", intervals: [0, 4, 8] },
  { quality: "Suspended 2nd", symbol: "sus2", intervals: [0, 2, 7] },
  { quality: "Suspended 4th", symbol: "sus4", intervals: [0, 5, 7] },

  // Seventh Chords
  {
    quality: "Major 7th",
    symbol: "maj7",
    alias: "△7",
    intervals: [0, 4, 7, 11],
  },
  { quality: "minor 7th", symbol: "m7", intervals: [0, 3, 7, 10] },
  { quality: "Dominant 7th", symbol: "7", intervals: [0, 4, 7, 10] },
  {
    quality: "minor Major 7th",
    symbol: "m(maj7)",
    alias: "m△7",
    intervals: [0, 3, 7, 11],
  },
  {
    quality: "Half-Diminished",
    symbol: "m7♭5",
    alias: "ø",
    intervals: [0, 3, 6, 10],
  },
  { quality: "Fully Diminished 7th", symbol: "°7", intervals: [0, 3, 6, 9] },

  // Extended Chords
  { quality: "Dominant 9th", symbol: "9", intervals: [0, 4, 7, 10, 14] },
  {
    quality: "Major 9th",
    symbol: "maj9",
    alias: "△9",
    intervals: [0, 4, 7, 11, 14],
  },
  { quality: "minor 9th", symbol: "m9", intervals: [0, 3, 7, 10, 14] },
  { quality: "Dominant 11th", symbol: "11", intervals: [0, 4, 7, 10, 14, 17] },
  { quality: "Dominant 13th", symbol: "13", intervals: [0, 4, 7, 10, 14, 21] },

  // Altered Chords
  { quality: "Dominant 7♭9", symbol: "7♭9", intervals: [0, 4, 7, 10, 13] },
  { quality: "Dominant 7♯9", symbol: "7♯9", intervals: [0, 4, 7, 10, 15] },
  {
    quality: "Dominant 7♯11",
    symbol: "7♯11",
    intervals: [0, 4, 7, 10, 14, 18],
  },
  {
    quality: "Dominant 7♭13",
    symbol: "7♭13",
    intervals: [0, 4, 7, 10, 14, 20],
  },

  // Special Chords
  { quality: "Major 6th", symbol: "6", intervals: [0, 4, 7, 9] },
  { quality: "Major 6/9", symbol: "6/9", intervals: [0, 4, 7, 9, 14] },
  { quality: "minor 6th", symbol: "m6", intervals: [0, 3, 7, 9] },
  { quality: "minor 6/9", symbol: "m6/9", intervals: [0, 3, 7, 9, 14] },
  {
    quality: "Dominant 7 Suspended 4th",
    symbol: "7sus4",
    intervals: [0, 5, 7, 10],
  },
]

/**
 * Get the inversion of a chord.
 */
export const getInversion = (midiNotes: Set<number>): InversionOutput => {
  // Inversions only apply to triads+
  if (midiNotes.size < 3) {
    return {
      inversion: "root",
    }
  }

  // Convert MIDI notes to pitch classes while keeping the played order
  const semitones = [...midiNotes].map((note) => note % 12)

  // Compute the intervals **based on the played order**
  const intervals = semitones.map((note, index, arr) =>
    index === 0 ? 0 : (note - arr[0] + 12) % 12
  )

  // Convert to interval pattern string
  const pattern = intervals.join(",")

  // Root position
  if (pattern === "0,4,7" || pattern === "0,3,7" || pattern === "0,3,6") {
    return {
      inversion: "root",
    }
  }

  // Identify the lowest note in the played order
  const bassSemitone = semitones[0] // The first played note is the bass

  // First Inversion (3rd in the bass)
  if (pattern === "0,3,8" || pattern === "0,4,9") {
    return {
      inversion: "first",
      bassNote: NOTES[bassSemitone].name,
    }
  }

  // Second Inversion (5th in the bass)
  if (pattern === "0,5,9" || pattern === "0,6,10") {
    return {
      inversion: "second",
      bassNote: NOTES[bassSemitone].name,
    }
  }

  // Third Inversion (7th in the bass, for 7th chords)
  if (pattern === "0,4,8" || pattern === "0,3,9" || pattern === "0,6,9") {
    return {
      inversion: "third",
      bassNote: NOTES[bassSemitone].name,
    }
  }

  return {
    inversion: "root",
  }
}

/**
 * Convert MIDI notes to sorted, unique semi-tone intervals (0-11).
 *
 * @example getSemitones(new Set([60, 64, 67])) // [0, 4, 7]
 * @example getSemitones(new Set([60, 64, 67, 71])) // [0, 4, 7, 11]
 */
export const getSemitones = (midiNotes: Set<number>) => {
  return [...new Set([...midiNotes].map((midiNote) => midiNote % 12))].sort(
    (a, b) => a - b
  )
}

const root = "C"
const allChords = CHORD_TYPES.map((chord) => ({
  name: `${root}${chord.symbol}`,
  alias: chord.alias ? `${root}${chord.alias}` : undefined,
  notes: getChordNotes(root, chord).join(", "),
  ...chord,
}))

console.table(allChords)
