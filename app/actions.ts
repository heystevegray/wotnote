"use server"

import { openai } from "@ai-sdk/openai"
import { streamObject } from "ai"
import { createStreamableValue } from "ai/rsc"
import { z } from "zod"

import { Key } from "@/lib/core/Piano"
import { capitalizeFirstLetter } from "@/lib/utils"

export async function generate({ key, input }: { key: Key; input: string }) {
  "use server"

  console.log({ input })

  const stream = createStreamableValue()

  ;(async () => {
    const { partialObjectStream } = streamObject({
      model: openai("gpt-4o-2024-08-06", {
        structuredOutputs: true,
      }),
      schemaName: "chords",
      schemaDescription: "Piano chords for a song.",
      system: `You are an expert pianist. You are asked to generate the piano chords for a song. You are given the key of the song to generate chords for. Don't forget to infer the correct scale such as major or minor. Chords don't need to be limited to three notes. If you don't know the key, you can generate chords for a song in their most popular key. If you don't know the answer, say set the song error saying 'I don't know.'.

      Format the songs into phrases, each phrase has 4 chords for example. Then add all the phrases necessary to complete the song.
      `,
      prompt: `${input}"`,
      // prompt: `${input} in the key of "${capitalizeFirstLetter(key)}."`,
      schema: z.object({
        song: z.object({
          name: z.string(),
          artist: z.string(),
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
          // https://sdk.vercel.ai/providers/ai-sdk-providers/openai#structured-outputs
          error: z.string().nullable().describe("Error message if any."),
          scale: z.enum([
            "major",
            "harmonic-minor",
            "melodic-minor",
            "natural-minor",
          ]),
          phrases: z.array(
            z.object({
              id: z.string().describe("Unique uuid identifier for the phrase."),
              chords: z.array(
                z.object({
                  id: z
                    .string()
                    .describe("Unique uuid identifier for the chord."),
                  scaleDegree: z.number(),
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
                      code: z.number().describe("MIDI note code."),
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
            })
          ),
        }),
      }),
    })

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject)
    }

    stream.done()
  })()

  return { object: stream.value }
}
