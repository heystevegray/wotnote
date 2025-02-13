import "@/app/globals.css"

import { Metadata, Viewport } from "next"
import { cookies } from "next/headers"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "sonner"

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

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          defer
          src="https://analytics.jfay.dev/script.js"
          data-website-id="70799b6a-0adc-4d93-baff-423766a9efab"
        ></script>
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen w-full flex-col">
              <SiteHeader />
              <main className="flex-1">
                {/* <MidiKeyboard /> */}
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
            <Analytics />
            <TailwindIndicator />
          </ThemeProvider>
        </SidebarProvider>
      </body>
    </html>
  )
}
