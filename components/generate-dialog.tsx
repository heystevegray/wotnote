"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { urlParams } from "@/lib/config"
import { exampleQuestions } from "@/lib/utils"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { Icons } from "./icons"
import { Button } from "./ui/button"

export const COMMAND_DIALOG_KEYBOARD_SHORTCUT = "k"

export function GenerateDialog({
  show = false,
  setShow,
}: {
  show?: boolean
  setShow?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = React.useState(false)
  const query = searchParams.get(urlParams.query) ?? ""
  const [input, setInput] = React.useState(query)

  const handleClose = () => {
    setOpen(false)

    if (setShow) {
      setShow(false)
    }
  }

  const handleChange = (value: string) => {
    handleClose()

    router.push(pathname + "?" + createQueryString(urlParams.query, value))

    toast("Attempting to generate", {
      description: `“${value}”`,
    })
  }

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key === COMMAND_DIALOG_KEYBOARD_SHORTCUT &&
        (e.metaKey || e.ctrlKey)
      ) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (show) {
      setOpen(true)
    }
  }, [show])

  return (
    <CommandDialog open={open} onOpenChange={() => handleClose()}>
      <CommandInput
        value={input}
        onValueChange={setInput}
        defaultValue={query}
        placeholder="Type a song name to generate chords..."
      />
      <CommandList>
        <CommandEmpty>
          <Button variant="ai" onClick={() => handleChange(input)}>
            Search
          </Button>
        </CommandEmpty>
        {/* <CommandGroup heading="Side note">
          <p>There's a good change this wont work</p>
        </CommandGroup> */}
        <CommandGroup heading="Suggestions">
          {exampleQuestions.map((question) => (
            <CommandItem onSelect={(value) => handleChange(value)}>
              <Icons.logo />
              <span>{question}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
