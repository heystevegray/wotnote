"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { readStreamableValue } from "ai/rsc"
import { toast } from "sonner"

import { urlParams } from "@/lib/config"
import { ChordProps, Key, Scale, baseConfig } from "@/lib/core/Piano"
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor"
import { capitalizeFirstLetter } from "@/lib/utils"
import { ChatPanel } from "@/components/chat-panel"
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
    key?: Key
    scale?: Scale
    error?: string
  } & { chords: ChordProps[] }
}

export default function Home() {
  const searchParams = useSearchParams()
  const [input, setInput] = useState("")
  const key = (searchParams.get(urlParams.key) as Key) ?? baseConfig.key
  const [submitted, setSubmitted] = useState(false)
  const [generation, setGeneration] = useState<Generation>({
    song: {
      name: "",
      artist: "",
      key: undefined,
      scale: undefined,
      chords: [],
      error: undefined,
    },
  })

  const artist = generation?.song?.artist
    ? `by ${generation?.song?.artist}`
    : ""
  const description =
    generation?.song?.scale && generation?.song?.key
      ? `in the key of ${capitalizeFirstLetter(
          generation?.song?.key
        )} ${capitalizeFirstLetter(generation?.song?.scale)}`
      : ""

  const { isAtBottom, scrollToBottom } = useScrollAnchor()

  const onSubmit = async (value: string) => {
    if (!value) {
      toast.error("Please type a song name.")
      return
    }

    setSubmitted(true)

    const { object } = await generate({
      key,
      input: value,
    })

    for await (const partialObject of readStreamableValue(object)) {
      if (partialObject) {
        console.log(partialObject)
        const generation = partialObject as Generation
        setGeneration(generation)
      }
    }
  }

  const isError = generation?.song?.error
  const about = isError ? generation.song?.error : `${artist} ${description}`

  return (
    <Container className="pb-32">
      <HeaderText
        title={generation?.song?.name || "Type a song name below."}
        description={about}
      />
      {isError ? null : <Chords chords={generation?.song?.chords ?? []} />}
      <ChatPanel
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        submitted={submitted}
        onSubmit={onSubmit}
      />
    </Container>
  )
}
