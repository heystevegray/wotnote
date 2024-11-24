"use client"

import React, { ReactElement, useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Select } from "@radix-ui/react-select"
import { Grid } from "lucide-react"
import { useTheme } from "next-themes"

import { urlParams } from "@/lib/config"
import {
  Chord as ChordType,
  Key,
  MAX_KEY,
  MIN_KEY,
  Note,
  PIANO_KEYS,
  PIANO_SCALES,
  Piano,
  Scale,
} from "@/lib/core/Piano"

import useMidi from "../../lib/hooks/use-midi"
import Container from "../container"
import Chords from "./chords"
import PianoRoll from "./piano-roll"

interface Props {
  activeColor?: string
  numberOfKeys?: 12 | 24 | 49 | 61 | 76 | 88
  // show note names.
}

interface KeyProperties {
  key: HTMLElement | null
  previousColor: string
}

const Keyboard = ({
  activeColor = "cyan",
  numberOfKeys = 88,
}: Props): ReactElement => {
  const midiConfig = useMidi()
  const searchParams = useSearchParams()

  const key: Key = (searchParams.get(urlParams.key) as Key) ?? PIANO_KEYS[0]
  const scale: Scale =
    (searchParams.get(urlParams.scale) as Scale) ?? PIANO_SCALES[0]

  const [notes, setNotes] = useState<Note[] | undefined>(undefined)
  const [chords, setChords] = useState<ChordType[] | undefined>(undefined)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const homeOnTheRange = (
    [in_min, in_max]: number[],
    [out_min, out_max]: number[],
    value: number
  ): number => {
    return (
      ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    )
  }

  const getOpacity = useCallback((velocity: number): string => {
    return homeOnTheRange([0, 80], [0, 1], velocity).toFixed(2)
  }, [])

  const keyOn = useCallback(
    (key: HTMLElement, overrideColor = ""): void => {
      key.style.fill = overrideColor || activeColor
      key.style.opacity =
        midiConfig?.midi?.velocity === 0
          ? "1"
          : getOpacity(midiConfig?.midi?.velocity)
    },
    [activeColor, getOpacity, midiConfig.midi.velocity]
  )

  const keyOff = (
    key: HTMLElement,
    previousColor = "",
    forceOff = false
  ): void => {
    const keyCode = +key.id

    // Don't turn the note off if it's displaying the piano scale
    if (!forceOff && notes?.map((note) => note.code).includes(keyCode)) {
      key.style.fill = "hsl(var(--primary))"
    } else {
      key.style.fill = previousColor || ""
    }
    key.style.opacity = "1"
  }

  const resetKeys = () => {
    // Reset all keys
    for (let index = MIN_KEY; index < MAX_KEY; index++) {
      const key = document.getElementById(`${index}`)
      if (key) {
        keyOff(key, "", true)
      }
    }
  }

  const getElementByKeyCode = (keyCode: number): KeyProperties => {
    const keyElement = document.getElementById(`${keyCode}`)
    const previousColor = isDark ? "red" : "blue"
    return { key: keyElement, previousColor }
  }

  useEffect(() => {
    resetKeys()

    if (key) {
      const selectedScale = new Piano(key, scale || "Major")

      const notes = selectedScale.getNotes()
      setNotes(notes)

      const chords = selectedScale.getChords()
      setChords(chords)

      notes.forEach((keyboardCode) => {
        const { key } = getElementByKeyCode(keyboardCode.code)
        if (key) {
          keyOn(key)
        }
      })
    }
  }, [key, scale])

  useEffect(() => {
    if (midiConfig) {
      const key = document.getElementById(`${midiConfig.midi.value}`)

      if (key) {
        const previousColor = isDark ? "orange" : "yellow"

        if (midiConfig.midi.on) {
          keyOn(key)
        } else {
          keyOff(key, previousColor)
        }
      }
    }
  }, [activeColor, getOpacity, keyOn, midiConfig])

  useEffect(() => {
    const keyboardOffset = MIN_KEY + numberOfKeys
    const keyGroup = document.getElementById("keys") as ChildNode
    for (let index = keyboardOffset; index <= MAX_KEY; index++) {
      const keyElement = document.getElementById(`${index}`) as ChildNode
      if (keyGroup && keyElement) {
        keyGroup.removeChild(keyElement)
      }
    }
  }, [numberOfKeys])

  return (
    <div>
      <PianoRoll chordIndex={0} height={200} />
      <Container>
        <Chords chords={chords ?? []} />
      </Container>
    </div>
  )
}

export default Keyboard
