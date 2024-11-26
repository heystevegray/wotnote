import * as React from "react"
import { useState } from "react"
import { useAIState, useActions, useUIState } from "ai/rsc"
import { nanoid } from "nanoid"

import { cn } from "@/lib/utils"

import { ButtonScrollToBottom } from "./button-scroll-to-bottom"
import { PromptForm } from "./prompt-form"

function FooterText({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "px-2 text-center text-xs leading-normal text-muted-foreground",
        className
      )}
      {...props}
    >
      Trust but verify
    </p>
  )
}

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
  submitted?: boolean
  onSubmit: (value: string) => void
}

const formatQuestion = (question: string) => {
  const words = question.split(" ")
  const splitIndex = Math.ceil(words.length / 2)
  const heading = words.slice(0, splitIndex).join(" ")
  const subheading = words.slice(splitIndex).join(" ")
  return {
    heading,
    subheading,
    message: question,
  }
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

export const getRandomQuestions = (max = 4) => {
  const shuffled = exampleQuestions.slice().sort(() => Math.random() - 0.5)
  return shuffled.slice(0, max)
}

export function ChatPanel({
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  submitted = false,
  onSubmit,
}: ChatPanelProps) {
  const [examplePrompts] = useState(getRandomQuestions(8).map(formatQuestion))

  return (
    <div
      className="fixed inset-x-0 bottom-0 w-full pb-12
    duration-300 ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px] px-4"
    >
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
      <div className="mx-auto sm:max-w-2xl sm:px-4 max-w-lg">
        <div className="mb-4 grid grid-cols-2 gap-2 sm:px-0">
          {!submitted &&
            examplePrompts.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-xl border bg-card p-4 shadow ease-in-out transition-transform active:scale-95 hover:scale-105 hover:shadow-2xl ${
                  index > 1 && "hidden md:block"
                }`}
                onClick={async () => {
                  onSubmit(example.message)
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-muted-foreground">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>
        <div className="pb-4 space-y-4">
          <PromptForm input={input} setInput={setInput} onSubmit={onSubmit} />
          <FooterText className="" />
        </div>
      </div>
    </div>
  )
}
