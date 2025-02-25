import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { useBadgeStyle } from "@/hooks/use-badges-styles";

type BadgeProps = {
  status: string;
  icon?: LucideIcon;
};

const StatusBadge: React.FC<BadgeProps> = ({ status, icon: Icon }) => {
  const style = useBadgeStyle(status);

  return (
    <Badge
      className={`gap-1 rounded-full border-0 px-[10px] text-left text-[14px] font-normal ${style} hover:${style}`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {status}
    </Badge>
  );
};

export default StatusBadge;
