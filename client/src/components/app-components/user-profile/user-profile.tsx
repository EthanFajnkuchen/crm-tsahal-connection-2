import type React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type UserProfileProps = {
  fallback: string;
};

const UserProfile: React.FC<UserProfileProps> = ({ fallback }) => {
  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback className="bg-fuchsia-800 text-white">
            {fallback}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal focus-visible:ring-0"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfile;
