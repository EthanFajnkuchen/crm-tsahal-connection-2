import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SIDEBAR_ITEMS } from "@/i18n/sidebar-items";
import { AppSidebarToggle } from "@/components/app-components/sidebar/app-sidebar-toggle";
export function AppSidebar() {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <SidebarProvider>
      <Sidebar
        className={` transition-all duration-300 ${expanded ? "w-64" : "w-20"}`}
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="mt-3 mb-3" asChild>
                    <div className={`${expanded ? "flex justify-end" : ""}`}>
                      <AppSidebarToggle
                        expanded={expanded}
                        onToggle={() => setExpanded(!expanded)}
                      />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {SIDEBAR_ITEMS.map((item) => (
                  <SidebarMenuItem className="mt-3 mb-3" key={item.displayName}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.link}
                        className="flex items-center text-[18px] text-[white] hover:text-purple-400"
                      >
                        <item.icon
                          style={{ width: "20px", height: "20px" }}
                          className="ml-2"
                        />
                        {expanded && (
                          <span className="ml-2">{item.displayName}</span>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>Test</SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
