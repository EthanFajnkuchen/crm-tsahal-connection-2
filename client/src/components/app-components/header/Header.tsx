import React from "react";
import useCurrentPageName from "@/hooks/use-current-page-name";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header: React.FC = () => {
  const pageTitle = useCurrentPageName();

  return (
    <header className="p-4 shadow-md flex flex-row justify-between items-center font-[Poppins] ">
      <div>
        <h1 className="text-xl font-bold">{pageTitle}</h1>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <Input type="text" placeholder="Search" className="w-96" />
        <Avatar>
          <AvatarFallback className="bg-fuchsia-800 text-white">
            RM
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
