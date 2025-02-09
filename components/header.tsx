"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

const hideDuration = 10000

export function SiteHeader() {
  const [hide, setHide] = useState(false)

  let timeoutId: NodeJS.Timeout

  const resetTimer = () => {
    clearTimeout(timeoutId)
    setHide(false)
    timeoutId = setTimeout(() => setHide(true), hideDuration)
  }

  useEffect(() => {
    timeoutId = setTimeout(() => setHide(true), hideDuration)
    window.addEventListener("mousemove", resetTimer)
    window.addEventListener("keydown", resetTimer)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("mousemove", resetTimer)
      window.removeEventListener("keydown", resetTimer)
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full bg-background">
      <div
        className={cn(
          "flex h-16 items-center space-x-4 px-3 sm:justify-between sm:space-x-0",
          {
            "fade-out": hide,
            "fade-in": !hide,
          }
        )}
      >
        <MainNav items={siteConfig.mainNav.filter((nav) => !nav.hideMain)} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  "rounded-full",
                  buttonVariants({
                    size: "icon",
                    variant: "ghost",
                  })
                )}
              >
                <Icons.gitHub className="size-6" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
