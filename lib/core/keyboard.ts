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

export type MidiKey = {
  midiNote: number
  name: string
  octave: number
}

type NoteInfo = {
  name: Key
  sharp?: string
  flat?: string
}

export type ChordProps = {
  /**
   * Name of the chord quality.
   *
   * @example "Major", "minor", "Dominant 7th"
   */
  quality: string
  /**
   * Optional symbol for the chord.
   *
   * @example "maj7", "m7", "7"
   */
  symbol?: string
  /**
   * Optional alias for the chord.
   *
   * @example "△7", "m△7", "ø"
   */
  alias?: string
  /**
   * Semitone distance from the root note.
   */
  semitones: number[]
}

export type Chord = {
  notes: string[]
  tonic: Key
  /**
   * Diatonic intervals from the root note.
   */
  degrees?: number[]
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

export const CHORD_TYPES: ChordProps[] = [
  // Single Notes
  { quality: "", symbol: "1", semitones: [0] },
  // Two-Note Chords (Dyads)
  { quality: "minor 2nd", symbol: "♭2", semitones: [0, 1] },
  { quality: "Major 2nd", symbol: "2", semitones: [0, 2] },
  { quality: "minor 3rd", symbol: "♭3", semitones: [0, 3] },
  { quality: "Major 3rd", symbol: "3", semitones: [0, 4] },
  { quality: "Perfect 4th", symbol: "4", semitones: [0, 5] },
  { quality: "Tritone", symbol: "♯4 / ♭5", semitones: [0, 6] },
  { quality: "Perfect 5th", symbol: "5", semitones: [0, 7] },
  { quality: "minor 6th", symbol: "♭6", semitones: [0, 8] },
  { quality: "Major 6th", symbol: "6", semitones: [0, 9] },
  { quality: "minor 7th", symbol: "♭7", semitones: [0, 10] },
  { quality: "Major 7th", symbol: "7", semitones: [0, 11] },
  { quality: "Octave", symbol: "8", semitones: [0, 12] },

  // Triads
  { quality: "Major", symbol: undefined, semitones: [0, 4, 7] },
  { quality: "minor", symbol: "m", semitones: [0, 3, 7] },
  { quality: "Diminished", symbol: "°", semitones: [0, 3, 6] },
  { quality: "Augmented", symbol: "+", semitones: [0, 4, 8] },
  { quality: "Suspended 2nd", symbol: "sus2", semitones: [0, 2, 7] },
  { quality: "Suspended 4th", symbol: "sus4", semitones: [0, 5, 7] },

  // Seventh Chords
  {
    quality: "Major 7th",
    symbol: "maj7",
    alias: "△7",
    semitones: [0, 4, 7, 11],
  },
  { quality: "minor 7th", symbol: "m7", semitones: [0, 3, 7, 10] },
  { quality: "Dominant 7th", symbol: "7", semitones: [0, 4, 7, 10] },
  {
    quality: "minor Major 7th",
    symbol: "m(maj7)",
    alias: "m△7",
    semitones: [0, 3, 7, 11],
  },
  {
    quality: "Half-Diminished",
    symbol: "m7♭5",
    alias: "ø",
    semitones: [0, 3, 6, 10],
  },
  {
    quality: "Fully Diminished 7th",
    symbol: "°7",
    semitones: [0, 3, 6, 9],
  },

  // Extended Chords
  {
    quality: "Dominant 9th",
    symbol: "9",
    semitones: [0, 4, 7, 10, 14],
  },
  {
    quality: "Major 9th",
    symbol: "maj9",
    alias: "△9",
    semitones: [0, 4, 7, 11, 14],
  },
  { quality: "minor 9th", symbol: "m9", semitones: [0, 3, 7, 10, 14] },
  {
    quality: "Dominant 11th",
    symbol: "11",
    semitones: [0, 4, 7, 10, 14, 17],
  },
  {
    quality: "Dominant 13th",
    symbol: "13",
    semitones: [0, 4, 7, 10, 14, 21],
  },

  // Altered Chords
  {
    quality: "Dominant 7♭9",
    symbol: "7♭9",
    semitones: [0, 4, 7, 10, 13],
  },
  {
    quality: "Dominant 7♯9",
    symbol: "7♯9",
    semitones: [0, 4, 7, 10, 15],
  },
  {
    quality: "Dominant 7♯11",
    symbol: "7♯11",
    semitones: [0, 4, 7, 10, 14, 18],
  },
  {
    quality: "Dominant 7♭13",
    symbol: "7♭13",
    semitones: [0, 4, 7, 10, 14, 20],
  },

  // Special Chords
  { quality: "Major 6th", symbol: "6", semitones: [0, 4, 7, 9] },
  { quality: "Major 6/9", symbol: "6/9", semitones: [0, 4, 7, 9, 14] },
  { quality: "minor 6th", symbol: "m6", semitones: [0, 3, 7, 9] },
  { quality: "minor 6/9", symbol: "m6/9", semitones: [0, 3, 7, 9, 14] },
  {
    quality: "Dominant 7 Suspended 4th",
    symbol: "7sus4",
    semitones: [0, 5, 7, 10],
  },
]

// Mapping of semitone intervals to scale degrees
const SEMITONE_TO_DEGREE: Record<number, number> = {
  0: 1, // Root
  2: 2, // Major 2nd
  3: 3, // Minor 3rd
  4: 3, // Major 3rd
  5: 4, // Perfect 4th
  6: 5, // Augmented 4th / Diminished 5th
  7: 5, // Perfect 5th
  8: 6, // Minor 6th
  9: 6, // Major 6th
  10: 7, // Minor 7th
  11: 7, // Major 7th
}

const convertToScaleDegrees = (semitones: number[]): number[] => {
  return semitones.map((semitone) => SEMITONE_TO_DEGREE[semitone] || -1)
}

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

  const semitones = getSemitones(midiNotes).sorted

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
export const getSemitones = (
  midiNotes: Set<number>
): {
  sorted: number[]
  raw: number[]
  notes: Key[]
} => {
  return {
    sorted: [...new Set([...midiNotes].map((midiNote) => midiNote % 12))].sort(
      (a, b) => a - b
    ),
    // Convert MIDI notes to pitch classes while keeping the played order
    raw: [...midiNotes].map((note) => note % 12),
    notes: [...midiNotes].map((note) => NOTES[note % 12].name),
  }
}

/**
 * Detects a chord from a set of MIDI notes.
 */
export const detectChord = (midiNotes: Set<number>): Chord | null => {
  // Convert MIDI notes to semitone intervals (0-11)
  const semitones = getSemitones(midiNotes)

  // Find the most probable root (not necessarily the lowest note)
  const probableRoots = semitones.sorted.map((root) => ({
    rootNote: NOTES[root].name,
    intervals: semitones.sorted
      .map((note) => (note - root + 12) % 12)
      .sort((a, b) => a - b),
  }))

  for (const { rootNote, intervals } of probableRoots) {
    // Search for a matching chord type
    const matchingChord = CHORD_TYPES.find(
      (chord) => JSON.stringify(chord.semitones) === JSON.stringify(intervals)
    )

    if (matchingChord) {
      const { bassNote, inversion } = getInversion(midiNotes)

      return {
        bassNote,
        inversion,
        tonic: rootNote,
        quality: matchingChord.quality,
        symbol: matchingChord.symbol,
        alias: matchingChord.alias,
        semitones: semitones.raw,
        notes: semitones.notes,
        degrees: convertToScaleDegrees(semitones.raw),
      }
    }
  }

  return null // No matching chord found
}

// const root = "C"
// const allChords: ChordProps[] = CHORD_TYPES.map((chord) => ({
//   ...chord,
//   // Add 1 to the intervals to make them 1-indexed
//   name: `${root}${chord.symbol}`,
//   alias: chord.alias ? `${root}${chord.alias}` : undefined,
// }))

// console.table(allChords)
