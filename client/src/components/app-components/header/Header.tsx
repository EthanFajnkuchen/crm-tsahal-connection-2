import React from "react";
import useCurrentPageName from "@/hooks/use-current-page-name";
import { SearchInput } from "@/components/app-components/search-input/search-input";
import UserProfile from "@/components/app-components/user-profile/user-profile";

const Header: React.FC = () => {
  const pageTitle = useCurrentPageName();

  return (
    <header className="p-4 md:shadow-md bg-white flex flex-row justify-between items-center font-[Poppins] ">
      <div>
        <h1 className="text-xl font-bold">{pageTitle}</h1>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <SearchInput
          type="text"
          placeholder="Search"
          className="w-48 lg:w-96"
        />
        <UserProfile fallback="RM" />
      </div>
    </header>
  );
};

export default Header;
