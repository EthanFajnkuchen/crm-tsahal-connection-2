import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CardDashboardProps {
  title: string;
  number: number | string;
  icon: LucideIcon;
  className?: string;
  isLoading: boolean;
  error: string | null;
}

const CardDashboard: React.FC<CardDashboardProps> = ({
  title,
  number,
  icon: Icon,
  className,
  isLoading,
  error,
}) => {
  return (
    <Card
      className={cn(
        "flex items-center justify-between p-6 w-content border-[#F3E7FF]",
        className
      )}
    >
      {isLoading || error ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col space-y-2 w-full">
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-8 w-3/4" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-2">
            <CardTitle className="text-sm ">{title}</CardTitle>
            <span className="text-3xl font-bold">{number}</span>
          </div>
          <Icon className="w-10 h-10" />
        </>
      )}
    </Card>
  );
};

export default CardDashboard;
