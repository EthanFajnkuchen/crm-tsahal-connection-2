import type React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
        <h2 className="text-sm ml-3 font-semibold">Raphael Madar</h2>
        <h3 className="text-sm ml-3 mt-1 text-gray-500">Administrateur</h3>
        <hr className="mt-1 mb-1" />
        <AlertDialog>
          <AlertDialogTrigger className="focus-visible:ring-0 focus:outline-none">
            <Button
              variant="ghost"
              className="w-full justify-start text-left font-normal focus-visible:ring-0 hover:bg-transparent"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Êtes-vous sûr de vouloir vous déconnecter ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Cette action mettra fin à votre session actuelle et vous devrez
                vous reconnecter pour accéder à votre compte.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction>Continuer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfile;
