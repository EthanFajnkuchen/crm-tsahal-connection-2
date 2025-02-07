import React from "react";
import useCurrentPageName from "@/hooks/use-current-page-name";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SearchInput } from "../input/search-input";
const Header: React.FC = () => {
  const pageTitle = useCurrentPageName();

  return (
    <header className="p-4 md:shadow-md flex flex-row justify-between items-center font-[Poppins] ">
      <div>
        <h1 className="text-xl font-bold">{pageTitle}</h1>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <SearchInput
          type="text"
          placeholder="Search"
          className="w-48 lg:w-96"
        />
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
