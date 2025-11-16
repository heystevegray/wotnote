'use client';

import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCallback, useEffect } from 'react';

import { urlParams } from '@/lib/config';
import {
  baseConfig,
  type Key,
  MAX_KEY,
  MIN_KEY,
  Piano,
  type Scale,
} from '@/lib/core/Piano';
import useMidi from '@/lib/hooks/use-midi';

import PianoRoll from './piano/piano-roll';

interface KeyProperties {
  key: HTMLElement | null;
  previousColor: string;
}

const MidiKeyboard = () => {
  const midiConfig = useMidi();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const key: Key = (searchParams?.get(urlParams.key) as Key) ?? baseConfig.key;
  const scale: Scale =
    (searchParams?.get(urlParams.scale) as Scale) ?? baseConfig.scale;
  const color =
    (searchParams?.get(urlParams.color) as string) ??
    'hsl(var(--key-highlight))';

  const selectedScale = new Piano({ key, scale });
  const notes = selectedScale.getNotes();

  const mapRange = (
    [in_min, in_max]: [number, number],
    [out_min, out_max]: [number, number],
    value: number,
  ): number => {
    return (
      ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: later
  const getOpacity = useCallback((velocity: number): string => {
    return mapRange([0, 80], [0, 1], velocity).toFixed(2);
  }, []);

  const keyOn = useCallback(
    (key: HTMLElement): void => {
      key.style.fill = color;
      key.style.opacity =
        midiConfig?.midi?.velocity === 0
          ? '1'
          : getOpacity(midiConfig?.midi?.velocity);
    },
    [color, getOpacity, midiConfig.midi.velocity],
  );

  const keyOff = useCallback(
    (key: HTMLElement, previousColor = '', forceOff = false): void => {
      const keyCode = +key.id;

      // Don't turn the note off if it's displaying the piano scale
      if (!forceOff && notes?.map((note) => note.code).includes(keyCode)) {
        key.style.fill = color;
      } else {
        key.style.fill = previousColor || '';
      }
      key.style.opacity = '1';
    },
    [color, notes],
  );

  const resetKeys = () => {
    // Reset all keys
    for (let index = MIN_KEY; index < MAX_KEY; index++) {
      const key = document.getElementById(`${index}`);
      if (key) {
        keyOff(key, '', true);
      }
    }
  };

  const getElementByKeyCode = (keyCode: number): KeyProperties => {
    const keyElement = document.getElementById(`${keyCode}`);
    const previousColor = isDark ? 'hsl(var(--key-dark))' : 'hsl(var(--key))';
    return { key: keyElement, previousColor };
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: shh
  useEffect(() => {
    resetKeys();

    if (key) {
      notes.forEach((keyboardCode) => {
        const { key } = getElementByKeyCode(keyboardCode.code);
        if (key) {
          keyOn(key);
        }
      });
    }
  }, [key, scale]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: shh
  useEffect(() => {
    if (midiConfig) {
      const key = document.getElementById(`${midiConfig.midi.value}`);

      if (key) {
        const previousColor = isDark
          ? 'hsl(var(--key-dark))'
          : 'hsl(var(--key))';

        if (midiConfig.midi.on) {
          keyOn(key);
        } else {
          keyOff(key, previousColor);
        }
      }
    }
  }, [getOpacity, isDark, keyOff, keyOn, midiConfig]);

  return <PianoRoll chordIndex={0} activeNotes={notes} />;
};

export default MidiKeyboard;
