export interface Note {
  key: Key
  code: number
}

export interface ChordProps {
  key: Key
  notes: Note[]
}

type Step = 0.5 | 1 | 1.5
interface Interval {
  name: "half" | "whole" | "whole + half"
  step: Step
}

type ScaleFormula = Record<Scale, Interval[]>

export const DEFAULT_KEY_CODE = 24
const octaveOffset = 0

const KEYS: { key: Key; code: number }[] = [
  { key: "c", code: DEFAULT_KEY_CODE + octaveOffset },
  { key: "c#", code: 25 + octaveOffset },
  { key: "d", code: 26 + octaveOffset },
  { key: "d#", code: 27 + octaveOffset },
  { key: "e", code: 28 + octaveOffset },
  { key: "f", code: 29 + octaveOffset },
  { key: "f#", code: 30 + octaveOffset },
  { key: "g", code: 31 + octaveOffset },
  { key: "g#", code: 32 + octaveOffset },
  { key: "a", code: 33 + octaveOffset },
  { key: "a#", code: 34 + octaveOffset },
  { key: "b", code: 35 + octaveOffset },
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

export type Key =
  | "c"
  | "c#"
  | "d"
  | "d#"
  | "e"
  | "f"
  | "f#"
  | "g"
  | "g#"
  | "a"
  | "a#"
  | "b"

export const PIANO_KEYS: Key[] = [
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

export type Scale =
  | "major"
  | "harmonic-minor"
  | "melodic-minor"
  | "natural-minor"

export const PIANO_SCALES: Scale[] = [
  "major",
  "harmonic-minor",
  "melodic-minor",
  "natural-minor",
]

export type Accidental = "sharp" | "flat"

export type DefaultConfig = { key: Key; scale: Scale; accidental: Accidental }

export const baseConfig: DefaultConfig = {
  key: "c",
  scale: "major",
  accidental: "flat",
}

export class Piano {
  key: Key
  scale: Scale

  constructor(key: Key, scale: Scale) {
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

  getNotes(octaves = 1): Note[] {
    const intervals = this.getIntervals(octaves)
    const notes: Note[] = []

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
      }

      chords.push(chord)
    }

    return chords.slice(0, 8)
  }
}
