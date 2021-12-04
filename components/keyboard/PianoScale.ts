type Key = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

type Scale = 'Major' | 'Harmonic Minor' | 'Melodic Minor' | 'Natural Minor';

interface Interval {
	name: 'half' | 'whole' | 'whole + half';
	step: 0.5 | 1 | 1.5
}

const MAJOR = 'Major';
const HARMONIC_MINOR = 'Harmonic Minor';
const MELODIC_MINOR = 'Melodic Minor';
const NATURAL_MINOR = 'Natural Minor';

interface ScaleFormula {
	[MAJOR]: Interval[];
	[HARMONIC_MINOR]: Interval[];
	[MELODIC_MINOR]: Interval[];
	[NATURAL_MINOR]: Interval[];
}

interface Note {
	key: Key;
	code: number;
}

const DEFAULT_KEY_CODE = 24

const KEYS =
	[
		{ key: 'C', code: DEFAULT_KEY_CODE },
		{ key: 'C#', code: 25 },
		{ key: 'D', code: 26 },
		{ key: 'D#', code: 27 },
		{ key: 'E', code: 28 },
		{ key: 'F', code: 29 },
		{ key: 'F#', code: 30 },
		{ key: 'G', code: 31 },
		{ key: 'G#', code: 32 },
		{ key: 'A', code: 33 },
		{ key: 'A#', code: 34 },
		{ key: 'B', code: 35 },
	];

const formulas: ScaleFormula = {
	[MAJOR]: [
		{ name: 'whole', step: 1 },
		{ name: 'whole', step: 1 },
		{ name: 'whole', step: 1 },
		{ name: 'half', step: 0.5 },
		{ name: 'whole', step: 1 },
		{ name: 'whole', step: 1 },
		{ name: 'whole', step: 1 },
		{ name: 'half', step: 0.5 },
	],
	[HARMONIC_MINOR]: [
		{ name: 'whole', step: 1 },
		{ name: 'whole', step: 1 },
		{ name: 'half', step: 0.5 },
		{ name: 'whole', step: 1 },
		{ name: 'whole', step: 1 },
		{ name: 'half', step: 0.5 },
		{ name: 'whole + half', step: 1.5 },
		{ name: 'half', step: 0.5 },
	],
	[MELODIC_MINOR]: [
		{ name: 'whole', step: 1 },
		{ name: 'whole', step: 1 },
		{ name: 'half', step: 0.5 },
		{ name: 'whole', step: 1 },
		{ name: 'whole', step: 1 },
		{ name: 'whole', step: 1 },
		{ name: 'whole', step: 1 },
		{ name: 'half', step: 0.5 },
	],
	[NATURAL_MINOR]: [
		{ name: 'whole', step: 1 },
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

export class PianoScale {
	key: Key;
	scale: Scale;
	activeColor: string;

	constructor(key: Key, scale: Scale, activeColor = 'cyan') {
		this.key = key;
		this.scale = scale;
		this.activeColor = activeColor;
	}

	getIntervals(): number[] {
		return Object.values(formulas[this.scale]).map((interval) => interval.step);
	}

	getNotes(): Note[] {
		const intervals = this.getIntervals();
		const notes: Note[] = [];

		let startKeyCode = KEYS.find((note) => note.key === this.key)?.code || DEFAULT_KEY_CODE

		for (const [index, interval] of intervals.entries()) {
			let key, code, offset;

			if (interval === 1.5) {
				// Harmonic Minor is a special case
				offset = 3
			} else {
				offset = interval === 1 ? 2 : 1;
			}

			if (index === 0) {
				key = KEYS[0].key as Key;
				code = startKeyCode;
			} else {
				code = startKeyCode + offset;
				key = KEYS[code % 12].key as Key;
				startKeyCode += offset;
			}

			notes.push({ key, code });
		}

		return notes;
	}
}
