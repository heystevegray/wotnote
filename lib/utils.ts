import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { Generation } from "@/app/chat/page"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isDevelopment = process.env.NODE_ENV === "development"

export const capitalizeFirstLetter = (value: string) => {
  if (!value) {
    return ""
  }

  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export const camelCaseToTitleCase = (value: string) => {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
}

export const exampleQuestions = [
  "Hotline Bling by Drake",
  "Bohemian Rhapsody by Queen",
  "Stairway to Heaven by Led Zeppelin",
  "Hotel California by Eagles",
  "Sweet Child O’ Mine by Guns N’ Roses",
  "Yesterday by The Beatles",
  "Imagine by John Lennon",
  "Smells Like Teen Spirit by Nirvana",
  "Wonderwall by Oasis",
  "Hey Jude by The Beatles",
  "Let It Be by The Beatles",
  "With or Without You by U2",
  "Every Breath You Take by The Police",
  "Billie Jean by Michael Jackson",
  "Misty by Erroll Garner (Jazz Standard)",
  "Autumn Leaves by Joseph Kosma (Jazz Standard)",
  "Take Five by Dave Brubeck (Jazz Standard)",
  "Fly Me to the Moon by Frank Sinatra (Jazz Standard)",
  "What a Wonderful World by Louis Armstrong (Jazz Standard)",
  "Summertime by George Gershwin (Jazz Standard)",
]

export const generationInitialState: Generation = {
  song: {
    name: "",
    artist: "",
    key: undefined,
    scale: undefined,
    phrases: undefined,
    error: undefined,
  },
}

export const generationSample: Generation = {
  song: {
    name: "Sister Christian",
    artist: "Night Ranger",
    key: "g",
    error: null,
    scale: "major",
    phrases: [
      {
        phraseIndex: 1,
        id: "f837ed0d-d2f0-4fb7-9739-4e213b6d8d88",
        chords: [
          {
            id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
            scaleDegree: 1,
            lyrics: "Sister Christian, oh the time has come",
            key: "g",
            notes: [
              {
                code: 55,
                key: "g",
              },
              {
                code: 59,
                key: "b",
              },
              {
                code: 62,
                key: "d",
              },
            ],
          },
          {
            id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
            scaleDegree: 5,
            lyrics: "And you know that you're the only one",
            key: "d",
            notes: [
              {
                code: 50,
                key: "d",
              },
              {
                code: 54,
                key: "f#",
              },
              {
                code: 57,
                key: "a",
              },
            ],
          },
          {
            id: "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
            scaleDegree: 6,
            lyrics: "To say, okay",
            key: "e",
            notes: [
              {
                code: 52,
                key: "e",
              },
              {
                code: 55,
                key: "g",
              },
              {
                code: 59,
                key: "b",
              },
            ],
          },
          {
            id: "4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
            scaleDegree: 4,
            lyrics: "Where you going, what you looking for",
            key: "c",
            notes: [
              {
                code: 48,
                key: "c",
              },
              {
                code: 52,
                key: "e",
              },
              {
                code: 55,
                key: "g",
              },
            ],
          },
        ],
      },
      {
        phraseIndex: 2,
        id: "5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t",
        chords: [
          {
            id: "6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u",
            scaleDegree: 1,
            lyrics: "You know those boys don't want to play no more with you",
            key: "g",
            notes: [
              {
                code: 55,
                key: "g",
              },
              {
                code: 59,
                key: "b",
              },
              {
                code: 62,
                key: "d",
              },
            ],
          },
          {
            id: "7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v",
            scaleDegree: 5,
            lyrics: "It's true",
            key: "d",
            notes: [
              {
                code: 50,
                key: "d",
              },
              {
                code: 54,
                key: "f#",
              },
              {
                code: 57,
                key: "a",
              },
            ],
          },
          {
            id: "8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w",
            scaleDegree: 6,
            lyrics: "Motorin', what's your price for flight",
            key: "e",
            notes: [
              {
                code: 52,
                key: "e",
              },
              {
                code: 55,
                key: "g",
              },
              {
                code: 59,
                key: "b",
              },
            ],
          },
          {
            id: "9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x",
            scaleDegree: 4,
            lyrics: "In finding Mr. Right",
            key: "c",
            notes: [
              {
                code: 48,
                key: "c",
              },
              {
                code: 52,
                key: "e",
              },
              {
                code: 55,
                key: "g",
              },
            ],
          },
        ],
      },
    ],
  },
}
