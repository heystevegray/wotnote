// https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-midi-api/

import { useEffect, useRef, useState } from "react"

import { Chord, detectChord, MidiNote, NOTES } from "../core/keyboard"

export interface MIDIChordProps {
  chord?: Chord | null
}

export interface MIDInterface extends MIDIChordProps {
  midiAccess: WebMidi.MIDIAccess | undefined
  midiConnectionEvent: WebMidi.MIDIConnectionEvent | undefined
  midiSupported: boolean | undefined
  midiPort?: WebMidi.MIDIPort | undefined
  midi: MidiNoteProps
  midiNotes: MidiNote[]
  inputs: Device[]
}

export interface MidiNoteProps {
  midiNote: number
  name: string
  octave: number
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

const initialNote: MidiNoteProps = {
  midiNote: 0,
  octave: 0,
  name: "N/a",
  velocity: 0,
  on: false,
}

const useMidi = (): MIDInterface => {
  const [midiNotes, setMidiNotes] = useState<MidiNote[]>([])
  const [midiConfig, setMidiConfig] = useState<MIDInterface>({
    midiSupported: undefined,
    midiAccess: undefined,
    midiConnectionEvent: undefined,
    midi: initialNote,
    midiNotes: [],
    inputs: [],
    chord: null,
  })

  const midiConfigRef = useRef(midiConfig)

  const update = (data: Partial<MIDInterface>): void => {
    const merged = { ...midiConfigRef.current, ...data }
    midiConfigRef.current = merged
    setMidiConfig(merged)
  }

  const getKey = (midiNote: number) => {
    const octave: number = Math.floor(midiNote / 12 - 1)
    const noteIndex: number = midiNote % 12
    const name = NOTES[noteIndex].name
    return { midiNote, octave, name }
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
    update({ midiConnectionEvent: message, midiPort: message.port })
  }

  const getMIDIMessage = (message: WebMidi.MIDIMessageEvent): void => {
    const command = message.data[0]
    const code = message.data[1]
    // a velocity value might not be included with a noteOff command
    const velocity = message.data.length > 2 ? message.data[2] : 0

    switch (command) {
      case 144: // note on
        if (velocity > 0) {
          update({
            midi: { ...getKey(code), velocity, on: true },
          })

          // At least two notes to make a chord
          setMidiNotes((prev) => [
            ...prev,
            {
              code: code,
              key: getKey(code).name,
            },
          ])
        } else {
          update({ midi: { ...getKey(code), velocity, on: false } })
        }
        break
      case 128: // note off
        update({ midi: { ...getKey(code), velocity, on: false } })
        setMidiNotes((prev) => prev.filter((key) => key.code !== code))
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

  const chord = detectChord(new Set(midiNotes.map((key) => key.code)))

  return {
    ...midiConfig,
    chord,
  }
}

export default useMidi
