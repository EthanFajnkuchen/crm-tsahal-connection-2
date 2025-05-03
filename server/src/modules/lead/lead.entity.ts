import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ length: 50 })
  dateInscription: string;

  @Column({ length: 50 })
  statutCandidat: string;

  @Column({ length: 40 })
  mahzorGiyus: string;

  @Column({ length: 40 })
  typeGiyus: string;

  @Column({ length: 20 })
  pikoud: string;

  @Column({ length: 20 })
  dateFinService: string;

  @Column({ length: 25 })
  typePoste: string;

  @Column({ length: 100 })
  nomPoste: string;

  @Column({ length: 5 })
  expertConnection: string;

  @Column({ length: 50, nullable: true })
  produitEC1: string;

  @Column({ length: 50, nullable: true })
  produitEC2: string;

  @Column({ length: 50, nullable: true })
  produitEC3: string;

  @Column({ length: 50, nullable: true })
  produitEC4: string;

  @Column({ length: 50, nullable: true })
  produitEC5: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 20 })
  birthDate: string;

  @Column({ length: 10 })
  gender: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 20 })
  phoneNumber: string;

  @Column({ default: false })
  isWhatsAppSame: boolean;

  @Column({ length: 20, nullable: true })
  whatsappNumber: string;

  @Column({ length: 100 })
  city: string;

  @Column()
  isOnlyChild: boolean;

  @Column({ length: 100 })
  contactUrgenceLastName: string;

  @Column({ length: 100 })
  contactUrgenceFirstName: string;

  @Column({ length: 20 })
  contactUrgencePhoneNumber: string;

  @Column({ length: 100 })
  contactUrgenceMail: string;

  @Column({ length: 50 })
  contactUrgenceRelation: string;

  @Column({ length: 100 })
  StatutLoiRetour: string;

  @Column({ length: 20 })
  conversionDate: string;

  @Column({ length: 100 })
  conversionAgency: string;

  @Column({ length: 100 })
  statutResidentIsrael: string;

  @Column({ length: 4 })
  anneeAlyah: string;

  @Column({ length: 2 })
  numberOfNationalities: string;

  @Column({ length: 100 })
  nationality1: string;

  @Column({ length: 20 })
  passportNumber1: string;

  @Column({ length: 100, nullable: true })
  nationality2: string;

  @Column({ length: 20, nullable: true })
  passportNumber2: string;

  @Column({ length: 100, nullable: true })
  nationality3: string;

  @Column({ length: 20, nullable: true })
  passportNumber3: string;

  @Column({ length: 5 })
  hasIsraeliID: string;

  @Column({ length: 20 })
  israeliIDNumber: string;

  @Column({ length: 30 })
  bacObtention: string;

  @Column({ length: 100 })
  bacCountry: string;

  @Column({ length: 100 })
  bacType: string;

  @Column({ length: 100 })
  israeliBacSchool: string;

  @Column({ length: 100 })
  frenchBacSchoolIsrael: string;

  @Column({ length: 100 })
  otherSchoolName: string;

  @Column({ length: 5 })
  jewishSchool: string;

  @Column({ length: 100 })
  frenchBacSchoolFrance: string;

  @Column({ length: 30 })
  academicDiploma: string;

  @Column({ length: 100 })
  higherEducationCountry: string;

  @Column({ length: 100 })
  universityNameHebrew: string;

  @Column({ length: 100 })
  diplomaNameHebrew: string;

  @Column({ length: 100 })
  universityNameFrench: string;

  @Column({ length: 100 })
  diplomaNameFrench: string;

  @Column({ length: 20 })
  arrivalAge: string;

  @Column({ length: 100 })
  programParticipation: string;

  @Column({ length: 100 })
  programName: string;

  @Column({ length: 20 })
  schoolYears: string;

  @Column({ length: 100 })
  armyDeferralProgram: string;

  @Column({ length: 100 })
  programNameHebrewArmyDeferral: string;

  @Column({ length: 100 })
  currentStatus: string;

  @Column({ length: 100 })
  soldierAloneStatus: string;

  @Column({ length: 100 })
  serviceType: string;

  @Column({ length: 100 })
  mahalPath: string;

  @Column({ length: 100 })
  studyPath: string;

  @Column({ length: 100 })
  tsavRishonStatus: string;

  @Column({ length: 100 })
  recruitmentCenter: string;

  @Column({ length: 20 })
  tsavRishonDate: string;

  @Column({ length: 100 })
  tsavRishonGradesReceived: string;

  @Column({ length: 20 })
  daparNote: string;

  @Column({ length: 20 })
  medicalProfile: string;

  @Column({ length: 20 })
  hebrewScore: string;

  @Column({ length: 100 })
  yomHameaStatus: string;

  @Column({ length: 20 })
  yomHameaDate: string;

  @Column({ length: 100 })
  yomSayerotStatus: string;

  @Column({ length: 20 })
  yomSayerotDate: string;

  @Column({ length: 100 })
  armyEntryDateStatus: string;

  @Column({ length: 20 })
  giyusDate: string;

  @Column({ length: 100 })
  michveAlonTraining: string;

  @Column('text')
  summary: string;

  @Column({ length: 10, nullable: true })
  dateProduitEC1: string;

  @Column({ length: 10, nullable: true })
  dateProduitEC2: string;

  @Column({ length: 10, nullable: true })
  dateProduitEC3: string;

  @Column({ length: 10, nullable: true })
  dateProduitEC4: string;

  @Column({ length: 10, nullable: true })
  dateProduitEC5: string;
}
