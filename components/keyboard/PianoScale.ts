type Key = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

type Scale = 'Major' | 'Harmonic Minor' | 'Melodic Minor' | 'Natural Minor';

interface Interval {
    name: 'half' | 'whole';
    step: 0.5 | 1;
}

interface ScaleFormula {
    Major: Interval[];
    'Harmonic Minor': Interval[];
    'Melodic Minor': Interval[];
    'Natural Minor': Interval[];
}

interface Note {
    key: Key;
    code: number;
}

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const formulas: ScaleFormula = {
    Major: [
        { name: 'whole', step: 1 },
        { name: 'whole', step: 1 },
        { name: 'whole', step: 1 },
        { name: 'half', step: 0.5 },
        { name: 'whole', step: 1 },
        { name: 'whole', step: 1 },
        { name: 'whole', step: 1 },
        { name: 'half', step: 0.5 },
    ],
};

export const MIN_KEY = 21;
export const MAX_KEY = 108;

export class PianoScale {
    key: string;
    scale: string;
    activeColor: string;

    constructor(key: Key, scale: Scale, activeColor = 'cyan') {
        this.key = key;
        this.scale = scale;
        this.activeColor = activeColor;
    }

    getIntervals(): number[] {
        if (this.scale === 'Major') {
            return Object.values(formulas['Major']).map((interval) => interval.step);
        }
        return [];
    }

    getNotes(): Note[] {
        const intervals = this.getIntervals();
        const notes: Note[] = [];
        let startKeyCode = 24; // the fist C note on the keyboard

        for (const [index, interval] of intervals.entries()) {
            let key, code;
            const offset = interval === 1 ? 2 : 1;

            if (index === 0) {
                key = KEYS[0] as Key;
                code = startKeyCode;
            } else {
                code = startKeyCode + offset;
                key = KEYS[code % 12] as Key;
                startKeyCode += offset;
            }

            notes.push({ key, code });
        }

        return notes;
    }
}
