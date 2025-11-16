'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import Container from '@/components/container';
import Chords from '@/components/piano/chords';
import { Button } from '@/components/ui/button';
import { urlParams } from '@/lib/config';
import {
  baseConfig,
  type ChordProps,
  type Key,
  Piano,
  type Scale,
} from '@/lib/core/Piano';

const Build = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse build as scale degrees (1-7) for transposition
  const buildScaleDegrees: number[] =
    searchParams
      ?.get(urlParams.build)
      ?.split(',')
      .filter(Boolean)
      .map((s) => Number.parseInt(s, 10))
      .filter((n) => !Number.isNaN(n)) ?? [];

  const key: Key = (searchParams?.get(urlParams.key) as Key) ?? baseConfig.key;
  const scale: Scale =
    (searchParams?.get(urlParams.scale) as Scale) ?? baseConfig.scale;

  const chords = useMemo(() => {
    const selectedScale = new Piano({ key, scale });
    return selectedScale.getChords().slice(0, -1); // Get first 7 chords
  }, [key, scale]);

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

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
      if (scaleDegree && pathname) {
        const chord = chords.find((c) => c.scaleDegree === scaleDegree);
        if (chord) {
          const currentBuild = [...buildScaleDegrees, chord.scaleDegree];
          const queryString = createQueryString(
            urlParams.build,
            currentBuild.join(','),
          );
          router.push(`${pathname}?${queryString}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [buildScaleDegrees, chords, createQueryString, pathname, router]);

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
                  const queryString = createQueryString(
                    urlParams.build,
                    currentBuild.join(','),
                  );
                  const target = `${pathname}?${queryString}`;
                  router.push(target);
                }}>
                {chord.scaleDegree} - {chord.key}
              </Button>
            ))}
            <Button
              size="sm"
              variant="secondary"
              className="w-fit"
              onClick={() => {
                if (!pathname) return;
                const params = new URLSearchParams(
                  searchParams?.toString() || '',
                );
                params.delete(urlParams.build);
                router.push(`${pathname}?${params.toString()}`);
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
