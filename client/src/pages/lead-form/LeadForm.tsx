import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { submitLeadForm } from "@/store/thunks/lead-form-thunk";
import { resetFormState } from "@/store/slices/lead-form-slice";
import { RootState } from "@/store/store";
import { GeneralStep } from "./components/general-step";
import { JudaismNationalityStep } from "./components/judaism-nationality-step";
import { EducationStep } from "./components/education-step";
import { IntegrationIsraelStep } from "./components/integration-israel-step";
import { TsahalStep } from "./components/tsahal-step";

export interface LeadFormData {
  // General section
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  email: string;
  confirmEmail: string;
  phoneNumber: string;
  confirmPhoneNumber: string;
  whatsappSameAsPhone: boolean;
  whatsappNumber: string;
  confirmWhatsappNumber: string;
  city: string;
  isOnlyChild: string;

  // Emergency contact
  contactUrgenceFirstName: string;
  contactUrgenceLastName: string;
  contactUrgencePhoneNumber: string;
  confirmContactUrgencePhoneNumber: string;
  contactUrgenceEmail: string;
  confirmContactUrgenceEmail: string;
  contactUrgenceRelation: string;

  // Judaism & Nationality section
  StatutLoiRetour: string;
  conversionDate: string;
  conversionAgency: string;
  statutResidentIsrael: string;
  anneeAlyah: string;
  hasIsraeliID: string;
  israeliIDNumber: string;
  numberOfNationalities: string;
  nationality1: string;
  passportNumber1: string;
  nationality2: string;
  passportNumber2: string;
  nationality3: string;
  passportNumber3: string;

  // Education section
  bacObtention: string;
  bacCountry: string;
  bacType: string;
  israeliBacSchool: string;
  frenchBacSchoolIsrael: string;
  otherSchoolName: string;
  jewishSchool: string;
  frenchBacSchoolFrance: string;
  academicDiploma: string;
  higherEducationCountry: string;
  universityNameHebrew: string;
  diplomaNameHebrew: string;
  universityNameFrench: string;
  diplomaNameFrench: string;

  // Integration Israel section
  arrivalAge: string;
  programParticipation: string;
  programName: string;
  schoolYears: string;
  armyDeferralProgram: string;
  programNameHebrewArmyDeferral: string;

  // Tsahal section
  currentStatus: string;
  soldierAloneStatus: string;
  serviceType: string;
  mahalPath: string;
  studyPath: string;
  tsavRishonStatus: string;
  recruitmentCenter: string;
  tsavRishonDate: string;
  tsavRishonGradesReceived: string;
  daparNote: string;
  medicalProfile: string;
  hebrewScore: string;
  yomHameaStatus: string;
  yomHameaDate: string;
  yomSayerotStatus: string;
  yomSayerotDate: string;
  armyEntryDateStatus: string;
  giyusDate: string;
  michveAlonTraining: string;
  summary: string;
  acceptTerms: boolean;
}

const steps = [
  { id: "general", title: "Général", description: "Informations personnelles" },
  {
    id: "judaism-nationality",
    title: "Judaïsme & Nationalité",
    description: "Informations religieuses et nationalité",
  },
  { id: "education", title: "Éducation", description: "Formation et études" },
  {
    id: "integration-israel",
    title: "Intégration Israël",
    description: "Séjour et intégration",
  },
  { id: "tsahal", title: "Tsahal", description: "Service militaire" },
];

export const LeadForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSubmitting, submitError, submitSuccess } = useSelector(
    (state: RootState) => state.leadForm
  );

  const form = useForm<LeadFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      email: "",
      confirmEmail: "",
      phoneNumber: "",
      confirmPhoneNumber: "",
      whatsappSameAsPhone: false,
      whatsappNumber: "",
      confirmWhatsappNumber: "",
      city: "",
      isOnlyChild: "",
      contactUrgenceFirstName: "",
      contactUrgenceLastName: "",
      contactUrgencePhoneNumber: "",
      confirmContactUrgencePhoneNumber: "",
      contactUrgenceEmail: "",
      confirmContactUrgenceEmail: "",
      contactUrgenceRelation: "",
      // Judaism & Nationality
      StatutLoiRetour: "",
      conversionDate: "",
      conversionAgency: "",
      statutResidentIsrael: "",
      anneeAlyah: "",
      hasIsraeliID: "",
      israeliIDNumber: "",
      numberOfNationalities: "",
      nationality1: "",
      passportNumber1: "",
      nationality2: "",
      passportNumber2: "",
      nationality3: "",
      passportNumber3: "",
      // Education
      bacObtention: "",
      bacCountry: "",
      bacType: "",
      israeliBacSchool: "",
      frenchBacSchoolIsrael: "",
      otherSchoolName: "",
      jewishSchool: "",
      frenchBacSchoolFrance: "",
      academicDiploma: "",
      higherEducationCountry: "",
      universityNameHebrew: "",
      diplomaNameHebrew: "",
      universityNameFrench: "",
      diplomaNameFrench: "",
      // Integration Israel
      arrivalAge: "",
      programParticipation: "",
      programName: "",
      schoolYears: "",
      armyDeferralProgram: "",
      programNameHebrewArmyDeferral: "",
      // Tsahal
      currentStatus: "",
      soldierAloneStatus: "",
      serviceType: "",
      mahalPath: "",
      studyPath: "",
      tsavRishonStatus: "",
      recruitmentCenter: "",
      tsavRishonDate: "",
      tsavRishonGradesReceived: "",
      daparNote: "",
      medicalProfile: "",
      hebrewScore: "",
      yomHameaStatus: "",
      yomHameaDate: "",
      yomSayerotStatus: "",
      yomSayerotDate: "",
      armyEntryDateStatus: "",
      giyusDate: "",
      michveAlonTraining: "",
      summary: "",
      acceptTerms: false,
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    watch,
    formState: { isValid },
  } = form;

  // Check if current step is valid
  const validateCurrentStep = async () => {
    const fieldsToValidate = stepFields[currentStep];
    return await trigger(fieldsToValidate);
  };

  useEffect(() => {
    console.log("isCurrentStepValid", isCurrentStepValid);
  }, [isCurrentStepValid]);

  // Watch only current step fields and revalidate
  const stepFields: Record<number, (keyof LeadFormData)[]> = {
    0: [
      "firstName",
      "lastName",
      "birthDate",
      "gender",
      "email",
      "confirmEmail",
      "phoneNumber",
      "confirmPhoneNumber",
      "whatsappSameAsPhone",
      "whatsappNumber",
      "confirmWhatsappNumber",
      "city",
      "isOnlyChild",
      "contactUrgenceFirstName",
      "contactUrgenceLastName",
      "contactUrgencePhoneNumber",
      "confirmContactUrgencePhoneNumber",
      "contactUrgenceEmail",
      "confirmContactUrgenceEmail",
      "contactUrgenceRelation",
    ],
    1: [
      "StatutLoiRetour",
      "conversionDate",
      "conversionAgency",
      "statutResidentIsrael",
      "anneeAlyah",
      "hasIsraeliID",
      "israeliIDNumber",
      "numberOfNationalities",
      "nationality1",
      "nationality2",
      "nationality3",
    ],
    2: [
      "bacObtention",
      "bacCountry",
      "bacType",
      "israeliBacSchool",
      "frenchBacSchoolIsrael",
      "otherSchoolName",
      "jewishSchool",
      "frenchBacSchoolFrance",
      "academicDiploma",
      "higherEducationCountry",
      "universityNameHebrew",
      "diplomaNameHebrew",
      "universityNameFrench",
      "diplomaNameFrench",
    ],
    3: [
      "arrivalAge",
      "programParticipation",
      "programName",
      "schoolYears",
      "armyDeferralProgram",
      "programNameHebrewArmyDeferral",
    ],
    4: [
      "currentStatus",
      "soldierAloneStatus",
      "serviceType",
      "mahalPath",
      "studyPath",
      "tsavRishonStatus",
      "recruitmentCenter",
      "tsavRishonDate",
      "tsavRishonGradesReceived",
      "daparNote",
      "medicalProfile",
      "hebrewScore",
      "yomHameaStatus",
      "yomHameaDate",
      "yomSayerotStatus",
      "yomSayerotDate",
      "armyEntryDateStatus",
      "giyusDate",
      "michveAlonTraining",
      "summary",
      "acceptTerms",
    ],
  };

  const currentStepFields = stepFields[currentStep] || [];
  const watchedValues = watch(currentStepFields);

  useEffect(() => {
    const revalidateStep = async () => {
      const isValid = await validateCurrentStep();
      console.log("Revalidating step due to form change:", isValid);
      setIsCurrentStepValid(isValid);
    };
    revalidateStep();
  }, [watchedValues, currentStep]);

  // Redirection basée sur le statut de soumission
  useEffect(() => {
    if (submitSuccess) {
      navigate("/candidature/success");
    } else if (submitError) {
      navigate("/candidature/failure");
    }
  }, [submitSuccess, submitError, navigate]);

  // Scroll to top when step changes
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [currentStep]);

  // Check current step validity when step changes
  useEffect(() => {
    const checkStepValidity = async () => {
      console.log("Checking step validity for step:", currentStep);
      const isValid = await validateCurrentStep();
      console.log("Step validity result:", isValid);
      setIsCurrentStepValid(isValid);
    };
    checkStepValidity();
  }, [currentStep]);

  // Reset du state au montage du composant
  useEffect(() => {
    dispatch(resetFormState());
  }, [dispatch]);

  const nextStep = async () => {
    const isStepValid = await validateCurrentStep();

    if (isStepValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: LeadFormData) => {
    try {
      await dispatch(submitLeadForm(data) as any).unwrap();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <GeneralStep form={form} />;
      case 1:
        return <JudaismNationalityStep form={form} />;
      case 2:
        return <EducationStep form={form} />;
      case 3:
        return <IntegrationIsraelStep form={form} />;
      case 4: // Tsahal
        return <TsahalStep form={form} />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Formulaire de contact
          </h1>
          <p className="text-gray-600">
            Remplissez ce formulaire pour nous contacter
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Étape {currentStep + 1} sur {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% complété
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  index <= currentStep ? "text-purple-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStep
                      ? "bg-purple-600 text-white"
                      : index === currentStep
                      ? "bg-purple-100 text-purple-600 border-2 border-purple-600"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-xs font-medium">{step.title}</div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {steps[currentStep].title}
            </CardTitle>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {renderStep()}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  Précédent
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isCurrentStepValid}
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="ml-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Soumission en cours...
                      </>
                    ) : (
                      "Soumettre"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
