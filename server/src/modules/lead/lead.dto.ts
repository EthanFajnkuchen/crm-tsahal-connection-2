import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
} from 'class-validator';

export class LeadFilterDto {
  @IsObject()
  included?: Record<string, string[]>;

  @IsObject()
  @IsOptional()
  excluded?: Record<string, string[]>;

  @IsArray()
  fieldsToSend?: string[];
}

export class UpdateLeadDto {
  @IsOptional()
  @IsDateString()
  dateInscription?: string;

  @IsOptional()
  @IsString()
  statutCandidat?: string;

  @IsOptional()
  @IsString()
  mahzorGiyus?: string;

  @IsOptional()
  @IsString()
  typeGiyus?: string;

  @IsOptional()
  @IsString()
  pikoud?: string;

  @IsOptional()
  @IsDateString()
  dateFinService?: string;

  @IsOptional()
  @IsString()
  typePoste?: string;

  @IsOptional()
  @IsString()
  nomPoste?: string;

  @IsOptional()
  @IsString()
  expertConnection?: string;

  @IsOptional()
  @IsString()
  produitEC1?: string;

  @IsOptional()
  @IsString()
  produitEC2?: string;

  @IsOptional()
  @IsString()
  produitEC3?: string;

  @IsOptional()
  @IsString()
  produitEC4?: string;

  @IsOptional()
  @IsString()
  produitEC5?: string;

  @IsOptional()
  @IsDateString()
  dateProduitEC1?: string;

  @IsOptional()
  @IsDateString()
  dateProduitEC2?: string;

  @IsOptional()
  @IsDateString()
  dateProduitEC3?: string;

  @IsOptional()
  @IsDateString()
  dateProduitEC4?: string;

  @IsOptional()
  @IsDateString()
  dateProduitEC5?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  isWhatsAppSame?: string;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  isOnlyChild?: string;

  @IsOptional()
  @IsString()
  contactUrgenceLastName?: string;

  @IsOptional()
  @IsString()
  contactUrgenceFirstName?: string;

  @IsOptional()
  @IsString()
  contactUrgencePhoneNumber?: string;

  @IsOptional()
  @IsEmail()
  contactUrgenceMail?: string;

  @IsOptional()
  @IsString()
  contactUrgenceRelation?: string;

  @IsOptional()
  @IsString()
  StatutLoiRetour?: string;

  @IsOptional()
  @IsDateString()
  conversionDate?: string;

  @IsOptional()
  @IsString()
  conversionAgency?: string;

  @IsOptional()
  @IsString()
  statutResidentIsrael?: string;

  @IsOptional()
  @IsString()
  anneeAlyah?: string;

  @IsOptional()
  @IsString()
  numberOfNationalities?: string;

  @IsOptional()
  @IsString()
  nationality1?: string;

  @IsOptional()
  @IsString()
  passportNumber1?: string;

  @IsOptional()
  @IsString()
  nationality2?: string;

  @IsOptional()
  @IsString()
  passportNumber2?: string;

  @IsOptional()
  @IsString()
  nationality3?: string;

  @IsOptional()
  @IsString()
  passportNumber3?: string;

  @IsOptional()
  @IsString()
  hasIsraeliID?: string;

  @IsOptional()
  @IsString()
  israeliIDNumber?: string;

  @IsOptional()
  @IsString()
  bacObtention?: string;

  @IsOptional()
  @IsString()
  bacCountry?: string;

  @IsOptional()
  @IsString()
  bacType?: string;

  @IsOptional()
  @IsString()
  israeliBacSchool?: string;

  @IsOptional()
  @IsString()
  frenchBacSchoolIsrael?: string;

  @IsOptional()
  @IsString()
  otherSchoolName?: string;

  @IsOptional()
  @IsString()
  jewishSchool?: string;

  @IsOptional()
  @IsString()
  frenchBacSchoolFrance?: string;

  @IsOptional()
  @IsString()
  academicDiploma?: string;

  @IsOptional()
  @IsString()
  higherEducationCountry?: string;

  @IsOptional()
  @IsString()
  universityNameHebrew?: string;

  @IsOptional()
  @IsString()
  diplomaNameHebrew?: string;

  @IsOptional()
  @IsString()
  universityNameFrench?: string;

  @IsOptional()
  @IsString()
  diplomaNameFrench?: string;

  @IsOptional()
  @IsString()
  arrivalAge?: string;

  @IsOptional()
  @IsString()
  programParticipation?: string;

  @IsOptional()
  @IsString()
  programName?: string;

  @IsOptional()
  @IsString()
  schoolYears?: string;

  @IsOptional()
  @IsString()
  armyDeferralProgram?: string;

  @IsOptional()
  @IsString()
  programNameHebrewArmyDeferral?: string;

  @IsOptional()
  @IsString()
  currentStatus?: string;

  @IsOptional()
  @IsString()
  soldierAloneStatus?: string;

  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsString()
  mahalPath?: string;

  @IsOptional()
  @IsString()
  studyPath?: string;

  @IsOptional()
  @IsString()
  tsavRishonStatus?: string;

  @IsOptional()
  @IsString()
  recruitmentCenter?: string;

  @IsOptional()
  @IsDateString()
  tsavRishonDate?: string;

  @IsOptional()
  @IsString()
  tsavRishonGradesReceived?: string;

  @IsOptional()
  @IsString()
  daparNote?: string;

  @IsOptional()
  @IsString()
  medicalProfile?: string;

  @IsOptional()
  @IsString()
  hebrewScore?: string;

  @IsOptional()
  @IsString()
  yomHameaStatus?: string;

  @IsOptional()
  @IsDateString()
  yomHameaDate?: string;

  @IsOptional()
  @IsString()
  yomSayerotStatus?: string;

  @IsOptional()
  @IsDateString()
  yomSayerotDate?: string;

  @IsOptional()
  @IsString()
  armyEntryDateStatus?: string;

  @IsOptional()
  @IsDateString()
  giyusDate?: string;

  @IsOptional()
  @IsString()
  michveAlonTraining?: string;

  @IsOptional()
  @IsString()
  summary?: string;
}
