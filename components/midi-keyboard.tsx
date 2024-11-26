"use client"

import React, { useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"

import { urlParams } from "@/lib/config"
import {
  Key,
  MAX_KEY,
  MIN_KEY,
  Piano,
  Scale,
  baseConfig,
} from "@/lib/core/Piano"
import useMidi from "@/lib/hooks/use-midi"

import PianoRoll from "./piano/piano-roll"

interface KeyProperties {
  key: HTMLElement | null
  previousColor: string
}

const MidiKeyboard = () => {
  const midiConfig = useMidi()
  const searchParams = useSearchParams()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const key: Key = (searchParams.get(urlParams.key) as Key) ?? baseConfig.key
  const scale: Scale =
    (searchParams.get(urlParams.scale) as Scale) ?? baseConfig.scale
  const color =
    (searchParams.get(urlParams.color) as string) ?? "hsl(var(--primary))"

  const selectedScale = new Piano(key, scale)
  const notes = selectedScale.getNotes()
  const chords = selectedScale.getChords()

  const mapRange = (
    [in_min, in_max]: [number, number],
    [out_min, out_max]: [number, number],
    value: number
  ): number => {
    return (
      ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    )
  }

  const getOpacity = useCallback((velocity: number): string => {
    return mapRange([0, 80], [0, 1], velocity).toFixed(2)
  }, [])

  const keyOn = useCallback(
    (key: HTMLElement): void => {
      key.style.fill = color
      key.style.opacity =
        midiConfig?.midi?.velocity === 0
          ? "1"
          : getOpacity(midiConfig?.midi?.velocity)
    },
    [color, getOpacity, midiConfig.midi.velocity]
  )

  const keyOff = (
    key: HTMLElement,
    previousColor = "",
    forceOff = false
  ): void => {
    const keyCode = +key.id

    // Don't turn the note off if it's displaying the piano scale
    if (!forceOff && notes?.map((note) => note.code).includes(keyCode)) {
      key.style.fill = color
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
  }, [getOpacity, keyOn, midiConfig])

  return <PianoRoll chordIndex={0} activeNotes={notes} />
}

export default MidiKeyboard
