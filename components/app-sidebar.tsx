import packageJson from 'package.json';
import { Suspense } from 'react';
// import useMidi from "@/lib/hooks/use-midi"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { siteConfig } from '@/lib/config';

import Settings from './settings';

export function AppSidebar() {
  // const data = useMidi()
  // const devices = data.inputs.map((input) => input.deviceName)

  return (
    <Sidebar>
      {/* <SidebarHeader>
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
      </SidebarHeader> */}
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {siteConfig.mainNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
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
        <p className="text-center text-sm">v{packageJson.version}</p>
      </SidebarFooter>
    </Sidebar>
  );
}
