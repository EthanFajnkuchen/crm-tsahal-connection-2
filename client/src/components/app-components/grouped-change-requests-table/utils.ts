/**
 * Formate une valeur pour l'affichage dans le tableau
 */
export const formatDisplayValue = (value: string): string => {
  if (!value || value === "null" || value === "undefined") {
    return "(vide)";
  }

  // Vérifier si c'est une date au format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(value)) {
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime())) {
      return dateValue.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  }

  return value;
};

/**
 * Vérifie si une valeur est une image en base64
 */
export const isBase64Image = (value: string): boolean => {
  if (!value) return false;
  return (
    value.startsWith("data:image/") ||
    value.startsWith("/9j/") || // JPEG base64
    value.startsWith("iVBORw0KGgo") || // PNG base64
    value.startsWith("R0lGODlh") // GIF base64
  );
};

/**
 * Vérifie si le champ est une image (par nom de champ)
 */
export const isImageField = (fieldName: string): boolean => {
  const imageFields = ["profilePhoto", "photo", "image"];
  return imageFields.some((field) =>
    fieldName.toLowerCase().includes(field.toLowerCase())
  );
};

/**
 * Détermine si une valeur doit être affichée comme image
 */
export const shouldDisplayAsImage = (
  value: string,
  fieldName: string
): boolean => {
  return isImageField(fieldName) && isBase64Image(value);
};

