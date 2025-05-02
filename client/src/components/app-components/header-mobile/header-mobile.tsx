"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LogoTsahalConnection from "@/assets/pictures/Logo Tsahal Conection.png";
import { SIDEBAR_ITEMS } from "@/i18n/sidebar-items";
import useCurrentPageName from "@/hooks/use-current-page-name";
import { SearchInput } from "../search-input/search-input";
import UserProfile from "@/components/app-components/user-profile/user-profile";

export function HeaderMobile() {
  const [open, setOpen] = useState(false);
  const currentPage = useCurrentPageName();
  const location = window.location;

  return (
    <header className="!sticky !top-0 !z-50 w-full border-b !bg-white backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col px-2 py-2 gap-3">
        <div className="flex items-center justify-between w-full">
          <Sheet open={open} onOpenChange={setOpen}>
            <div className="flex items-center gap-3">
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                  <Menu style={{ width: "24px", height: "24px" }} />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <h1 className="font-[Poppins] font-bold text-xl">
                {currentPage}
              </h1>
            </div>
            <SheetContent side="left" className="w-[280px] p-0 bg-white">
              <div className="flex flex-col h-full">
                <div className="p-4 flex justify-center">
                  <img
                    src={LogoTsahalConnection || "/placeholder.svg"}
                    width={80}
                    height={80}
                    className="mb-7 mt-6"
                    alt="Tsahal Connection Logo"
                  />
                </div>
                <nav className="px-2">
                  {SIDEBAR_ITEMS.map((item) => {
                    const isActive = location.pathname === item.link;
                    return (
                      <Link
                        key={item.link}
                        to={item.link}
                        className={`flex items-center py-5 px-4 text-[16px] rounded-md mb-3 transition-colors
                          ${
                            isActive
                              ? "bg-[#844edb] text-white font-bold"
                              : "text-[#8774a2] hover:bg-[#844edb] hover:text-white font-semibold"
                          }
                        `}
                        onClick={() => setOpen(false)}
                      >
                        <item.icon
                          className={`mr-2 ${
                            isActive ? "text-white" : "text-[#cd98e5]"
                          } hover:text-white`}
                          style={{
                            width: "24px",
                            height: "24px",
                          }}
                        />
                        <span className="font-[Poppins]">
                          {item.displayName}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <UserProfile />
        </div>
        <div className="w-full">
          <SearchInput type="text" placeholder="Search" className="w-full" />
        </div>
      </div>
    </header>
  );
}
