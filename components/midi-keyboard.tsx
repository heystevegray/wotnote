'use client';

import { useTheme } from 'next-themes';
import { useCallback, useEffect } from 'react';

import { MAX_KEY, MIN_KEY } from '@/lib/core/piano';
import useMidi from '@/lib/hooks/use-midi';
import useParams from '@/lib/hooks/use-params';
import PianoRoll from './piano/piano-roll';

interface KeyProperties {
  key: HTMLElement | null;
  previousColor: string;
}

const MidiKeyboard = () => {
  const midiConfig = useMidi();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { key, scale, color, notes } = useParams();

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
