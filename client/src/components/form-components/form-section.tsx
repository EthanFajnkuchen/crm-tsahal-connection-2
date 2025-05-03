import * as React from "react";
import { Button } from "@/components/ui/button";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  mode?: "EDIT" | "VIEW";
  onModeChange?: () => void;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

interface FormSubSectionProps {
  title: string;
  children: React.ReactNode;
  mode?: "EDIT" | "VIEW";
}

interface FormChildProps {
  mode?: "EDIT" | "VIEW";
}

const FormSubSection: React.FC<FormSubSectionProps> = ({
  title,
  children,
  mode,
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-xl font-medium text-black">{title}</h4>
      <div className="grid grid-cols-3 gap-4">
        {React.Children.map(children, (child) => {
          if (React.isValidElement<FormChildProps>(child)) {
            return React.cloneElement(child, { mode });
          }
          return child;
        })}
      </div>
    </div>
  );
};

const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  onSave,
}) => {
  const [mode, setMode] = React.useState<"EDIT" | "VIEW">("VIEW");

  const handleSave = () => {
    if (onSave) {
      onSave({});
    }
    setMode("VIEW");
  };

  const handleCancel = () => {
    setMode("VIEW");
  };

  return (
    <div className="bg-white m-3 p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <div className="flex gap-2">
          {mode === "VIEW" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMode("EDIT")}
              className="h-8 border"
            >
              Modifier
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 border"
              >
                Annuler
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-8 border bg-purple-600 text-white hover:bg-purple-700 hover:text-white"
              >
                Sauvegarder
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="space-y-6">
        {React.Children.map(children, (child) => {
          if (React.isValidElement<FormChildProps>(child)) {
            return React.cloneElement(child, { mode });
          }
          return child;
        })}
      </div>
    </div>
  );
};

export { FormSection, FormSubSection };
