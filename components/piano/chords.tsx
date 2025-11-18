import type { ChordProps } from '@/lib/core/piano';
import type { ClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import Chord, { type RemoveChordProps } from './chord-card';

type Props = {
  chords: ChordProps[];
} & RemoveChordProps;

const Chords = ({ chords = [], onRemove, className }: Props & ClassName) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4',
        className,
      )}>
      {chords
        .filter((chord) => Boolean(chord?.notes?.length >= 3))
        .map((chord, index) => {
          return (
            <Chord
              chord={chord}
              chordIndex={index}
              key={`${index}-${chord.id}`}
              onRemove={onRemove}
            />
          );
        })}
    </div>
  );
};

export default Chords;
