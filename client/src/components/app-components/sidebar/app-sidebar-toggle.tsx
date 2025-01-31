import { PanelLeftOpen, PanelLeftClose } from "lucide-react";

interface AppSidebarToggleProps {
  expanded: boolean;
  onToggle: () => void;
}

export function AppSidebarToggle({
  expanded,
  onToggle,
}: AppSidebarToggleProps) {
  return (
    <button onClick={onToggle} className="p-2 rounded-md transition-all ">
      {expanded ? (
        <PanelLeftClose className="h-5 w-5 text-white" />
      ) : (
        <PanelLeftOpen className="h-5 w-5 text-white" />
      )}
    </button>
  );
}
