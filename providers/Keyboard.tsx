import { FunctionComponent } from 'react';
import { ReactNode } from 'react';
import { Provider } from 'react';
import { createContext, FC, useState, Dispatch, SetStateAction } from 'react';
import { Scale, Key, Note, Chord, PianoScale } from '../lib/classes/PianoScale';

export interface IKeyboard {
    pianoKey: Key | undefined;
    scale: Scale | undefined;
    notes: Note[] | undefined;
    chords: Chord[] | undefined;
}

export interface KeyboardContextType extends IKeyboard {
    setPianoKey: Dispatch<SetStateAction<Key>>;
    setScale: Dispatch<SetStateAction<Scale | undefined>>;
}

export const KeyboardContext = createContext<KeyboardContextType | null>(null);

const KeyboardProvider: FC<ReactNode> = ({ children }) => {
    const [pianoKey, setPianoKey] = useState<Key>('C');
    const [scale, setScale] = useState<Scale | undefined>('Major');

    const [notes, setNotes] = useState<Note[] | undefined>(undefined);
    const [chords, setChords] = useState<Chord[] | undefined>(undefined);

    const selectedScale = new PianoScale(pianoKey, scale || 'Major');
    setNotes(selectedScale.getNotes());
    setChords(selectedScale.getChords());

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
            {{ children }}
        </KeyboardContext.Provider>
    );
};

export default KeyboardProvider;
