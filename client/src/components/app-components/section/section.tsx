import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionProps {
  title: string;
  children?: React.ReactNode;
  onAction?: () => void;
  actionLabel?: string;
  actionLoading?: boolean;
  actionButtonClassName?: string;
  actionButtonContent?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  onAction,
  actionLabel,
  actionLoading = false,
  actionButtonClassName = "",
  actionButtonContent,
}) => {
  return (
    <div className="bg-white m-3 p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-[Poppins] font-semibold text-xl">{title}</h1>
        {onAction && (
          <Button
            onClick={onAction}
            disabled={actionLoading}
            className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center justify-center ${
              actionLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            } ${actionButtonClassName}`}
          >
            {actionLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              actionButtonContent || actionLabel
            )}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
};

export default Section;
