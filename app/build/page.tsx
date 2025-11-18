'use client';

import { useEffect, useMemo } from 'react';
import Container from '@/components/container';
import Chords from '@/components/piano/chords';
import { getKeyWithFlat } from '@/components/settings';
import { Button } from '@/components/ui/button';
import { CHORD_QUALITIES, type ChordProps } from '@/lib/core/piano';
import useParams from '@/lib/hooks/use-params';

const Build = () => {
  const { buildScaleDegrees, deleteParam, pushParams, selectedScale } =
    useParams();

  // Generate all available chords (12 semitones × 10 qualities)
  const allAvailableChords = useMemo(() => {
    const chordList: Array<{
      scaleDegree: number;
      quality: number;
      chord: ChordProps;
    }> = [];

    // For each semitone (1-12)
    for (let semitone = 1; semitone <= 12; semitone++) {
      // For each quality (0-9)
      for (let quality = 0; quality <= 9; quality++) {
        const scaleDegree =
          quality === 0 ? semitone : parseFloat(`${semitone}.${quality}`);
        const chord = selectedScale.getChordByScaleDegree(scaleDegree);
        if (chord) {
          chordList.push({ scaleDegree, quality, chord });
        }
      }
    }

    return chordList;
  }, [selectedScale]);

  const buildChords = useMemo(
    () =>
      buildScaleDegrees
        .map((scaleDegree) => {
          // Use getChordByScaleDegree for all chords (handles both decimal and integer)
          return selectedScale.getChordByScaleDegree(scaleDegree);
        })
        .filter(
          (chord): chord is ChordProps => chord !== null && chord !== undefined,
        ),
    [buildScaleDegrees, selectedScale],
  );

  // Handle keyboard input to add chords
  useEffect(() => {
    let buffer = '';
    let timeoutId: NodeJS.Timeout;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key;

      // Handle numbers and decimal point
      if (/^[0-9.]$/.test(key)) {
        buffer += key;

        // Clear previous timeout
        clearTimeout(timeoutId);

        // Set timeout to process buffer after 500ms of no input
        timeoutId = setTimeout(() => {
          processScaleDegree(buffer);
          buffer = '';
        }, 500);
      }
      // Handle Enter to immediately process buffer
      else if (key === 'Enter' && buffer) {
        clearTimeout(timeoutId);
        processScaleDegree(buffer);
        buffer = '';
      }
      // Handle Escape to clear buffer
      else if (key === 'Escape') {
        clearTimeout(timeoutId);
        buffer = '';
      }
    };

    const processScaleDegree = (input: string) => {
      const scaleDegree = parseFloat(input);

      // Validate scale degree
      if (Number.isNaN(scaleDegree) || scaleDegree < 1 || scaleDegree > 7.9) {
        console.warn('Invalid scale degree:', input);
        return;
      }

      // Add the scale degree to the build (works for both integers and decimals)
      const currentBuild = [...buildScaleDegrees, scaleDegree];
      pushParams('build', currentBuild.join(','));
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearTimeout(timeoutId);
    };
  }, [buildScaleDegrees, pushParams]);

  return (
    <Container className="lg:max-w-none">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
        <div className="mx-auto flex flex-col gap-4 w-full max-w-4xl">
          {/* Render chords grouped by semitone */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((semitone) => {
            const semitoneChords = allAvailableChords.filter(
              (item) => Math.floor(item.scaleDegree) === semitone,
            );

            // Get the root note for this semitone
            const rootChord = selectedScale.getChordByScaleDegree(semitone);
            const rootNote = rootChord ? getKeyWithFlat(rootChord.key) : '';

            return (
              <div key={semitone} className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Semitone {semitone} - {rootNote}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {semitoneChords.map((item) => {
                    const qualityLabel =
                      CHORD_QUALITIES[
                        item.quality as keyof typeof CHORD_QUALITIES
                      ];
                    return (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="capitalize"
                        key={item.chord.id}
                        onClick={() => {
                          const currentBuild = [
                            ...buildScaleDegrees,
                            item.scaleDegree,
                          ];
                          pushParams('build', currentBuild.join(','));
                        }}>
                        {item.scaleDegree} - {getKeyWithFlat(item.chord.key)}{' '}
                        {qualityLabel}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <Button
            size="sm"
            variant="secondary"
            className="w-fit"
            onClick={() => {
              deleteParam('build');
            }}>
            Reset
          </Button>

          <p className="text-muted-foreground text-center text-xs">
            Type scale degrees (1-7) or decimals (e.g., 1.5 for maj7) to add
            chords. Press Enter to confirm or wait 500ms. Transpose in the
            sidebar.
          </p>
        </div>
        <Chords chords={buildChords} className="md:grid md:grid-cols-2 h-fit" />
      </div>
    </Container>
  );
};

export default Build;
