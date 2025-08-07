import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SIDEBAR_ITEMS } from "@/i18n/sidebar-items";
import logoTsahalConnection from "@/assets/pictures/Logo Tsahal Conection.png";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth0 } from "@auth0/auth0-react";
import { RoleType } from "@/types/role-types";

export function AppSidebar() {
  const isMobile = useIsMobile();
  const { user } = useAuth0();

  return (
    <SidebarProvider>
      {isMobile && <SidebarTrigger className="mt-5 ml-2" />}
      <Sidebar collapsible="icon">
        <SidebarContent className="mt-10">
          <img
            src={logoTsahalConnection}
            width={80}
            height={80}
            className="mx-auto mb-7"
          />
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {!isMobile && <SidebarTrigger></SidebarTrigger>}
                {SIDEBAR_ITEMS.map((item) => {
                  if (
                    !user?.roleType?.some((role: RoleType) =>
                      item.roles.includes(role)
                    )
                  ) {
                    return null;
                  }
                  const isActive = location.pathname === item.link;
                  return (
                    <SidebarMenuItem
                      className="mt-3 mb-3 text-[18px]  hover:text-white"
                      key={item.displayName}
                    >
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-[#844edb] hover:text-white ${
                          isActive ? "text-white" : ""
                        } `}
                        isActive={isActive}
                      >
                        <a
                          href={item.link}
                          className={`flex items-center text-[16px] ${
                            isActive
                              ? "text-white bg-[#844edb] font-bold"
                              : "text-[#8774a2] font-semibold"
                          } font-[Poppins] py-5 `}
                        >
                          <item.icon
                            style={{
                              width: "24px",
                              height: "24px",
                            }}
                            className={`${
                              isActive ? "text-white" : "text-[#cd98e5]"
                            } hover:text-white`}
                          />

                          <span
                            className={`${
                              isActive ? "text-white font-bold" : ""
                            }`}
                          >
                            {item.displayName}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
