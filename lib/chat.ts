"use server"

import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

import { Key } from "./core/Piano"
import { capitalizeFirstLetter } from "./utils"

export const generateSong = async ({
  key,
  input = "",
}: {
  key: Key
  input: string
}) => {
  console.log("Generating song...")

  const result = await generateObject({
    model: openai("gpt-4o-2024-08-06", {
      structuredOutputs: true,
    }),
    schemaName: "chords",
    schemaDescription: "Piano chords for a song.",
    schema: z.object({
      chords: z.array(
        z.object({
          key: z.enum([
            "c",
            "c#",
            "d",
            "d#",
            "e",
            "f",
            "f#",
            "g",
            "g#",
            "a",
            "a#",
            "b",
          ]),
          notes: z.array(
            z.object({
              code: z.number(),
              key: z.enum([
                "c",
                "c#",
                "d",
                "d#",
                "e",
                "f",
                "f#",
                "g",
                "g#",
                "a",
                "a#",
                "b",
              ]),
            })
          ),
        })
      ),
    }),
    system:
      "You are an expert pianist. You are asked to generate the piano chords for a song. You are given the key of the song to generate chords for. If you are not provided with a song or don't know the key, you can generate chords for a song in any key. If you don't know the answer, say 'I don't know.'",
    prompt: `${input} in the key of "${capitalizeFirstLetter(key)}."`,
  })

  console.log(JSON.stringify(result.object, null, 2))

  return result.object
}
