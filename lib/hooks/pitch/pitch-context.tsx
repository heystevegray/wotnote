"use client"

import React, { createContext, ReactNode, useContext } from "react"

import usePitch from "./use-pitch"

export type PitchContextType = ReturnType<typeof usePitch>

const PitchContext = createContext<PitchContextType | undefined>(undefined)

export const PitchProvider = ({ children }: { children: ReactNode }) => {
  const pitchState = usePitch()
  return (
    <PitchContext.Provider value={pitchState}>{children}</PitchContext.Provider>
  )
}

export const usePitchContext = () => {
  const context = useContext(PitchContext)
  if (context === undefined) {
    throw new Error("usePitchContext must be used within a PitchProvider")
  }
  return context
}
