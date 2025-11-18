'use client';

import { type ReactElement, Suspense } from 'react';

import useParams from '@/lib/hooks/use-params';
import Container from '../container';
import MidiKeyboard from '../midi-keyboard';
import Chords from './chords';

const Keyboard = (): ReactElement => {
  const { chords } = useParams();

  return (
    <Suspense>
      <MidiKeyboard />
      <Container>
        <Chords chords={chords ?? []} />
      </Container>
    </Suspense>
  );
};

export default Keyboard;
