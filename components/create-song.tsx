"use client"

import React from "react"
import { Sparkle } from "lucide-react"

import { generateSong } from "@/lib/chat"

import { Button } from "./ui/button"

const CreateSong = () => {
  return (
    <Button size="icon" variant="ghost" onClick={() => generateSong("")}>
      <Sparkle />
    </Button>
  )
}

export default CreateSong
