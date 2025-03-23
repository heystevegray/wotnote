import { z } from "zod"

import { Key, KeyEnum, MidiNote, MidiNoteSchema } from "./keyboard"

const SHARPS_TO_FLATS: Partial<Record<Key, Key>> = {
  "C#": "D♭",
  "D#": "E♭",
  "F#": "G♭",
  "G#": "A♭",
  "A#": "B♭",
}

// const FLATS_TO_SHARPS: Partial<Record<Key, Key>> = {
//   "d♭": "c#",
//   "e♭": "d#",
//   "g♭": "f#",
//   "a♭": "g#",
//   "b♭": "a#",
// }

export const ChordSchema = z.object({
  scaleDegree: z.number(),
  notes: z.array(MidiNoteSchema),
  key: KeyEnum,
  id: z.string(),
  lyrics: z.string().optional(),
})

export type ChordProps = z.infer<typeof ChordSchema>

export const ScaleSchema = z.enum([
  "major",
  "harmonic-minor",
  "melodic-minor",
  "natural-minor",
])

export type Scale = z.infer<typeof ScaleSchema>

export const SongSchema = z.object({
  name: z.string(),
  artist: z.string(),
  key: KeyEnum,
  scale: ScaleSchema,
  chords: z.array(ChordSchema),
  error: z.string().optional(),
})

export type Song = z.infer<typeof SongSchema>

type Step = 0.5 | 1 | 1.5
interface Interval {
  name: "half" | "whole" | "whole + half"
  step: Step
}

type ScaleFormula = Record<Scale, Interval[]>

const DEFAULT_KEY_CODE = 24
const OCTAVE = 12 * 3

const KEYS: { key: Key; code: number }[] = [
  { key: "C", code: DEFAULT_KEY_CODE + OCTAVE },
  { key: "D#", code: 25 + OCTAVE },
  { key: "D", code: 26 + OCTAVE },
  { key: "D#", code: 27 + OCTAVE },
  { key: "E", code: 28 + OCTAVE },
  { key: "F", code: 29 + OCTAVE },
  { key: "F#", code: 30 + OCTAVE },
  { key: "G", code: 31 + OCTAVE },
  { key: "G#", code: 32 + OCTAVE },
  { key: "A", code: 33 + OCTAVE },
  { key: "A#", code: 34 + OCTAVE },
  { key: "B", code: 35 + OCTAVE },
]

const formulas: ScaleFormula = {
  major: [
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "half", step: 0.5 },
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "half", step: 0.5 },
  ],
  "harmonic-minor": [
    { name: "whole", step: 1 },
    { name: "half", step: 0.5 },
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "half", step: 0.5 },
    { name: "whole + half", step: 1.5 },
    { name: "half", step: 0.5 },
  ],
  "melodic-minor": [
    { name: "whole", step: 1 },
    { name: "half", step: 0.5 },
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "half", step: 0.5 },
  ],
  "natural-minor": [
    { name: "whole", step: 1 },
    { name: "half", step: 0.5 },
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "half", step: 0.5 },
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
  ],
}

export const MIN_KEY = 21
export const MAX_KEY = 108

export const PIANO_KEYS: Key[] = [
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

export const PIANO_SCALES: Scale[] = [
  "major",
  "harmonic-minor",
  "melodic-minor",
  "natural-minor",
]

export type Accidental = "sharp" | "flat"

export type DefaultConfig = { key: Key; scale: Scale; accidental: Accidental }

export const defaultConfig: DefaultConfig = {
  key: "C",
  scale: "major",
  accidental: "flat",
}

export const convertToFlat = (key: Key): Key => {
  let prefferedKey: Key | undefined = key
  prefferedKey = SHARPS_TO_FLATS[prefferedKey]

  if (prefferedKey) {
    return prefferedKey
  }

  return key
}

export class Piano {
  key: Key
  scale: Scale

  constructor({ key, scale }: { key: Key; scale: Scale }) {
    this.key = key
    this.scale = scale
  }

  getIntervals(octaves = 1): Step[] {
    // For all the math to work, we need to start with an extra whole step
    const intervals: Step[] = [1]

    new Array(octaves).fill(0).forEach(() => {
      const steps: Step[] = Object.values(formulas[this.scale]).map(
        (interval) => interval.step
      )
      intervals.push(...steps)
    })

    return intervals
  }

  getNotes(octaves = 1): MidiNote[] {
    const intervals = this.getIntervals(octaves)
    const notes: MidiNote[] = []

    let startKeyCode =
      KEYS.find((note) => note.key === this.key)?.code || DEFAULT_KEY_CODE

    for (const [index, interval] of intervals.entries()) {
      let code, offset

      if (interval === 1.5) {
        // Harmonic Minor is a special case
        offset = 3
      } else {
        offset = interval === 1 ? 2 : 1
      }

      if (index === 0) {
        code = startKeyCode
      } else {
        code = startKeyCode + offset
        startKeyCode += offset
      }

      const key = KEYS[code % 12].key as Key
      notes.push({ key, code })
    }

    return notes
  }

  getChords(): ChordProps[] {
    const chords: ChordProps[] = []
    const twoOctaves = this.getNotes(2)

    for (let index = 0; index < twoOctaves.length; index++) {
      const chord: ChordProps = {
        id: crypto.randomUUID(),
        key: twoOctaves[index].key,
        notes: [
          {
            ...twoOctaves[index],
          },
          {
            ...twoOctaves[index + 2],
          },
          { ...twoOctaves[index + 4] },
        ],
        scaleDegree: index + 1,
      }

      chords.push(chord)
    }

    return chords.slice(0, 8)
  }
}
