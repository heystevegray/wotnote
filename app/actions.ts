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
      **Task Description:** Generate piano chords for the input song in it's original key. Correct any typos in the input text and generate chords for the song.

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
      [
        {
            "id": "f837ed0d-d2f0-4fb7-9739-4e213b6d8d88",
            "chords": [
                {
                    "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
                    "scaleDegree": 1,
                    "lyrics": "Look at me",
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
                },
                {
                    "id": "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
                    "scaleDegree": 4,
                    "lyrics": "I'm as helpless as a kitten up a tree",
                    "key": "f",
                    "notes": [
                        {
                            "code": 65,
                            "key": "f"
                        },
                        {
                            "code": 69,
                            "key": "a"
                        },
                        {
                            "code": 72,
                            "key": "c"
                        }
                    ]
                },
                {
                    "id": "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
                    "scaleDegree": 5,
                    "lyrics": "And I feel like I'm clinging to a cloud",
                    "key": "g",
                    "notes": [
                        {
                            "code": 67,
                            "key": "g"
                        },
                        {
                            "code": 71,
                            "key": "b"
                        },
                        {
                            "code": 74,
                            "key": "d"
                        }
                    ]
                },
                {
                    "id": "4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
                    "scaleDegree": 1,
                    "lyrics": "I can't understand",
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
            ]
        },
      ...]
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
