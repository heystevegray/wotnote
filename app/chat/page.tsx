"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { readStreamableValue } from "ai/rsc"
import { toast } from "sonner"

import { urlParams } from "@/lib/config"
import { ChordProps, Key, Scale, baseConfig } from "@/lib/core/Piano"
import { capitalizeFirstLetter } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Container from "@/components/container"
import {
  COMMAND_DIALOG_KEYBOARD_SHORTCUT,
  GenerateDialog,
} from "@/components/generate-dialog"
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
  const query = searchParams.get(urlParams.query) ?? ""
  const key = (searchParams.get(urlParams.key) as Key) ?? baseConfig.key
  const [open, setOpen] = useState(false)
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

  useEffect(() => {
    onSubmit(query)
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

  const isError = generation?.song?.error
  const song = generation?.song?.name
  const about = isError ? generation.song?.error : `${artist} ${description}`

  const content = (
    <div>
      <p className="text-xl text-muted-foreground lg:block hidden">
        Press{" "}
        <kbd className="pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xl font-medium text-muted-foreground opacity-100">
          <span className="text-xl p">⌘</span>
          {COMMAND_DIALOG_KEYBOARD_SHORTCUT.toUpperCase()}
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
    <Container className="pb-32 space-y-8">
      <HeaderText
        title={generation?.song?.name || "Search a song to generate chords."}
        description={about}
      >
        {content}
      </HeaderText>
      {isError ? null : <Chords chords={generation?.song?.chords ?? []} />}
      <GenerateDialog show={open} setShow={setOpen} />
    </Container>
  )
}
