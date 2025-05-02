import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { LoaderCircle, X } from "lucide-react";

const SideDrawer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    onClose: () => void;
  }
>(({ isOpen, onClose, children, className, ...props }, ref) => {
  const [shouldRender, setShouldRender] = React.useState(isOpen);

  React.useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
        className
      )}
      {...props}
    >
      <SideDrawerOverlay
        isOpen={isOpen}
        onClose={onClose}
        onAnimationEnd={handleAnimationEnd}
      />
      {children}
    </div>
  );
});
SideDrawer.displayName = "SideDrawer";

const SideDrawerOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    onClose: () => void;
    onAnimationEnd: () => void;
  }
>(({ isOpen, onClose, onAnimationEnd, className, ...props }, ref) => (
  <div
    ref={ref}
    role="button"
    tabIndex={0}
    className={cn(
      "absolute inset-0 bg-black/80",
      isOpen ? "animate-fade-in" : "animate-fade-out",
      className
    )}
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        onClose();
      }
    }}
    onAnimationEnd={onAnimationEnd}
    {...props}
  />
));
SideDrawerOverlay.displayName = "SideDrawerOverlay";

const SideDrawerContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen?: boolean;
    onClose?: () => void;
  }
>(({ isOpen = false, className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute inset-y-0 left-0 bg-white px-6 py-8 shadow-lg",
      "flex w-fit min-w-[380px] flex-col",
      isOpen ? "animate-slide-in-from-left" : "animate-slide-out-to-left",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SideDrawerContent.displayName = "SideDrawerContent";

const SideDrawerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} {...props}>
    <div className={cn("mb-6 flex items-center justify-between", className)}>
      {children}
    </div>
  </div>
));
SideDrawerHeader.displayName = "SideDrawerHeader";

const SideDrawerFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-auto", className)} {...props} />
));
SideDrawerFooter.displayName = "SideDrawerFooter";

const SideDrawerAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    buttonContent: string;
    onSave: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    formId?: string;
    type?: "button" | "submit";
  }
>(
  (
    {
      buttonContent,
      onSave,
      disabled = false,
      isLoading = false,
      type = "button",
      formId,
      className,
      ...props
    },
    ref
  ) => (
    <div ref={ref} className={cn("mt-auto", className)} {...props}>
      <div className="flex justify-end">
        <Button
          type={type}
          disabled={disabled || isLoading}
          onClick={onSave}
          form={formId}
          className="bg-[#A855F7] hover:bg-[#6c35a0]"
        >
          {isLoading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            buttonContent
          )}
        </Button>
      </div>
    </div>
  )
);
SideDrawerAction.displayName = "SideDrawerAction";

const SideDrawerClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onClose?: () => void;
  }
>(({ className, onClick, onClose, ...props }, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onClose?.(); // <-- essentiel pour fermer le drawer
  };

  return (
    <button
      ref={ref}
      className={cn(
        "rounded-sm opacity-70 transition-opacity",
        "hover:opacity-100 focus:outline-none",
        "disabled:pointer-events-none",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  );
});
SideDrawerClose.displayName = "SideDrawerClose";

const SideDrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold leading-none", className)}
    {...props}
  >
    {children}
  </h2>
));
SideDrawerTitle.displayName = "SideDrawerTitle";

export {
  SideDrawer,
  SideDrawerOverlay,
  SideDrawerContent,
  SideDrawerHeader,
  SideDrawerFooter,
  SideDrawerAction,
  SideDrawerClose,
  SideDrawerTitle,
};
