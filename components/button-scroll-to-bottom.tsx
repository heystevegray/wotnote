"use client"

import * as React from "react"
import { ArrowDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

interface ButtonScrollToBottomProps extends ButtonProps {
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ButtonScrollToBottom({
  className,
  isAtBottom,
  scrollToBottom,
  ...props
}: ButtonScrollToBottomProps) {
  return (
    <div className="flex w-full items-center justify-center">
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute top-1 z-10 bg-background transition-opacity duration-300 md:top-2 mx-auto items-center rounded-full",
          isAtBottom ? "opacity-0" : "opacity-100",
          className
        )}
        onClick={() => scrollToBottom()}
        {...props}
      >
        <ArrowDown />
        <span className="sr-only">Scroll to bottom</span>
      </Button>
    </div>
  )
}
