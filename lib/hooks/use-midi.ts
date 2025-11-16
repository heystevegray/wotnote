import { useEffect, useRef, useState } from 'react';

// https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-midi-api/

export interface MIDInterface {
  midiAccess: WebMidi.MIDIAccess | undefined;
  midiConnectionEvent: WebMidi.MIDIConnectionEvent | undefined;
  midiSupported: boolean | undefined;
  midiPort?: WebMidi.MIDIPort | undefined;
  midi: MidiNote;
  inputs: Device[];
}

interface Key {
  value: number;
  name: string;
  octave: number;
}

interface MidiNote extends Key {
  velocity: number;
  on: boolean;
}

interface Device {
  deviceName: string;
  id: string;
  connection: string;
  name: string;
  manufacturer: string;
  state: string;
  type: string;
  version: string;
}

const noteName: string[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

const initialNote: MidiNote = {
  value: 0,
  octave: 0,
  name: 'N/a',
  velocity: 0,
  on: false,
};

const useMidi = (): MIDInterface => {
  const [midiConfig, setMidiConfig] = useState<MIDInterface>({
    midiSupported: undefined,
    midiAccess: undefined,
    midiConnectionEvent: undefined,
    midi: initialNote,
    inputs: [],
  });

  const midiConfigRef = useRef(midiConfig);

  const update = (data: Partial<MIDInterface>): void => {
    const merged = { ...midiConfigRef.current, ...data };
    midiConfigRef.current = merged;
    setMidiConfig(merged);
  };

  const getKey = (midiNote: number): Key => {
    const octave: number = Math.floor(midiNote / 12 - 1);
    const noteIndex: number = midiNote % 12;
    const name = noteName[noteIndex];
    return { value: midiNote, octave, name };
  };

  const getInputName = (input: WebMidi.MIDIInput): string => {
    return `${input.manufacturer} ${input.name}`.trim();
  };

  const onMIDISuccess = (midiAccess: WebMidi.MIDIAccess): void => {
    // Subscribe to Midi messages
    const inputs = midiAccess.inputs.values();
    const inputDevices: Device[] = [];
    for (
      let input = inputs.next();
      input && !input.done;
      input = inputs.next()
    ) {
      inputDevices.push({
        connection: input.value.connection,
        id: input.value.id,
        name: input.value.name || '',
        manufacturer: input.value.manufacturer || '',
        state: input.value.state,
        type: input.value.type,
        version: input.value.version || '',
        deviceName: getInputName(input.value),
      });
      input.value.onmidimessage = getMIDIMessage;
    }
    // Subscribe to Midi state changes
    midiAccess.onstatechange = getStateChange;
    update({ midiSupported: true, midiAccess, inputs: inputDevices });
  };

  const onMIDIFailure = (message: string): void => {
    update({ midiSupported: false });
    console.log(`Failed to get MIDI access - ${message}`);
  };

  const getStateChange = (message: WebMidi.MIDIConnectionEvent): void => {
    // console.log({ message });
    update({ midiConnectionEvent: message, midiPort: message.port });
  };

  const getMIDIMessage = (message: WebMidi.MIDIMessageEvent): void => {
    // console.log({ message })
    const command = message.data[0];
    const note = message.data[1];
    // a velocity value might not be included with a noteOff command
    const velocity = message.data.length > 2 ? message.data[2] : 0;

    switch (command) {
      case 144: // note on
        if (velocity > 0) {
          update({ midi: { ...getKey(note), velocity, on: true } });
        } else {
          update({ midi: { ...getKey(note), velocity, on: false } });
        }
        break;
      case 128: // note off
        update({ midi: { ...getKey(note), velocity, on: false } });
        // onNoteEndCallback
        break;
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: hey
  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
      } catch (error) {
        console.log({ error });
        update({ midiSupported: false });
      }
    };

    initialize();
  }, []);

  return midiConfig;
};

export default useMidi;
