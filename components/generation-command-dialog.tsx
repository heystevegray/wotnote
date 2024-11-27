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

import Gradient from "./gradient"
import { Icons } from "./icons"

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
    <CommandDialog
      open={open}
      onOpenChange={() => handleClose()}
      title="Generate Chords"
    >
      <CommandInput
        value={input}
        onValueChange={setInput}
        placeholder="Type a song name to generate chords..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && input) {
            // Prevent the default action
            e.preventDefault()
            // Call the handleChange function with the input value
            handleChange(input)
          }
        }}
      />
      <CommandList className="relative">
        <CommandEmpty>
          <Gradient />
          <p className="relative mx-auto flex justify-center p-2 text-center text-lg">
            Hit enter, you wont...
            {/* There's a good change this wont work. */}
          </p>
        </CommandEmpty>
        <CommandGroup heading="Suggestions">
          {exampleQuestions.map((question, index) => (
            <CommandItem onSelect={(value) => handleChange(value)} key={index}>
              <Icons.logo />
              <span>{question}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
