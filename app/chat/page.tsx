"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { readStreamableValue } from "ai/rsc"

import { urlParams } from "@/lib/config"
import {
  ChordProps,
  Key,
  Scale,
  baseConfig,
  convertToFlat,
} from "@/lib/core/Piano"
import { capitalizeFirstLetter } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Container from "@/components/container"
import {
  COMMAND_DIALOG_KEYBOARD_SHORTCUT,
  GenerateDialog,
} from "@/components/generation-command-dialog"
import HeaderText from "@/components/header-text"
import Chords from "@/components/piano/chords"

import { generate } from "../actions"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

type Phrase = { id: string; chords: ChordProps[]; phraseIndex: number }

export type Generation = {
  song?: {
    name: string
    artist: string
    key?: Key
    scale?: Scale
    error?: string | null
  } & { phrases?: Phrase[] }
}

const Phrase = ({ phrase }: { phrase: Phrase }) => {
  return (
    <div className="flex flex-col space-y-2 pt-4">
      <p>Phrase {phrase.phraseIndex}</p>
      <Chords chords={phrase.chords} key={phrase.id} />
    </div>
  )
}

export default function Home() {
  const searchParams = useSearchParams()
  const query = searchParams.get(urlParams.query) ?? ""
  const key = (searchParams.get(urlParams.key) as Key) ?? baseConfig.key
  const [open, setOpen] = useState(false)
  const [generation, setGeneration] = useState<Generation>()

  const artist = generation?.song?.artist
    ? `by ${generation?.song?.artist}`
    : ""
  const description =
    generation?.song?.scale && generation?.song?.key
      ? `in the key of ${capitalizeFirstLetter(
          convertToFlat(generation?.song?.key)
        )} ${capitalizeFirstLetter(generation?.song?.scale)}`
      : ""

  useEffect(() => {
    onSubmit(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const onSubmit = async (value: string) => {
    if (!value) {
      return
    }

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

  const song = generation?.song
  const isError = song?.error
  const errorMessage = song?.error || ""
  const name = song?.name
  const about = errorMessage || `${artist} ${description}` || ""

  const content = (
    <div className="mx-auto">
      <p className="hidden text-xl text-muted-foreground md:block">
        Press{" "}
        <kbd className="pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xl font-medium text-muted-foreground opacity-100">
          <span className="p text-xl">⌘</span>
          <span>{COMMAND_DIALOG_KEYBOARD_SHORTCUT.toUpperCase()}</span>
        </kbd>
      </p>
      <Button
        variant="secondary"
        className="block md:hidden"
        onClick={() => setOpen(true)}
      >
        Generate
      </Button>
    </div>
  )

  return (
    <Container className="pb-32">
      <HeaderText
        title={name || "Search a song to generate chords."}
        description={about}
      >
        {content}
      </HeaderText>
      {isError ? null : (
        <div className="space-y-6 divide-y">
          {song?.phrases?.map((phrase, index) => (
            <Phrase
              key={phrase.id}
              phrase={{ ...phrase, phraseIndex: index + 1 }}
            />
          ))}
        </div>
      )}
      <GenerateDialog show={open} setShow={setOpen} />
    </Container>
  )
}
