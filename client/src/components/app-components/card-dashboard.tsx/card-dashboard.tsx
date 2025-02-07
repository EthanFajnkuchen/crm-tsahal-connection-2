import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CardDashboardProps {
  title: string;
  number: number | string;
  icon: LucideIcon;
  className?: string;
}

const CardDashboard: React.FC<CardDashboardProps> = ({
  title,
  number,
  icon: Icon,
  className,
}) => {
  return (
    <Card
      className={cn(
        "flex items-center justify-between p-6 w-content border-[#F3E7FF]",
        className
      )}
    >
      <div className="flex flex-col space-y-2">
        <CardTitle className="text-sm ">{title}</CardTitle>
        <span className="text-3xl font-bold">{number}</span>
      </div>
      <Icon className="w-10 h-10" />
    </Card>
  );
};

export default CardDashboard;
