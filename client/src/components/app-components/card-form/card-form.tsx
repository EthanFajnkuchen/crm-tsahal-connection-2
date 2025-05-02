import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import {
  SideDrawer,
  SideDrawerContent,
  SideDrawerHeader,
  SideDrawerTitle,
  SideDrawerClose,
} from "@/components/ui/side-drawer";

interface CardFormProps {
  title: string;
  description: string;
  className?: string;
  drawerTitle?: string;
  drawerContent: (closeDrawer: () => void) => React.ReactNode;
}

const CardForm: React.FC<CardFormProps> = ({
  title,
  description,
  className,
  drawerTitle = "Créer un élément",
  drawerContent,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      <Card
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center justify-between p-6 w-full border-2 border-[#E5E7EB] hover:border-[#A855F7] hover:bg-violet-50 transition-colors cursor-pointer rounded-2xl",
          className
        )}
      >
        <div className="flex flex-col space-y-1">
          <h3 className="text-base font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <Plus className="w-8 h-8 text-violet-600" />
      </Card>

      <SideDrawer isOpen={isOpen} onClose={closeDrawer}>
        <SideDrawerContent isOpen={isOpen}>
          <SideDrawerHeader>
            <SideDrawerTitle>{drawerTitle}</SideDrawerTitle>
            <SideDrawerClose onClick={closeDrawer} />
          </SideDrawerHeader>
          {drawerContent(closeDrawer)}
        </SideDrawerContent>
      </SideDrawer>
    </>
  );
};

export default CardForm;
