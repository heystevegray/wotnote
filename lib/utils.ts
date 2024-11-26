import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalizeFirstLetter = (value: string) => {
  if (!value) {
    return ""
  }

  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
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
