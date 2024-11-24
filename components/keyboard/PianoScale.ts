export type Key =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B"

export type Scale =
  | "Major"
  | "Harmonic Minor"
  | "Melodic Minor"
  | "Natural Minor"

export interface Note {
  key: Key
  code: number
}

export interface Chord {
  key: Key
  notes: Note[]
}

type Step = 0.5 | 1 | 1.5
interface Interval {
  name: "half" | "whole" | "whole + half"
  step: Step
}

const MAJOR = "Major"
const HARMONIC_MINOR = "Harmonic Minor"
const MELODIC_MINOR = "Melodic Minor"
const NATURAL_MINOR = "Natural Minor"

interface ScaleFormula {
  [MAJOR]: Interval[]
  [HARMONIC_MINOR]: Interval[]
  [MELODIC_MINOR]: Interval[]
  [NATURAL_MINOR]: Interval[]
}

const DEFAULT_KEY_CODE = 24
const OCTAVE = 12 * 3

const KEYS = [
  { key: "C", code: DEFAULT_KEY_CODE + OCTAVE },
  { key: "C#", code: 25 + OCTAVE },
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
  [MAJOR]: [
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "half", step: 0.5 },
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "half", step: 0.5 },
  ],
  [HARMONIC_MINOR]: [
    { name: "whole", step: 1 },
    { name: "half", step: 0.5 },
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "half", step: 0.5 },
    { name: "whole + half", step: 1.5 },
    { name: "half", step: 0.5 },
  ],
  [MELODIC_MINOR]: [
    { name: "whole", step: 1 },
    { name: "half", step: 0.5 },
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "whole", step: 1 },
    { name: "half", step: 0.5 },
  ],
  [NATURAL_MINOR]: [
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

export type PianoKeysType =
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

export const PIANO_KEYS: PianoKeysType[] = [
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

export type PianoScaleType =
  | "major"
  | "harmonic-minor"
  | "melodic-minor"
  | "natural-minor"

export const PIANO_SCALES: PianoScaleType[] = [
  "major",
  "harmonic-minor",
  "melodic-minor",
  "natural-minor",
]

export class PianoScale {
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

  getChords(): Chord[] {
    const chords: Chord[] = []
    const twoOctaves = this.getNotes(2)

    for (let index = 0; index < twoOctaves.length; index++) {
      const chord: Chord = {
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
