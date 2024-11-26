"use client"

import * as React from "react"
import { useState } from "react"
import { ArrowUp } from "lucide-react"
import Textarea from "react-textarea-autosize"

import { useEnterSubmit } from "@/lib/hooks/use-enter-submit"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { ChatPanelProps, getRandomQuestions } from "./chat-panel"

export function PromptForm({
  input,
  setInput,
  onSubmit,
}: {
  input: string
  setInput: (value: string) => void
  onSubmit: ChatPanelProps["onSubmit"]
}) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [placeholder, setPlaceholder] = useState(getRandomQuestions(1))

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        setPlaceholder(getRandomQuestions(1))

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target["message"]?.blur()
        }

        const value = input.trim()

        if (value) {
          onSubmit(value)
        }
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-card px-4 pr-6 rounded-[30px] shadow-2xl items-center">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder={`${placeholder}`}
          className="min-h-[60px] w-full resize-none py-[1.3rem] pr-8 focus-within:outline-none sm:text-sm bg-transparent border-none placeholder:text-muted-foreground"
          autoFocus
          spellCheck={false}
          autoComplete="on"
          autoCorrect="on"
          name="message"
          rows={1}
          value={input}
          style={{
            outline: "none",
            boxShadow: "none",
          }}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="absolute right-4 bottom-3 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={input === ""}
                className="rounded-full"
              >
                <ArrowUp />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
