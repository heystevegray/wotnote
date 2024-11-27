import { Sparkle } from "lucide-react"

export const MY_WEBSITE_URL = "https://www.stevegray.io/"
export const MY_NAME = "Steve Gray"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "wotnote",
  description: "Write music faster",
  mainNav: [
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
