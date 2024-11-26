"use client"

import React, { ReactElement, Suspense } from "react"
import { useSearchParams } from "next/navigation"

import { urlParams } from "@/lib/config"
import { Key, Piano, Scale, baseConfig } from "@/lib/core/Piano"

import Container from "../container"
import MidiKeyboard from "../midi-keyboard"
import Chords from "./chords"

const Keyboard = (): ReactElement => {
  const searchParams = useSearchParams()
  const key: Key = (searchParams.get(urlParams.key) as Key) ?? baseConfig.key
  const scale: Scale =
    (searchParams.get(urlParams.scale) as Scale) ?? baseConfig.scale

  const selectedScale = new Piano({ key, scale })
  const chords = selectedScale.getChords()

  return (
    <Suspense>
      <MidiKeyboard />
      <Container>
        <Chords chords={chords ?? []} />
      </Container>
    </Suspense>
  )
}

export default Keyboard
