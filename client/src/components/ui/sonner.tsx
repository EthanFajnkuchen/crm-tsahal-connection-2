import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { Check, X } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-center"
      icons={{
        success: (
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        ),
        error: (
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <X className="w-3 h-3 text-white" />
          </div>
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#55075f] group-[.toaster]:text-white group-[.toaster]:border-gray-800 group-[.toaster]:shadow-lg justify-center",
          description: "group-[.toast]:text-gray-300 text-center font-[16px]",
          actionButton: "group-[.toast]:bg-white group-[.toast]:text-black",
          cancelButton: "group-[.toast]:bg-gray-700 group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
