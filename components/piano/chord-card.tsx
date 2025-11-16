import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type ChordProps, convertToFlat, type Note } from '@/lib/core/piano';
import { capitalizeFirstLetter, cn } from '@/lib/utils';
import { Icons } from '../icons';
import { Button } from '../ui/button';

export type RemoveChordProps = {
  onRemove?: (chord: ChordProps) => void;
};

export type ChordCardProps = {
  chord: ChordProps;
  chordIndex?: number;
} & RemoveChordProps;

const scaleDegrees = [
  { value: 'Tonic', color: 'bg-chord-1' },
  { value: 'Supertonic', color: 'bg-chord-2' },
  { value: 'Mediant', color: 'bg-chord-3' },
  { value: 'Subdominant', color: 'bg-chord-4' },
  { value: 'Dominant', color: 'bg-chord-5' },
  { value: 'Submediant', color: 'bg-chord-6' },
  { value: 'Leading', color: 'bg-chord-7' },
  { value: 'Octave', color: 'bg-chord-1' },
];

const Chord = ({ chord, onRemove }: ChordCardProps) => {
  const degree = scaleDegrees[chord.scaleDegree];
  const loading = chord?.notes?.every((note) => note.key) === false;

  return (
    <Card
      className={cn({
        'scale-110 shadow-2xl blur-sm transition-transform ease-in-out':
          loading,
      })}>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 justify-between">
        <CardTitle className="text-sm flex flex-row items-center gap-2">
          <div
            className={cn(
              'flex size-6 items-center justify-center rounded-full bg-foreground text-center  text-background',
              degree?.color,
            )}>
            {chord.scaleDegree}
          </div>
          <span className="font-normal text-muted-foreground">
            {degree?.value}
          </span>
        </CardTitle>
        {onRemove ? (
          <div className="flex justify-end">
            <Button
              aria-label="Remove Chord"
              size="icon"
              variant="ghost"
              onClick={() => onRemove?.(chord)}>
              <Icons.x />
            </Button>
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <h2 className="text-center text-3xl font-bold">
          {capitalizeFirstLetter(convertToFlat(chord.key))}
        </h2>
        {/* <PianoRoll activeNotes={chord.notes} chordIndex={chordIndex} /> */}
        <div className="flex gap-4">
          {chord.notes.map((note: Note) => (
            <div key={note.code}>
              <p className="text-xl">
                {capitalizeFirstLetter(convertToFlat(note.key))}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        {chord?.lyrics ? (
          <div className="w-full border-t pt-2 text-center">
            <p className="text-xs text-muted-foreground">{chord.lyrics}</p>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default Chord;
