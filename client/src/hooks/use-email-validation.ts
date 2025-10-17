import { useState, useCallback } from "react";
import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

interface EmailValidationResult {
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
  hasBeenValidated: boolean;
}

export const useEmailValidation = () => {
  const [validationState, setValidationState] = useState<EmailValidationResult>(
    {
      isValid: true,
      isLoading: false,
      error: null,
      hasBeenValidated: false,
    }
  );

  const validateEmail = useCallback(async (email: string): Promise<boolean> => {
    if (!email || !email.includes("@")) {
      setValidationState({
        isValid: true,
        isLoading: false,
        error: null,
        hasBeenValidated: false,
      });
      return true;
    }

    setValidationState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(API_ROUTES.FILTERED_LEADS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${M2M_TOKEN}`,
        },
        body: JSON.stringify({
          included: {
            email: [email],
          },
          fieldsToSend: ["id", "email"],
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la vérification de l'email");
      }

      const data = await response.json();
      const emailExists = Array.isArray(data) && data.length > 0;

      if (emailExists) {
        setValidationState({
          isValid: false,
          isLoading: false,
          error: "Un lead existe déjà avec cette adresse email",
          hasBeenValidated: true,
        });
        return false;
      } else {
        setValidationState({
          isValid: true,
          isLoading: false,
          error: null,
          hasBeenValidated: true,
        });
        return true;
      }
    } catch (error) {
      console.error("Erreur lors de la validation de l'email:", error);
      setValidationState({
        isValid: true,
        isLoading: false,
        error: null, // On ne bloque pas en cas d'erreur réseau
        hasBeenValidated: false,
      });
      return true;
    }
  }, []);

  const resetValidation = useCallback(() => {
    setValidationState({
      isValid: true,
      isLoading: false,
      error: null,
      hasBeenValidated: false,
    });
  }, []);

  return {
    validateEmail,
    resetValidation,
    ...validationState,
  };
};
