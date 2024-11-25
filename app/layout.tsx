import "@/app/globals.css"
import { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/react"

import { siteConfig } from "@/lib/config"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Footer from "@/components/footer"
import { SiteHeader } from "@/components/header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "cyan" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SidebarProvider>
          <AppSidebar />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col w-full">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Analytics />
            <TailwindIndicator />
          </ThemeProvider>
        </SidebarProvider>
      </body>
    </html>
  )
}
