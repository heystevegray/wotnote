"use client"

import React, { useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import { urlParams } from "@/lib/config"
import { baseConfig, Key, Piano, Scale } from "@/lib/core/Piano"
import useMidi from "@/lib/hooks/use-midi"

import PianoRoll from "./piano/piano-roll"

interface KeyProperties {
  key: HTMLElement | null
  previousColor: string
}

const MidiKeyboard = ({ disableScale = false }: { disableScale?: boolean }) => {
  const midiConfig = useMidi()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    if (midiConfig.midiSupported) {
      midiConfig.inputs.forEach((input) => {
        toast.success("MIDI connected", {
          description: input.deviceName,
        })
      })
    } else {
      toast.error("MIDI not supported", {
        description: "Please use a supported browser",
      })
    }
  }, [midiConfig.inputs, midiConfig.midiSupported])

  const searchParams = useSearchParams()
  const key: Key = (searchParams.get(urlParams.key) as Key) ?? baseConfig.key
  const scale: Scale =
    (searchParams.get(urlParams.scale) as Scale) ?? baseConfig.scale
  const color =
    (searchParams.get(urlParams.color) as string) ?? "hsl(var(--key-highlight))"

  const selectedScale = React.useMemo(
    () => new Piano({ key, scale }),
    [key, scale]
  )
  const notes = React.useMemo(
    () => (disableScale ? [] : selectedScale.getNotes()),
    [disableScale, selectedScale]
  )

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

  const keyOff = useCallback(
    (key: HTMLElement, previousColor = "", forceOff = false): void => {
      const keyCode = +key.id

      // Don't turn the note off if it's displaying the piano scale
      if (!forceOff && notes?.map((note) => note.code).includes(keyCode)) {
        key.style.fill = color
      } else {
        key.style.fill = previousColor || ""
      }
      key.style.opacity = "1"
    },
    [color, notes]
  )

  // const resetKeys = () => {
  //   // Reset all keys
  //   for (let index = MIN_KEY; index < MAX_KEY; index++) {
  //     const key = document.getElementById(`${index}`)
  //     if (key) {
  //       keyOff(key, "", true)
  //     }
  //   }
  // }

  const getElementByKeyCode = (keyCode: number): KeyProperties => {
    const keyElement = document.getElementById(`${keyCode}`)
    const previousColor = isDark ? "hsl(var(--key-dark))" : "hsl(var(--key))"
    return { key: keyElement, previousColor }
  }

  useEffect(() => {
    // resetKeys()

    if (key) {
      notes.forEach((keyboardCode) => {
        const { key } = getElementByKeyCode(keyboardCode.code)
        if (key) {
          keyOn(key)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, scale])

  useEffect(() => {
    if (midiConfig) {
      const key = document.getElementById(`${midiConfig.midi.midiNote}`)

      if (key) {
        if (midiConfig.midi.on) {
          keyOn(key)
        } else {
          keyOff(key, "")
        }
      }
    }
  }, [getOpacity, isDark, keyOff, keyOn, midiConfig])

  return <PianoRoll chordIndex={0} activeNotes={notes} />
}

export default MidiKeyboard
