import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { NavItem } from "@/lib/types"
import { cn } from "@/lib/utils"

import { Icons } from "./icons"
import { SidebarTrigger } from "./ui/sidebar"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <div className="flex flex-row gap-2">
        <SidebarTrigger />
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="inline-block font-bold">{siteConfig.name}</h1>
        </Link>
      </div>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
