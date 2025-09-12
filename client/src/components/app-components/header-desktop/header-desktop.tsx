import React from "react";
import useCurrentPageName from "@/hooks/use-current-page-name";
import { SearchInput } from "@/components/app-components/search-input/search-input";
import UserProfile from "@/components/app-components/user-profile/user-profile";
import ProtectedComponent from "../protected-component/protected-component";

const HeaderDesktop: React.FC = () => {
  const pageTitle = useCurrentPageName();

  return (
    <header className="sticky top-0 z-10 p-4 bg-white flex flex-row justify-between items-center font-[Poppins] ">
      <div>
        <h1 className="text-xl font-bold">{pageTitle}</h1>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <ProtectedComponent>
          <SearchInput
            type="text"
            placeholder="Search"
            className="w-48 lg:w-96"
          />
        </ProtectedComponent>
        <UserProfile />
      </div>
    </header>
  );
};

export default HeaderDesktop;
