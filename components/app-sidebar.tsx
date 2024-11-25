"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import packageJson from "package.json"

import { urlParams } from "@/lib/config"
import {
  Key,
  PIANO_KEYS,
  PIANO_SCALES,
  Scale,
  baseConfig,
} from "@/lib/core/Piano"
import useMidi from "@/lib/hooks/use-midi"
import { capitalizeFirstLetter } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const data = useMidi()
  const devices = data.inputs.map((input) => input.deviceName)

  const searchParams = useSearchParams()
  const defaultKey: Key =
    (searchParams.get(urlParams.key) as Key) ?? baseConfig.key
  const defaultSacale: Scale =
    (searchParams.get(urlParams.scale) as Scale) ?? baseConfig.scale
  const defaultColor = searchParams.get(urlParams.color) as string

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
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
    <Sidebar>
      <SidebarHeader>Settings</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MIDI</SidebarGroupLabel>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      Select a MIDI Device
                      <ChevronDown className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                    {devices.map((device) => (
                      <DropdownMenuItem key={device}>
                        <span>{device}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarGroup>
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
          <Select
            defaultValue={defaultSacale}
            onValueChange={handleScaleChange}
          >
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
      </SidebarContent>
      <SidebarFooter>
        <p>v{packageJson.version}</p>
      </SidebarFooter>
    </Sidebar>
  )
}
