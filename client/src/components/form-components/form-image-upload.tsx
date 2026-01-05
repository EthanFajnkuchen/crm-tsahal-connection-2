import { Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Upload, X, User } from "lucide-react";
import { useState, useRef } from "react";
import { ChangeRequestIndicator } from "@/components/app-components/change-request-indicator/change-request-indicator";
import { ChangeRequest } from "@/types/change-request";
import { cn } from "@/lib/utils";

export interface FormImageUploadProps {
  control: Control<any>;
  name: string;
  label: string;
  mode: "VIEW" | "EDIT";
  isLoading?: boolean;
  changeRequests?: ChangeRequest[];
  onApproveChangeRequest?: (changeRequestId: number) => void;
  onRejectChangeRequest?: (changeRequestId: number) => void;
  isAdmin?: boolean;
  hasChangeRequest?: boolean;
  proposedValue?: string;
  className?: string;
}

export const FormImageUpload = ({
  control,
  name,
  label,
  mode,
  isLoading = false,
  changeRequests = [],
  onApproveChangeRequest,
  onRejectChangeRequest,
  className,
}: FormImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Fonction pour compresser l'image et la recadrer en carré
  const compressImage = (
    file: File,
    maxWidth = 400,
    quality = 0.8
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        // Créer un carré pour éviter les coupures dans l'avatar rond
        const size = Math.min(img.width, img.height);
        const squareSize = Math.min(size, maxWidth);

        canvas.width = squareSize;
        canvas.height = squareSize;

        // Calculer les coordonnées pour centrer l'image
        const sourceX = (img.width - size) / 2;
        const sourceY = (img.height - size) / 2;

        // Dessiner l'image centrée et recadrée en carré
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          size,
          size, // Source (carré centré)
          0,
          0,
          squareSize,
          squareSize // Destination (canvas carré)
        );

        // Convertir en base64 avec compression
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string | null) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier que c'est une image
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image valide");
        return;
      }

      // Vérifier la taille (max 2MB pour éviter les problèmes de payload)
      if (file.size > 2 * 1024 * 1024) {
        alert("L'image ne peut pas dépasser 2MB");
        return;
      }

      // Compresser et redimensionner l'image
      compressImage(file).then((compressedDataUrl) => {
        setPreview(compressedDataUrl);
        onChange(compressedDataUrl);
      });
    }
  };

  const handleRemoveImage = (onChange: (value: string | null) => void) => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label
          htmlFor={name}
          className="text-muted-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-[Poppins] flex items-center gap-2"
        >
          {label}
        </Label>
        {changeRequests.length > 0 && (
          <ChangeRequestIndicator
            changeRequests={changeRequests}
            fieldName={name}
            label={label}
            onApprove={onApproveChangeRequest || (() => {})}
            onReject={onRejectChangeRequest || (() => {})}
          />
        )}
      </div>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const currentValue = preview || value;

          return (
            <div className="space-y-4">
              {/* Avatar Display */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-muted">
                    <AvatarImage
                      src={currentValue}
                      alt="Photo de profil"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-muted">
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  {/* Indicateur de prévisualisation */}
                  {preview && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {mode === "EDIT" && !isLoading && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {currentValue
                          ? "Changer la photo"
                          : "Ajouter une photo"}
                      </Button>

                      {currentValue && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveImage(onChange)}
                          disabled={isLoading}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                          Supprimer
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Hidden File Input */}
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, onChange)}
                className="hidden"
              />

              {/* Info Text */}
              {mode === "EDIT" && !isLoading && (
                <p className="text-sm text-muted-foreground">
                  Formats acceptés : JPG, PNG, GIF. Taille max : 2MB.
                </p>
              )}

              {/* Error Display */}
              {error && (
                <p className="text-sm text-destructive">{error.message}</p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};
