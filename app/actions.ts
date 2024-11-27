"use server"

import { openai } from "@ai-sdk/openai"
import { streamObject } from "ai"
import { createStreamableValue } from "ai/rsc"
import { z } from "zod"

import { Key } from "@/lib/core/Piano"

export async function generate({ key, input }: { key: Key; input: string }) {
  "use server"

  console.log({ key, input })

  const stream = createStreamableValue()

  ;(async () => {
    const { partialObjectStream } = streamObject({
      model: openai("gpt-4o-2024-08-06", {
        structuredOutputs: true,
      }),
      schemaName: "chords",
      schemaDescription: "Piano chords for a song.",
      system: `
      **Task Description:** Generate piano chords for a song given the key.

      **Input Parameters:**
      - input: The input text to generate chords for.
      - Optional parameters:
        - key: The key of the song (e.g., C, A).

      **Output Requirements:**
      1. **Chord Phrases:** Format chord progressions into phrases with a specific structure (e.g., each phrase contains 4 chords for example). 
      2. **Complete Song Structure:** Provide all necessary phrases to complete the song.

      **Error Handling:**
      - If unknown key or scale type, output: "There was an error processing '${input}'."

      **Example Format for Chord Progressions:**
      [Phrase 1, Phrase 2, ...]

      **Example Format for Chords:**
      {
        "scaleDegree": 1,
        "lyrics": "Now I've heard there was a secret chord",
        "key": "c",
        "notes": [
            {
                "code": 60,
                "key": "c"
            },
            {
                "code": 64,
                "key": "e"
            },
            {
                "code": 67,
                "key": "g"
            }
        ]
    }
      `,
      prompt: `${input}"`,
      // prompt: `${input} in the key of "${capitalizeFirstLetter(key)}."`,
      schema: z.object({
        song: z.object({
          name: z.string(),
          artist: z.string(),
          key: z
            .enum([
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
            ])
            .describe("The key of the song."),
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
              id: z
                .string()
                .describe(
                  "Unique uuid identifier for the phrase, example f837ed0d-d2f0-4fb7-9739-4e213b6d8d88."
                ),
              chords: z.array(
                z.object({
                  id: z
                    .string()
                    .describe(
                      "Unique uuid identifier for the chord, example f837ed0d-d2f0-4fb7-9739-4e213b6d8d88."
                    ),
                  scaleDegree: z
                    .number()
                    .describe("The scale degree of the chord."),
                  lyrics: z
                    .string()
                    .describe("The lyrics that map to this chord in the song"),
                  key: z
                    .enum([
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
                    ])
                    .describe(
                      "The root note of the current chord, example A, C, E"
                    ),
                  notes: z
                    .array(
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
                    )
                    .describe("The notes that make up this chrod."),
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
