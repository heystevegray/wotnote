"use client"

import React from "react"
import { useSearchParams } from "next/navigation"

import { urlParams } from "@/lib/config"
import { Chord } from "@/lib/core/keyboard"
import useMidi from "@/lib/hooks/use-midi"
import { camelCaseToTitleCase } from "@/lib/utils"
import Inversion from "@/components/inversion"
import MidiKeyboard from "@/components/midi-keyboard"

const detailOrder: (keyof Chord)[] = [
  "symbol",
  "tonic",
  "quality",
  "alias",
  "notes",
  "semitones",
  "degrees",
]

const Detail = ({
  label,
  value,
}: {
  label: string
  value?: string | string[] | number[] | null
}) => {
  let formattedValue = value

  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    formattedValue = value.join(", ")
  }

  return (
    <p className="text-muted-foreground">
      {camelCaseToTitleCase(label)}:{" "}
      <span className="text-foreground">{formattedValue}</span>
    </p>
  )
}

const Play = () => {
  const midiConfig = useMidi()

  const searchParams = useSearchParams()
  const color =
    (searchParams.get(urlParams.color) as string) ?? "hsl(var(--key-highlight))"

  const bassNote = midiConfig.chord?.bassNote
    ? `/ ${midiConfig.chord?.bassNote}`
    : ""

  const sortedDetails = detailOrder.map((key) => ({
    key,
    value: midiConfig.chord?.[key],
  }))

  return (
    <div className="flex h-[calc(100svh-64px)] flex-col">
      <div className="relative flex-1 flex-col p-4 text-center">
        <div className="flex h-full flex-col">
          <div className="flex flex-1 flex-col items-center justify-center">
            <h2
              className="text-6xl md:text-9xl 2xl:text-[10rem]"
              style={{
                color,
              }}
            >
              {midiConfig.chord?.tonic} {midiConfig.chord?.quality} {bassNote}
            </h2>
          </div>
          <div className="flex w-full items-end justify-between">
            <div className="flex flex-col items-start">
              {sortedDetails.map(({ key, value }) => (
                <Detail key={key} label={key} value={value} />
              ))}
            </div>
            <Inversion value={midiConfig.chord?.inversion} />
          </div>
          {/* <pre className="text-left text-sm text-muted-foreground">
            {JSON.stringify(midiConfig.details, null, 2)}
          </pre> */}
        </div>
      </div>
      <div className="">
        <MidiKeyboard disableScale />
      </div>
    </div>
  )
}

export default Play
