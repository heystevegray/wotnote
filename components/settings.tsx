"use client"

import React, { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { urlParams } from "@/lib/config"
import {
  defaultConfig,
  Key,
  PIANO_KEYS,
  PIANO_SCALES,
  Scale,
} from "@/lib/core/Piano"
import { capitalizeFirstLetter } from "@/lib/utils"

import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { SidebarGroup, SidebarGroupLabel } from "./ui/sidebar"

const Settings = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const defaultKey: Key =
    (searchParams?.get(urlParams.key) as Key) ?? defaultConfig.key
  const defaultSacale: Scale =
    (searchParams?.get(urlParams.scale) as Scale) ?? defaultConfig.scale
  const defaultColor = searchParams?.get(urlParams.color) as string

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleKeyChange = (key: Key) => {
    router.push(pathname + "?" + createQueryString(urlParams.key, key))
  }

  const handleScaleChange = (scale: Scale) => {
    router.push(pathname + "?" + createQueryString(urlParams.scale, scale))
  }

  const handleColorChange = (color: string) => {
    router.push(pathname + "?" + createQueryString(urlParams.color, color))
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Key</SidebarGroupLabel>
      <Select defaultValue={defaultKey} onValueChange={handleKeyChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a Key" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {PIANO_KEYS.map((key) => (
              <SelectItem key={key} value={key}>
                {capitalizeFirstLetter(key)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <SidebarGroupLabel>Scale</SidebarGroupLabel>
      <Select defaultValue={defaultSacale} onValueChange={handleScaleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a Scale" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {PIANO_SCALES.map((scale) => (
              <SelectItem key={scale} value={scale}>
                {capitalizeFirstLetter(scale.replace(/-/g, " "))}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <SidebarGroupLabel>Color</SidebarGroupLabel>
      <Input
        type="color"
        defaultValue={defaultColor}
        onChange={(e) => handleColorChange(e.target.value)}
      />
    </SidebarGroup>
  )
}

export default Settings
