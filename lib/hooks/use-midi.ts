import { useEffect, useRef, useState } from "react"

// https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-midi-api/

type ChordDictionary = Record<string, string>

const CHORD_DICTIONARY: ChordDictionary = {
  // **Triads**
  "0,4,7": "C Major",
  "0,3,7": "C Minor",
  "0,4,8": "C Augmented",
  "0,3,6": "C Diminished",

  "2,6,9": "D Major",
  "2,5,9": "D Minor",
  "2,6,10": "D Augmented",
  "2,5,8": "D Diminished",

  "4,8,11": "E Major",
  "4,7,11": "E Minor",
  "4,8,0": "E Augmented",
  "4,7,10": "E Diminished",

  "5,9,0": "F Major",
  "5,8,0": "F Minor",
  "5,9,1": "F Augmented",
  "5,8,11": "F Diminished",

  "7,11,2": "G Major",
  "7,10,2": "G Minor",
  "7,11,3": "G Augmented",
  "7,10,1": "G Diminished",

  "9,1,4": "A Major",
  "9,0,4": "A Minor",
  "9,1,5": "A Augmented",
  "9,0,3": "A Diminished",

  "11,3,6": "B Major",
  "11,2,6": "B Minor",
  "11,3,7": "B Augmented",
  "11,2,5": "B Diminished",

  // **6th Chords**
  "0,4,7,9": "C6",
  "0,3,7,9": "Cmin6",
  "2,6,9,11": "D6",
  "2,5,9,11": "Dmin6",
  "4,8,11,1": "E6",
  "4,7,11,1": "Emin6",
  "5,9,0,2": "F6",
  "5,8,0,2": "Fmin6",
  "7,11,2,4": "G6",
  "7,10,2,4": "Gmin6",
  "9,1,4,6": "A6",
  "9,0,4,6": "Amin6",
  "11,3,6,8": "B6",
  "11,2,6,8": "Bmin6",

  // **7th Chords**
  "0,4,7,10": "C7",
  "0,4,7,11": "Cmaj7",
  "0,3,7,10": "Cmin7",
  "0,3,6,10": "Cdim7",

  "2,6,9,0": "D7",
  "2,5,9,0": "Dmaj7",
  "2,5,9,11": "Dmin7",
  "2,5,8,11": "Ddim7",

  "4,8,11,2": "E7",
  "4,7,11,2": "Emaj7",
  "4,7,10,2": "Emin7",
  "4,7,10,1": "Edim7",

  "5,9,0,2": "F7",
  "5,9,0,4": "Fmaj7",
  "5,8,0,4": "Fmin7",
  "5,8,11,2": "Fdim7",

  "7,11,2,4": "G7",
  "7,11,2,5": "Gmaj7",
  "7,10,2,5": "Gmin7",
  "7,10,1,5": "Gdim7",

  "9,1,4,6": "A7",
  "9,1,4,7": "Amaj7",
  "9,0,4,7": "Amin7",
  "9,0,3,7": "Adim7",

  "11,3,6,8": "B7",
  "11,3,6,9": "Bmaj7",
  "11,2,6,9": "Bmin7",
  "11,2,5,8": "Bdim7",

  // **Extended Chords**
  "0,4,7,10,2": "C9",
  "0,4,7,11,2": "Cmaj9",
  "0,3,7,10,2": "Cmin9",

  "2,6,9,0,4": "D9",
  "2,5,9,0,4": "Dmaj9",
  "2,5,9,11,4": "Dmin9",

  "4,8,11,2,6": "E9",
  "4,7,11,2,6": "Emaj9",
  "4,7,10,2,6": "Emin9",

  "5,9,0,2,7": "F9",
  "5,9,0,4,7": "Fmaj9",
  "5,8,0,4,7": "Fmin9",

  "7,11,2,4,9": "G9",
  "7,11,2,5,9": "Gmaj9",
  "7,10,2,5,9": "Gmin9",

  "9,1,4,6,11": "A9",
  "9,1,4,7,11": "Amaj9",
  "9,0,4,7,11": "Amin9",

  "11,3,6,8,1": "B9",
  "11,3,6,9,1": "Bmaj9",
  "11,2,6,9,1": "Bmin9",
}

/**
 * Convert a MIDI note to its pitch class (0-11).
 */
const getPitchClass = (midiNote: number): number => midiNote % 12

/**
 * Get unique pitch classes from active MIDI notes.
 */
const getPitchClasses = (notes: Set<number>): number[] =>
  [...new Set([...notes].map(getPitchClass))].sort((a, b) => a - b)

/**
 * Detect the chord name from active MIDI notes.
 */
const detectChord = (activeNotes: Set<number>): string => {
  const pitchClassKey = getPitchClasses(activeNotes).join(",")
  return CHORD_DICTIONARY[pitchClassKey] || ""
}

export interface MIDInterface extends ChordProps {
  midiAccess: WebMidi.MIDIAccess | undefined
  midiConnectionEvent: WebMidi.MIDIConnectionEvent | undefined
  midiSupported: boolean | undefined
  midiPort?: WebMidi.MIDIPort | undefined
  midi: MidiNote
  inputs: Device[]
}

interface ChordProps {
  chords: {
    activeNotes: Key[]
    chordName?: string
  }
}

interface Key {
  value: number
  name: string
  octave: number
}

interface MidiNote extends Key {
  velocity: number
  on: boolean
}

interface Device {
  deviceName: string
  id: string
  connection: string
  name: string
  manufacturer: string
  state: string
  type: string
  version: string
}

const noteName: string[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
]

const initialNote: MidiNote = {
  value: 0,
  octave: 0,
  name: "N/a",
  velocity: 0,
  on: false,
}

const useMidi = (): MIDInterface => {
  const [activeNotes, setActiveNotes] = useState<Key[]>([])
  const [midiConfig, setMidiConfig] = useState<MIDInterface>({
    midiSupported: undefined,
    midiAccess: undefined,
    midiConnectionEvent: undefined,
    midi: initialNote,
    inputs: [],
    chords: {
      activeNotes: [],
      chordName: "",
    },
  })

  const midiConfigRef = useRef(midiConfig)

  const update = (data: Partial<MIDInterface>): void => {
    const merged = { ...midiConfigRef.current, ...data }
    midiConfigRef.current = merged
    setMidiConfig(merged)
  }

  const getKey = (midiNote: number): Key => {
    const octave: number = Math.floor(midiNote / 12 - 1)
    const noteIndex: number = midiNote % 12
    const name = noteName[noteIndex]
    return { value: midiNote, octave, name }
  }

  const getInputName = (input: WebMidi.MIDIInput): string => {
    return `${input.manufacturer} ${input.name}`.trim()
  }

  const onMIDISuccess = (midiAccess: any): void => {
    // Subscribe to Midi messages
    const inputs = midiAccess.inputs.values()
    const inputDevices: Device[] = []
    for (
      let input = inputs.next();
      input && !input.done;
      input = inputs.next()
    ) {
      inputDevices.push({
        connection: input.value.connection,
        id: input.value.id,
        name: input.value.name,
        manufacturer: input.value.manufacturer,
        state: input.value.state,
        type: input.value.type,
        version: input.value.version,
        deviceName: getInputName(input.value),
      })
      input.value.onmidimessage = getMIDIMessage
    }
    // Subscribe to Midi state changes
    midiAccess.onstatechange = getStateChange
    update({ midiSupported: true, midiAccess, inputs: inputDevices })
  }

  const onMIDIFailure = (message: string): void => {
    update({ midiSupported: false })
    console.log("Failed to get MIDI access - " + message)
  }

  const getStateChange = (message: WebMidi.MIDIConnectionEvent): void => {
    // console.log({ message });
    update({ midiConnectionEvent: message, midiPort: message.port })
  }

  const getMIDIMessage = (message: WebMidi.MIDIMessageEvent): void => {
    // console.log({ message })
    const command = message.data[0]
    const note = message.data[1]
    // a velocity value might not be included with a noteOff command
    const velocity = message.data.length > 2 ? message.data[2] : 0

    switch (command) {
      case 144: // note on
        if (velocity > 0) {
          update({ midi: { ...getKey(note), velocity, on: true } })

          console.log({ chords: activeNotes })

          // At least two notes to make a chord
          setActiveNotes((prev) => [...prev, getKey(note)])
        } else {
          update({ midi: { ...getKey(note), velocity, on: false } })
        }
        break
      case 128: // note off
        update({ midi: { ...getKey(note), velocity, on: false } })
        setActiveNotes((prev) => prev.filter((key) => key.value !== note))
        // onNoteEndCallback
        break
    }
  }

  useEffect(() => {
    const initialize = async (): Promise<any> => {
      try {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure)
      } catch (error) {
        console.log({ error })
        update({ midiSupported: false })
      }
    }

    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    ...midiConfig,
    chords: {
      activeNotes: activeNotes?.length > 1 ? activeNotes : [],
      chordName: detectChord(new Set(activeNotes.map((key) => key.value))),
    },
  }
}

export default useMidi
