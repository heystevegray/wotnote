import { KeyboardMusic, Sparkle } from "lucide-react"

import { Icons } from "@/components/icons"

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
      icon: KeyboardMusic,
      title: "Play",
      href: "/play",
    },
    {
      icon: Sparkle,
      title: "Chat",
      href: "/chat",
      isAI: true,
    },
  ],
  links: {
    github: "https://github.com/heystevegray/wotnote",
  },
}

export const urlParams = {
  key: "key",
  scale: "scale",
  color: "color",
  query: "q",
}
