import { Blocks, Sparkle } from "lucide-react"

import { Icons } from "@/components/icons"
import { DefaultConfig } from './core/piano'

export const MY_WEBSITE_URL = "https://www.stevegray.io/"
export const MY_NAME = "Steve Gray"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "wotnote",
  description: "Write music faster",
  mainNav: [
    {
      icon: Icons.logo,
      title: "Home",
      href: "/",
      hideMain: true,
    },
    {
      icon: Sparkle,
      title: "Chat",
      href: "/chat",
      isAI: true,
    },
    {
      icon: Blocks,
      title: "Build",
      href: "/build",
    },
  ],
  links: {
    github: "https://github.com/heystevegray/wotnote",
  },
}

export const urlParams: Record<keyof DefaultConfig, string> = {
  key: "key",
  scale: "scale",
  color: "color",
  query: "q",
  build: "build",
}
