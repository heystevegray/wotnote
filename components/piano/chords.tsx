import type { ChordProps } from '@/lib/core/Piano';

import Chord, { type RemoveChordProps } from './chord-card';

type Props = {
  chords: ChordProps[];
} & RemoveChordProps;

const Chords = ({ chords = [], onRemove }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
      {chords
        .filter((chord) => Boolean(chord?.notes?.length >= 3))
        .map((chord, index) => {
          return (
            <Chord
              chord={chord}
              chordIndex={index}
              key={chord.id}
              onRemove={onRemove}
            />
          );
        })}
    </div>
  );
};

export default Chords;
