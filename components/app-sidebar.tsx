import { Suspense } from "react"
import packageJson from "package.json"

// import useMidi from "@/lib/hooks/use-midi"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"

import Settings from "./settings"

export function AppSidebar() {
  // const data = useMidi()
  // const devices = data.inputs.map((input) => input.deviceName)

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        {/* <SidebarGroup>
            <SidebarGroupLabel>MIDI</SidebarGroupLabel>
            <SidebarGroup>
              <SidebarGroupLabel>Device</SidebarGroupLabel>
              <div className="flex flex-col gap-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a MIDI Device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {devices.map((device) => (
                        <SelectItem key={device} value={device}>
                          {device}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-xs">
                  Connect a MIDI device to visualize what you play.
                </p>
              </div>
            </SidebarGroup>
          </SidebarGroup> */}
        <SidebarGroup>
          <SidebarGroupLabel>Piano</SidebarGroupLabel>
          <Suspense>
            <Settings />
          </Suspense>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p>v{packageJson.version}</p>
      </SidebarFooter>
    </Sidebar>
  )
}
