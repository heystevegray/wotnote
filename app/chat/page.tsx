"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { readStreamableValue } from "ai/rsc"

import { urlParams } from "@/lib/config"
import { ChordProps, Key, Scale, baseConfig } from "@/lib/core/Piano"
import { capitalizeFirstLetter } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Container from "@/components/container"
import HeaderText from "@/components/header-text"
import Chords from "@/components/piano/chords"

import { generate } from "../actions"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

type Generation = {
  song?: {
    name: string
    artist: string
    key: Key
    scale: Scale
  }
} & { chords: ChordProps[] }

export default function Home() {
  const searchParams = useSearchParams()
  const [input, setInput] = useState("")
  const key = (searchParams.get(urlParams.key) as Key) ?? baseConfig.key
  const [generation, setGeneration] = useState<Generation>({
    song: undefined,
    chords: [],
  })

  const artist = generation?.song?.artist ?? ""
  const description = generation?.song?.key
    ? `in the key of $${generation?.song?.scale ?? ""}`
    : ""

  return (
    <Container className="pb-32">
      <HeaderText
        title={
          generation?.song?.name ?? "Type a song name below to generate chords"
        }
        description={`${artist} ${description}`}
      />
      <Chords chords={generation?.chords} />
      <Container>
        <div className="fixed bottom-20 right-0 bg-card w-full flex flex-row gap-2 items-center justify-center">
          <Input
            className="max-w-lg"
            value={input}
            placeholder="Hotline Bling by Drake"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            onClick={async () => {
              const { object } = await generate({
                key,
                input,
              })

              for await (const partialObject of readStreamableValue(object)) {
                if (partialObject) {
                  setGeneration(partialObject.data)
                }
              }
            }}
          >
            Ask
          </Button>
        </div>
      </Container>
    </Container>
  )
}
