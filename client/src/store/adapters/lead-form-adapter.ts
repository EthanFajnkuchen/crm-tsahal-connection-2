import { LeadFormData } from "@/pages/lead-form/LeadForm";
import { API_ROUTES } from "@/constants/api-routes";

const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

export interface LeadFormSubmissionResponse {
  success: boolean;
  message: string;
  leadId?: string;
}

export const submitLeadForm = async (
  formData: LeadFormData
): Promise<LeadFormSubmissionResponse> => {
  try {
    const response = await fetch(`${API_ROUTES.LEAD_DETAILS}/form-submission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M2M_TOKEN}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur HTTP: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "Candidature soumise avec succès",
      leadId: data.leadId?.toString() || undefined,
    };
  } catch (error) {
    console.error("Erreur lors de la soumission du formulaire:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Une erreur inattendue s'est produite"
    );
  }
};

export const validateFormData = async (
  formData: LeadFormData
): Promise<boolean> => {
  // Validation côté client
  const requiredFields = [
    "firstName",
    "lastName",
    "birthDate",
    "gender",
    "email",
    "confirmEmail",
    "phoneNumber",
    "confirmPhoneNumber",
    "city",
    "isOnlyChild",
    "contactUrgenceFirstName",
    "contactUrgenceLastName",
    "contactUrgencePhoneNumber",
    "confirmContactUrgencePhoneNumber",
    "contactUrgenceEmail",
    "confirmContactUrgenceEmail",
    "contactUrgenceRelation",
    "StatutLoiRetour",
    "statutResidentIsrael",
    "numberOfNationalities",
    "nationality1",
    "bacObtention",
    "academicDiploma",
    "arrivalAge",
    "armyDeferralProgram",
    "currentStatus",
    "soldierAloneStatus",
    "serviceType",
    "tsavRishonStatus",
    "yomHameaStatus",
    "yomSayerotStatus",
    "armyEntryDateStatus",
    "summary",
    "acceptTerms",
  ];

  for (const field of requiredFields) {
    if (!formData[field as keyof LeadFormData]) {
      return false;
    }
  }

  // Validation email confirmation
  if (formData.email !== formData.confirmEmail) {
    return false;
  }

  // Validation phone confirmation
  if (formData.phoneNumber !== formData.confirmPhoneNumber) {
    return false;
  }

  // Validation emergency contact email confirmation
  if (formData.contactUrgenceEmail !== formData.confirmContactUrgenceEmail) {
    return false;
  }

  // Validation emergency contact phone confirmation
  if (
    formData.contactUrgencePhoneNumber !==
    formData.confirmContactUrgencePhoneNumber
  ) {
    return false;
  }

  // Validation acceptTerms
  if (!formData.acceptTerms) {
    return false;
  }

  return true;
};
