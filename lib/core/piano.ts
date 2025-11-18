import { z } from 'zod';

export const KeyEnum = z.enum([
  'c',
  'c#',
  'd♭',
  'd',
  'd#',
  'e♭',
  'e',
  'f',
  'f#',
  'g♭',
  'g',
  'g#',
  'a♭',
  'a',
  'a#',
  'b♭',
  'b',
]);

const SHARPS_TO_FLATS: Partial<Record<Key, Key>> = {
  'c#': 'd♭',
  'd#': 'e♭',
  'f#': 'g♭',
  'g#': 'a♭',
  'a#': 'b♭',
};

// const FLATS_TO_SHARPS: Partial<Record<Key, Key>> = {
//   "d♭": "c#",
//   "e♭": "d#",
//   "g♭": "f#",
//   "a♭": "g#",
//   "b♭": "a#",
// }

export type Key = z.infer<typeof KeyEnum>;

export const NoteSchema = z.object({
  code: z.number(),
  key: KeyEnum,
  semitone: z.number(),
});

export type Note = z.infer<typeof NoteSchema>;

// Chord quality mapping
// Integer part of scaleDegree (1-12) = semitone offset
// Decimal part (0-9) = chord quality
export const ChordQualityEnum = z.enum([
  'diatonic',
  'major',
  'minor',
  'dim',
  'aug',
  'maj7',
  'min7',
  'dom7',
  'halfdim7',
  'dim7',
]);

export type ChordQuality = z.infer<typeof ChordQualityEnum>;

export const CHORD_QUALITIES: Record<number, ChordQuality> = {
  0: 'diatonic', // Whatever naturally occurs in the scale
  1: 'major', // Major triad (R, 3, 5)
  2: 'minor', // Minor triad (R, ♭3, 5)
  3: 'dim', // Diminished triad (R, ♭3, ♭5)
  4: 'aug', // Augmented triad (R, 3, ♯5)
  5: 'maj7', // Major 7th (R, 3, 5, 7)
  6: 'min7', // Minor 7th (R, ♭3, 5, ♭7)
  7: 'dom7', // Dominant 7th (R, 3, 5, ♭7)
  8: 'halfdim7', // Half-diminished 7th (R, ♭3, ♭5, ♭7)
  9: 'dim7', // Fully diminished 7th (R, ♭3, ♭♭7)
} as const;

// Map chord qualities to interval patterns (in semitones from root)
export const CHORD_INTERVALS: Record<ChordQuality, number[]> = {
  diatonic: [0, 4, 7], // diatonic - will be determined by scale
  major: [0, 4, 7], // major triad
  minor: [0, 3, 7], // minor triad
  dim: [0, 3, 6], // diminished triad
  aug: [0, 4, 8], // augmented triad
  maj7: [0, 4, 7, 11], // major 7th
  min7: [0, 3, 7, 10], // minor 7th
  dom7: [0, 4, 7, 10], // dominant 7th
  halfdim7: [0, 3, 6, 10], // half-diminished 7th
  dim7: [0, 3, 6, 9], // fully diminished 7th
};

export const ChordSchema = z.object({
  scaleDegree: z.number(),
  notes: z.array(NoteSchema),
  key: KeyEnum,
  id: z.string(),
  lyrics: z.string().optional(),
  quality: ChordQualityEnum,
});

export type ChordProps = z.infer<typeof ChordSchema>;

export const ScaleSchema = z.enum([
  'major',
  'harmonic-minor',
  'melodic-minor',
  'natural-minor',
]);

export type Scale = z.infer<typeof ScaleSchema>;

export const SongSchema = z.object({
  name: z.string(),
  artist: z.string(),
  key: KeyEnum,
  scale: ScaleSchema,
  chords: z.array(ChordSchema),
  error: z.string().optional(),
});

export type Song = z.infer<typeof SongSchema>;

type Step = 0.5 | 1 | 1.5;
interface Interval {
  name: 'half' | 'whole' | 'whole + half';
  step: Step;
}

type ScaleFormula = Record<Scale, Interval[]>;

const DEFAULT_KEY_CODE = 24;
const OCTAVE = 12 * 3;

const KEYS: { key: Key; code: number }[] = [
  { key: 'c', code: DEFAULT_KEY_CODE + OCTAVE },
  { key: 'c#', code: 25 + OCTAVE },
  { key: 'd', code: 26 + OCTAVE },
  { key: 'd#', code: 27 + OCTAVE },
  { key: 'e', code: 28 + OCTAVE },
  { key: 'f', code: 29 + OCTAVE },
  { key: 'f#', code: 30 + OCTAVE },
  { key: 'g', code: 31 + OCTAVE },
  { key: 'g#', code: 32 + OCTAVE },
  { key: 'a', code: 33 + OCTAVE },
  { key: 'a#', code: 34 + OCTAVE },
  { key: 'b', code: 35 + OCTAVE },
];

const formulas: ScaleFormula = {
  major: [
    { name: 'whole', step: 1 },
    { name: 'whole', step: 1 },
    { name: 'half', step: 0.5 },
    { name: 'whole', step: 1 },
    { name: 'whole', step: 1 },
    { name: 'whole', step: 1 },
    { name: 'half', step: 0.5 },
  ],
  'harmonic-minor': [
    { name: 'whole', step: 1 },
    { name: 'half', step: 0.5 },
    { name: 'whole', step: 1 },
    { name: 'whole', step: 1 },
    { name: 'half', step: 0.5 },
    { name: 'whole + half', step: 1.5 },
    { name: 'half', step: 0.5 },
  ],
  'melodic-minor': [
    { name: 'whole', step: 1 },
    { name: 'half', step: 0.5 },
    { name: 'whole', step: 1 },
    { name: 'whole', step: 1 },
    { name: 'whole', step: 1 },
    { name: 'whole', step: 1 },
    { name: 'half', step: 0.5 },
  ],
  'natural-minor': [
    { name: 'whole', step: 1 },
    { name: 'half', step: 0.5 },
    { name: 'whole', step: 1 },
    { name: 'whole', step: 1 },
    { name: 'half', step: 0.5 },
    { name: 'whole', step: 1 },
    { name: 'whole', step: 1 },
  ],
};

export const MIN_KEY = 21;
export const MAX_KEY = 108;

export const PIANO_KEYS: Key[] = [
  'c',
  'c#',
  'd',
  'd#',
  'e',
  'f',
  'f#',
  'g',
  'g#',
  'a',
  'a#',
  'b',
];

export const PIANO_SCALES: Scale[] = [
  'major',
  'harmonic-minor',
  'melodic-minor',
  'natural-minor',
];

export type Accidental = 'sharp' | 'flat';

export type DefaultConfig = {
  key: Key;
  scale: Scale;
  accidental: Accidental;
  build: Key[];
  color: string;
};

export const baseConfig: DefaultConfig = {
  key: 'c',
  scale: 'major',
  accidental: 'flat',
  color: '#6d85df',
  build: [],
};

export const convertToFlat = (key: Key): Key => {
  let prefferedKey: Key | undefined = key;
  prefferedKey = SHARPS_TO_FLATS[prefferedKey];

  if (prefferedKey) {
    return prefferedKey;
  }

  return key;
};

export class Piano {
  key: Key;
  scale: Scale;

  constructor({ key, scale }: { key: Key; scale: Scale }) {
    this.key = key;
    this.scale = scale;
  }

  getIntervals(octaves = 1): Step[] {
    // For all the math to work, we need to start with an extra whole step
    const intervals: Step[] = [1];

    new Array(octaves).fill(0).forEach(() => {
      const steps: Step[] = Object.values(formulas[this.scale]).map(
        (interval) => interval.step,
      );
      intervals.push(...steps);
    });

    return intervals;
  }

  getNotes(octaves = 1): Note[] {
    const intervals = this.getIntervals(octaves);
    const notes: Note[] = [];

    let startKeyCode =
      KEYS.find((note) => note.key === this.key)?.code || DEFAULT_KEY_CODE;

    for (const [index, interval] of intervals.entries()) {
      let code = 0,
        offset = 0;

      if (interval === 1.5) {
        // Harmonic Minor is a special case
        offset = 3;
      } else {
        offset = interval === 1 ? 2 : 1;
      }

      if (index === 0) {
        code = startKeyCode;
      } else {
        code = startKeyCode + offset;
        startKeyCode += offset;
      }

      const key = KEYS[code % 12].key as Key;
      notes.push({ key, code, semitone: code % 12 });
    }

    return notes;
  }

  getChords(): ChordProps[] {
    const chords: ChordProps[] = [];
    const twoOctaves = this.getNotes(2);

    for (let index = 0; index < twoOctaves.length; index++) {
      const chord: ChordProps = {
        id: `${this.key}-${this.scale}-degree-${index + 1}`,
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
        quality: 'diatonic', // Diatonic chords use default quality
      };

      chords.push(chord);
    }

    return chords.slice(0, 8);
  }

  // Create a chord based on semitone offset (1-12) and quality (.0-.9)
  // e.g., 1.5 = semitone 0 (root), quality 5 (maj7)
  //       4.2 = semitone 3 (E♭ in C), quality 2 (minor)
  getChordByScaleDegree(scaleDegree: number): ChordProps | null {
    const semitoneOffset = Math.floor(scaleDegree) - 1; // 1-12 maps to 0-11 semitones
    const qualityDecimal = Math.round(
      (scaleDegree - Math.floor(scaleDegree)) * 10,
    );
    
    // Map quality decimal to ChordQuality string
    const quality = CHORD_QUALITIES[qualityDecimal];
    if (!quality) return null;

    // Validate inputs (1-12 for semitones)
    if (semitoneOffset < 0 || semitoneOffset > 11) return null;
    if (!(quality in CHORD_INTERVALS)) return null;

    // Get the root note of the key
    const keyRoot = KEYS.find((note) => note.key === this.key);
    if (!keyRoot) return null;

    // Calculate the root note based on semitone offset from key root
    const rootCode = keyRoot.code + semitoneOffset;
    const rootSemitone = rootCode % 12;
    const rootKey = KEYS[rootSemitone].key as Key;

    // For diatonic quality, try to use scale notes if possible
    if (quality === 'diatonic') {
      const scaleNotes = this.getNotes(2);
      const matchingNote = scaleNotes.find(
        (note) => note.semitone === rootSemitone,
      );
      if (matchingNote) {
        const diatonicChords = this.getChords();
        const matchingChord = diatonicChords.find(
          (chord) => chord.key === matchingNote.key,
        );
        if (matchingChord) return matchingChord;
      }
    }

    // Build chord using interval pattern
    const intervals = CHORD_INTERVALS[quality];
    const notes: Note[] = intervals.map((semitones) => {
      const targetCode = rootCode + semitones;
      const targetSemitone = targetCode % 12;
      const key = KEYS[targetSemitone].key as Key;

      return {
        code: targetCode,
        key,
        semitone: targetSemitone,
      };
    });

    const chord: ChordProps = {
      id: `${this.key}-${this.scale}-semitone-${scaleDegree}`,
      key: rootKey,
      notes,
      scaleDegree,
      quality,
    };

    return chord;
  }

  // Get multiple chords by scale degrees (supports decimals)
  getChordsByScaleDegrees(scaleDegrees: number[]): ChordProps[] {
    return scaleDegrees
      .map((sd) => this.getChordByScaleDegree(sd))
      .filter((chord): chord is ChordProps => chord !== null);
  }
}
