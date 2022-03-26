import { createContext, FC, ReactNode, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { Scale, Key, Note, Chord, PianoScale } from '../lib/classes/PianoScale';
export interface IKeyboardContext {
    pianoKey: Key;
    scale: Scale;
    notes: Note[];
    chords: Chord[];
    setPianoKey: Dispatch<SetStateAction<Key>>;
    setScale: Dispatch<SetStateAction<Scale>>;
}

const initialState: IKeyboardContext = {
    chords: [],
    notes: [],
    pianoKey: 'C',
    scale: 'Major',
    setPianoKey: () => undefined,
    setScale: () => undefined,
};

export const KeyboardContext = createContext<IKeyboardContext>(initialState);

const KeyboardProvider: FC<ReactNode> = ({ children }) => {
    const selectedScale = new PianoScale(initialState.pianoKey, initialState.scale);
    const [pianoKey, setPianoKey] = useState<Key>(initialState.pianoKey);
    const [scale, setScale] = useState<Scale>(initialState.scale);

    const [notes, setNotes] = useState<Note[]>(selectedScale.getNotes());
    const [chords, setChords] = useState<Chord[]>(selectedScale.getChords());

    useEffect(() => {
        if (pianoKey) {
            const newPianoScale = new PianoScale(pianoKey, scale || 'Major');
            setNotes(newPianoScale.getNotes());
            setChords(newPianoScale.getChords());
        }
    }, [pianoKey, scale]);

    return (
        <KeyboardContext.Provider
            value={{
                pianoKey,
                scale,
                notes,
                chords,
                setPianoKey,
                setScale,
            }}
        >
            {children}
        </KeyboardContext.Provider>
    );
};

export default KeyboardProvider;
