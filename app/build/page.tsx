'use client';

import { useEffect, useMemo } from 'react';
import Container from '@/components/container';
import Chords from '@/components/piano/chords';
import { Button } from '@/components/ui/button';
import type { ChordProps } from '@/lib/core/piano';
import useParams from '@/lib/hooks/use-params';

const Build = () => {
  const { buildScaleDegrees, chords, deleteParam, pushParams } = useParams();

  const buildChords = useMemo(
    () =>
      buildScaleDegrees
        .map((scaleDegree) => {
          return chords.find((chord) => chord.scaleDegree === scaleDegree);
        })
        .filter((chord): chord is ChordProps => chord !== undefined),
    [chords, buildScaleDegrees],
  );

  // Handle keyboard input to add chords
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Map keys 1-7 to scale degrees
      const keyMap: Record<string, number> = {
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
      };

      const scaleDegree = keyMap[event.key];
      if (scaleDegree) {
        const chord = chords.find((c) => c.scaleDegree === scaleDegree);
        if (chord) {
          const currentBuild = [...buildScaleDegrees, chord.scaleDegree];
          pushParams('build', currentBuild.join(','));
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [buildScaleDegrees, chords, pushParams]);

  return (
    <Container>
      <div className="flex flex-col gap-6">
        <div className="mx-auto flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap">
            {chords.map((chord) => (
              <Button
                size="sm"
                variant="outline"
                className="capitalize"
                key={chord.id}
                onClick={() => {
                  const currentBuild = [
                    ...buildScaleDegrees,
                    chord.scaleDegree,
                  ];
                  pushParams('build', currentBuild.join(','));
                }}>
                {chord.scaleDegree} - {chord.key}
              </Button>
            ))}
            <Button
              size="sm"
              variant="secondary"
              className="w-fit"
              onClick={() => {
                deleteParam('build');
              }}>
              Reset
            </Button>
          </div>
          <p className="text-muted-foreground text-center text-xs">
            You can use the number keys (1-7) to add chords, transpose in the
            sidebar.
          </p>
        </div>
        <Chords chords={buildChords} />
      </div>
    </Container>
  );
};

export default Build;
