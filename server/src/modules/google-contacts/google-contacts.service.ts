import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import axios from 'axios';
import {
  CreateGoogleContactDto,
  GoogleContactResponseDto,
  GoogleContactWithLeadDto,
  GoogleContactsWithLeadResponseDto,
} from './google-contacts.dto';

@Injectable()
export class GoogleContactsService {
  private readonly logger = new Logger(GoogleContactsService.name);
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private clientId: string | null = null;
  private clientSecret: string | null = null;

  constructor() {
    this.initializeGoogleAPI();
  }

  private async initializeGoogleAPI() {
    try {
      // Configuration OAuth2 avec refresh token
      this.clientId = process.env.GOOGLE_CLIENT_ID;
      this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      this.refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

      if (!this.clientId || !this.clientSecret || !this.refreshToken) {
        this.logger.warn(
          'Google Contacts API credentials not configured - contacts will not be created automatically',
        );
        this.logger.warn(
          'Required environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN',
        );
        return;
      }

      // Obtenir un access token via le refresh token
      await this.refreshAccessToken();
      this.logger.log('Google Contacts API initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Google Contacts API:', error);
      this.logger.warn(
        'Google Contacts API not available - contacts will not be created automatically',
      );
    }
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token',
      });

      this.accessToken = response.data.access_token;
      this.logger.log('Access token refreshed successfully');
    } catch (error) {
      this.logger.error('Failed to refresh access token:', error);
      throw new InternalServerErrorException(
        'Failed to authenticate with Google',
      );
    }
  }

  async createContact(
    createContactDto: CreateGoogleContactDto,
  ): Promise<GoogleContactResponseDto> {
    try {
      // Vérifier si l'API Google est disponible
      if (!this.accessToken) {
        this.logger.warn(
          'Google Contacts API not available - skipping contact creation',
        );
        return {
          success: false,
          message: 'Google Contacts API not configured - contact not created',
        };
      }

      const {
        firstName,
        lastName,
        phoneNumber,
        whatsappNumber,
        leadId,
        email,
      } = createContactDto;

      // Construction du contact Google
      const contact: any = {
        names: [
          {
            givenName: firstName,
            familyName: lastName,
          },
        ],
        phoneNumbers: [
          {
            value: phoneNumber,
            type: 'mobile',
          },
        ],
        userDefined: [
          {
            key: 'Lead ID',
            value: leadId.toString(),
          },
        ],
      };

      // Ajouter le numéro WhatsApp s'il est différent du numéro de téléphone
      if (whatsappNumber && whatsappNumber !== phoneNumber) {
        contact.phoneNumbers.push({
          value: whatsappNumber,
          type: 'other',
        });
      }

      // Ajouter l'email s'il est fourni
      if (email) {
        contact.emailAddresses = [
          {
            value: email,
            type: 'other',
          },
        ];
      }

      // Créer le contact via l'API REST Google Contacts
      const response = await axios.post(
        'https://people.googleapis.com/v1/people:createContact',
        contact,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`Contact created successfully for lead ID: ${leadId}`);

      return {
        success: true,
        message: 'Contact créé avec succès dans Google Contacts',
        contactId: response.data.resourceName,
        resourceName: response.data.resourceName,
      };
    } catch (error) {
      this.logger.error('Failed to create Google contact:', error);

      // Si l'access token a expiré, essayer de le rafraîchir
      if (error.response?.status === 401) {
        try {
          await this.refreshAccessToken();
          // Retry avec le nouveau token
          return this.createContact(createContactDto);
        } catch (refreshError) {
          this.logger.error('Failed to refresh token:', refreshError);
        }
      }

      if (error.response?.data?.error) {
        throw new InternalServerErrorException(
          `Erreur Google Contacts API: ${error.response.data.error.message}`,
        );
      }

      throw new InternalServerErrorException(
        'Erreur lors de la création du contact dans Google Contacts',
      );
    }
  }

  async getContact(contactId: string): Promise<any> {
    try {
      if (!this.accessToken) {
        throw new InternalServerErrorException(
          'Google Contacts API not configured',
        );
      }

      const response = await axios.get(
        `https://people.googleapis.com/v1/${contactId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          params: {
            personFields: 'names,phoneNumbers,emailAddresses,userDefined',
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to get Google contact:', error.message);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération du contact',
      );
    }
  }

  async updateContact(
    contactId: string,
    updateData: Partial<CreateGoogleContactDto>,
  ): Promise<GoogleContactResponseDto> {
    try {
      if (!this.accessToken) {
        throw new InternalServerErrorException(
          'Google Contacts API not configured',
        );
      }

      // D'abord récupérer le contact existant pour obtenir l'etag
      const existingContact = await this.getContact(contactId);
      if (!existingContact || !existingContact.etag) {
        throw new InternalServerErrorException(
          'Contact not found or missing etag',
        );
      }

      const contact: any = {
        etag: existingContact.etag,
        names:
          updateData.firstName || updateData.lastName
            ? [
                {
                  givenName: updateData.firstName,
                  familyName: updateData.lastName,
                },
              ]
            : existingContact.names,
        phoneNumbers: [],
        userDefined: existingContact.userDefined || [],
      };

      // Conserver les numéros existants et les mettre à jour
      if (existingContact.phoneNumbers) {
        contact.phoneNumbers = [...existingContact.phoneNumbers];
      }

      // Mettre à jour le numéro mobile
      if (updateData.phoneNumber) {
        const mobileIndex = contact.phoneNumbers.findIndex(
          (phone: any) => phone.type === 'mobile',
        );
        if (mobileIndex >= 0) {
          contact.phoneNumbers[mobileIndex].value = updateData.phoneNumber;
        } else {
          contact.phoneNumbers.push({
            value: updateData.phoneNumber,
            type: 'mobile',
          });
        }
      }

      // Mettre à jour le numéro WhatsApp
      if (updateData.whatsappNumber) {
        const whatsappIndex = contact.phoneNumbers.findIndex(
          (phone: any) => phone.type === 'other',
        );
        if (whatsappIndex >= 0) {
          contact.phoneNumbers[whatsappIndex].value = updateData.whatsappNumber;
        } else {
          contact.phoneNumbers.push({
            value: updateData.whatsappNumber,
            type: 'other',
          });
        }
      }

      // Mettre à jour le Lead ID dans userDefined
      if (updateData.leadId) {
        const leadIdIndex = contact.userDefined.findIndex(
          (field: any) => field.key === 'Lead ID',
        );
        if (leadIdIndex >= 0) {
          contact.userDefined[leadIdIndex].value = updateData.leadId.toString();
        } else {
          contact.userDefined.push({
            key: 'Lead ID',
            value: updateData.leadId.toString(),
          });
        }
      }

      // Ajouter l'email s'il est fourni
      if (updateData.email) {
        contact.emailAddresses = [
          {
            value: updateData.email,
            type: 'other',
          },
        ];
      }

      const response = await axios.patch(
        `https://people.googleapis.com/v1/${contactId}:updateContact`,
        contact,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          params: {
            updatePersonFields: 'names,phoneNumbers,emailAddresses,userDefined',
          },
        },
      );

      this.logger.log(`Contact updated successfully: ${contactId}`);

      return {
        success: true,
        message: 'Contact mis à jour avec succès',
        contactId: contactId,
        resourceName: contactId,
      };
    } catch (error) {
      this.logger.error('Failed to update Google contact:', error);
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour du contact',
      );
    }
  }

  async deleteContact(contactId: string): Promise<GoogleContactResponseDto> {
    try {
      if (!this.accessToken) {
        throw new InternalServerErrorException(
          'Google Contacts API not configured',
        );
      }

      await axios.delete(
        `https://people.googleapis.com/v1/${contactId}:deleteContact`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      );

      this.logger.log(`Contact deleted successfully: ${contactId}`);

      return {
        success: true,
        message: 'Contact supprimé avec succès',
        contactId: contactId,
      };
    } catch (error) {
      this.logger.error('Failed to delete Google contact:', error);
      throw new InternalServerErrorException(
        'Erreur lors de la suppression du contact',
      );
    }
  }

  async searchContacts(query: string): Promise<any[]> {
    try {
      if (!this.accessToken) {
        this.logger.warn('Google Contacts API not available - skipping search');
        return [];
      }

      // Étape 1: Warmup cache (requête vide)
      await axios.get(
        'https://people.googleapis.com/v1/people:searchContacts',
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          params: {
            query: '', // Requête vide pour le warmup
            readMask: 'names,phoneNumbers,emailAddresses,userDefined',
          },
        },
      );

      // Étape 2: Attendre quelques secondes (comme recommandé par Google)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Étape 3: Faire la vraie recherche
      const response = await axios.get(
        'https://people.googleapis.com/v1/people:searchContacts',
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          params: {
            query: query,
            readMask: 'names,phoneNumbers,emailAddresses,userDefined',
          },
        },
      );

      return response.data.results || [];
    } catch (error) {
      this.logger.error('Failed to search Google contacts:', error);

      // Si l'access token a expiré, essayer de le rafraîchir
      if (error.response?.status === 401) {
        try {
          await this.refreshAccessToken();
          // Retry avec le nouveau token
          return this.searchContacts(query);
        } catch (refreshError) {
          this.logger.error('Failed to refresh token:', refreshError);
        }
      }

      // Pour les autres erreurs, retourner un tableau vide plutôt que de faire échouer
      this.logger.warn('Search failed, returning empty results');
      return [];
    }
  }

  async getContactsWithLeadId(): Promise<GoogleContactsWithLeadResponseDto> {
    try {
      if (!this.accessToken) {
        this.logger.warn(
          'Google Contacts API not available - skipping contacts retrieval',
        );
        return {
          success: false,
          message: 'Google Contacts API not configured',
          contacts: [],
          totalCount: 0,
        };
      }

      let allContacts: any[] = [];
      let nextPageToken: string | undefined = undefined;
      let pageCount = 0;

      // Récupérer tous les contacts avec pagination
      do {
        const params: any = {
          personFields: 'names,phoneNumbers,emailAddresses,userDefined',
          pageSize: 1000, // Maximum autorisé par Google
        };

        if (nextPageToken) {
          params.pageToken = nextPageToken;
        }

        const response = await axios.get(
          'https://people.googleapis.com/v1/people/me/connections',
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
            params,
          },
        );

        const contacts = response.data.connections || [];
        allContacts = allContacts.concat(contacts);
        nextPageToken = response.data.nextPageToken;
        pageCount++;
      } while (nextPageToken);

      // Filtrer les contacts qui ont la clé "Lead ID" dans userDefined
      const contactsWithLeadId: GoogleContactWithLeadDto[] = allContacts
        .filter((contact: any) => {
          const hasLeadId = contact.userDefined?.some(
            (field: any) => field.key === 'Lead ID',
          );
          return hasLeadId;
        })
        .map((contact: any) => {
          // Extraire le leadId des userDefined
          const leadIdField = contact.userDefined?.find(
            (field: any) => field.key === 'Lead ID',
          );
          const leadId = leadIdField
            ? parseInt(leadIdField.value, 10)
            : undefined;

          // Extraire le numéro mobile et other
          const mobilePhone = contact.phoneNumbers?.find(
            (phone: any) => phone.type === 'mobile',
          )?.value;
          const otherPhone = contact.phoneNumbers?.find(
            (phone: any) => phone.type === 'other',
          )?.value;

          return {
            leadId: leadId,
            mobilePhone: this.cleanPhoneNumber(mobilePhone),
            otherPhone: this.cleanPhoneNumber(otherPhone),
          };
        });

      return {
        success: true,
        message: `${contactsWithLeadId.length} contacts avec Lead ID trouvés`,
        contacts: contactsWithLeadId,
        totalCount: contactsWithLeadId.length,
      };
    } catch (error) {
      this.logger.error('Failed to get contacts with Lead ID:', error);

      // Si l'access token a expiré, essayer de le rafraîchir
      if (error.response?.status === 401) {
        try {
          await this.refreshAccessToken();
          // Retry avec le nouveau token
          return this.getContactsWithLeadId();
        } catch (refreshError) {
          this.logger.error('Failed to refresh token:', refreshError);
        }
      }

      if (error.response?.data?.error) {
        throw new InternalServerErrorException(
          `Erreur Google Contacts API: ${error.response.data.error.message}`,
        );
      }

      throw new InternalServerErrorException(
        'Erreur lors de la récupération des contacts avec Lead ID',
      );
    }
  }

  async getContactByLeadId(
    leadId: number,
  ): Promise<GoogleContactWithLeadDto | null> {
    try {
      if (!this.accessToken) {
        this.logger.warn(
          'Google Contacts API not available - skipping contact search',
        );
        return null;
      }

      let allContacts: any[] = [];
      let nextPageToken: string | undefined = undefined;

      // Récupérer tous les contacts avec pagination
      do {
        const params: any = {
          personFields: 'names,phoneNumbers,emailAddresses,userDefined',
          pageSize: 1000, // Maximum autorisé par Google
        };

        if (nextPageToken) {
          params.pageToken = nextPageToken;
        }

        const response = await axios.get(
          'https://people.googleapis.com/v1/people/me/connections',
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
            params,
          },
        );

        const contacts = response.data.connections || [];
        allContacts = allContacts.concat(contacts);
        nextPageToken = response.data.nextPageToken;
      } while (nextPageToken);

      // Chercher le contact avec le Lead ID spécifique
      const contactWithLeadId = allContacts.find((contact: any) => {
        return contact.userDefined?.some(
          (field: any) =>
            field.key === 'Lead ID' && parseInt(field.value, 10) === leadId,
        );
      });

      if (!contactWithLeadId) {
        this.logger.log(`No Google contact found with Lead ID: ${leadId}`);
        return null;
      }

      // Extraire le leadId des userDefined
      const leadIdField = contactWithLeadId.userDefined?.find(
        (field: any) => field.key === 'Lead ID',
      );
      const extractedLeadId = leadIdField
        ? parseInt(leadIdField.value, 10)
        : undefined;

      // Extraire le numéro mobile et other
      const mobilePhone = contactWithLeadId.phoneNumbers?.find(
        (phone: any) => phone.type === 'mobile',
      )?.value;
      const otherPhone = contactWithLeadId.phoneNumbers?.find(
        (phone: any) => phone.type === 'other',
      )?.value;

      this.logger.log(`Found Google contact for Lead ID: ${leadId}`);

      return {
        leadId: extractedLeadId,
        mobilePhone: this.cleanPhoneNumber(mobilePhone),
        otherPhone: this.cleanPhoneNumber(otherPhone),
        resourceName: contactWithLeadId.resourceName,
      };
    } catch (error) {
      this.logger.error('Failed to get contact by Lead ID:', error);

      // Si l'access token a expiré, essayer de le rafraîchir
      if (error.response?.status === 401) {
        try {
          await this.refreshAccessToken();
          // Retry avec le nouveau token
          return this.getContactByLeadId(leadId);
        } catch (refreshError) {
          this.logger.error('Failed to refresh token:', refreshError);
        }
      }

      if (error.response?.data?.error) {
        throw new InternalServerErrorException(
          `Erreur Google Contacts API: ${error.response.data.error.message}`,
        );
      }

      throw new InternalServerErrorException(
        'Erreur lors de la récupération du contact par Lead ID',
      );
    }
  }

  /**
   * Migration : Associe les contacts Google existants (sans Lead ID) avec les leads du CRM
   * Utilise le nom et numéro de téléphone pour faire le matching
   */
  async migrateExistingContacts(leads: any[]): Promise<{
    success: boolean;
    matched: number;
    updated: number;
    errors: string[];
    csvFilePath?: string;
    unmatchedContactsCount: number;
  }> {
    try {
      if (!this.accessToken) {
        this.logger.warn(
          'Google Contacts API not available - skipping migration',
        );
        return {
          success: false,
          matched: 0,
          updated: 0,
          errors: ['Google Contacts API not configured'],
          unmatchedContactsCount: 0,
        };
      }

      this.logger.log('Starting migration of existing Google contacts...');

      // Récupérer tous les contacts Google
      const allContacts = await this.getAllContacts();

      // Filtrer les contacts qui n'ont pas de Lead ID
      const contactsWithoutLeadId = allContacts.filter((contact) => {
        const hasLeadId = contact.userDefined?.some(
          (field: any) => field.key === 'Lead ID',
        );
        return !hasLeadId;
      });

      this.logger.log(
        `Found ${allContacts.length} contacts and ${contactsWithoutLeadId.length} without Lead ID`,
      );
      this.logger.log(
        `Attempting to match with ${leads.length} leads from CRM`,
      );

      let matched = 0;
      let updated = 0;
      const errors: string[] = [];
      const unmatchedContacts: any[] = [];

      // Délai entre chaque requête pour respecter les limites de l'API Google
      const delayBetweenRequests = 500; // 500ms = 0.5 seconde

      for (const contact of contactsWithoutLeadId) {
        try {
          // Extraire les informations du contact Google
          const contactInfo = this.extractContactInfo(contact);

          if (!contactInfo.phoneNumbers?.length) {
            this.logger.warn(
              `Contact ${contact.resourceName} has no phone number - skipping`,
            );

            // Ajouter aux contacts non matchés
            unmatchedContacts.push({
              resourceName: contact.resourceName,
              firstName: contactInfo.firstName || '',
              lastName: contactInfo.lastName || '',
              email: contactInfo.email || '',
              phoneNumbers: 'Aucun numéro',
              reason: 'Pas de numéro de téléphone',
            });

            continue;
          }

          // Chercher le lead correspondant
          const matchingLead = this.findMatchingLead(leads, contactInfo);

          if (matchingLead) {
            matched++;
            this.logger.log(
              `Matched contact with phone numbers ${contactInfo.phoneNumbers.join(', ')} to lead ${matchingLead.firstName} ${matchingLead.lastName} (ID: ${matchingLead.ID})`,
            );

            try {
              // Mettre à jour le contact Google avec toutes les infos du lead
              await this.updateGoogleContactWithLeadInfo(
                contact.resourceName,
                matchingLead,
              );
              updated++;
              this.logger.log(
                `Updated contact with lead info: ${matchingLead.firstName} ${matchingLead.lastName} (ID: ${matchingLead.ID})`,
              );

              // Attendre avant la prochaine requête pour respecter les limites de l'API
              await new Promise((resolve) =>
                setTimeout(resolve, delayBetweenRequests),
              );
            } catch (updateError) {
              // Si erreur 429 (rate limit), attendre plus longtemps et réessayer
              if (updateError.message.includes('429')) {
                this.logger.warn(
                  `Rate limit hit - waiting 5 seconds before retry...`,
                );
                await new Promise((resolve) => setTimeout(resolve, 5000));

                try {
                  await this.updateGoogleContactWithLeadInfo(
                    contact.resourceName,
                    matchingLead,
                  );
                  updated++;
                  this.logger.log(
                    `Updated contact after retry: ${matchingLead.firstName} ${matchingLead.lastName} (ID: ${matchingLead.ID})`,
                  );

                  // Attendre après un retry réussi
                  await new Promise((resolve) =>
                    setTimeout(resolve, delayBetweenRequests),
                  );
                } catch (retryError) {
                  const errorMsg = `Failed to update contact ${contact.resourceName} with Lead ID ${matchingLead.ID} even after retry: ${retryError.message}`;
                  this.logger.error(errorMsg);
                  errors.push(errorMsg);
                }
              } else {
                const errorMsg = `Failed to update contact ${contact.resourceName} with Lead ID ${matchingLead.ID}: ${updateError.message}`;
                this.logger.error(errorMsg);
                errors.push(errorMsg);
              }
            }
          } else {
            this.logger.warn(
              `No matching lead found for contact "${JSON.stringify(contactInfo)}"`,
            );

            // Ajouter aux contacts non matchés
            unmatchedContacts.push({
              resourceName: contact.resourceName,
              firstName: contactInfo.firstName || '',
              lastName: contactInfo.lastName || '',
              email: contactInfo.email || '',
              phoneNumbers: contactInfo.phoneNumbers.join('; '),
              reason: 'Aucun lead correspondant trouvé',
            });
          }
        } catch (contactError) {
          const errorMsg = `Error processing contact ${contact.resourceName}: ${contactError.message}`;
          this.logger.error(errorMsg);
          errors.push(errorMsg);
        }
      }

      // Créer le fichier CSV pour les contacts non matchés
      let csvFilePath: string | undefined;
      this.logger.log(`Found ${unmatchedContacts.length} unmatched contacts`);

      if (unmatchedContacts.length > 0) {
        this.logger.log('Creating CSV file for unmatched contacts...');
        try {
          csvFilePath =
            await this.createUnmatchedContactsCsv(unmatchedContacts);
          this.logger.log(`CSV file created successfully: ${csvFilePath}`);
        } catch (csvError) {
          this.logger.error('Failed to create CSV file:', csvError);
          errors.push(`Failed to create CSV file: ${csvError.message}`);
        }
      } else {
        this.logger.log('No unmatched contacts found - skipping CSV creation');
      }

      const result = {
        success: true,
        matched,
        updated,
        errors,
        csvFilePath,
        unmatchedContactsCount: unmatchedContacts.length,
      };

      this.logger.log(
        `Migration completed: ${matched} matched, ${updated} updated, ${unmatchedContacts.length} unmatched, ${errors.length} errors`,
      );

      if (csvFilePath) {
        this.logger.log(
          `CSV file created for unmatched contacts: ${csvFilePath}`,
        );
      }

      return result;
    } catch (error) {
      this.logger.error('Migration failed:', error);
      return {
        success: false,
        matched: 0,
        updated: 0,
        errors: [error.message],
        unmatchedContactsCount: 0,
      };
    }
  }

  /**
   * Récupère tous les contacts Google (avec pagination)
   */
  private async getAllContacts(): Promise<any[]> {
    const allContacts: any[] = [];
    let nextPageToken: string | undefined;

    do {
      const response = await axios.get(
        'https://people.googleapis.com/v1/people/me/connections',
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          params: {
            personFields: 'names,phoneNumbers,emailAddresses,userDefined',
            pageSize: 1000,
            pageToken: nextPageToken,
          },
        },
      );

      if (response.data.connections) {
        allContacts.push(...response.data.connections);
      }

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return allContacts;
  }

  /**
   * Extrait les informations utiles d'un contact Google pour le matching
   */
  private extractContactInfo(contact: any): {
    firstName?: string;
    lastName?: string;
    phoneNumbers: string[];
    email?: string;
  } {
    const info: any = {
      phoneNumbers: [],
    };

    // Nom et prénom
    if (contact.names && contact.names.length > 0) {
      info.firstName = contact.names[0].givenName?.toLowerCase()?.trim();
      info.lastName = contact.names[0].familyName?.toLowerCase()?.trim();
    }

    // Numéros de téléphone - récupérer TOUS les numéros
    if (contact.phoneNumbers) {
      for (const phone of contact.phoneNumbers) {
        const cleanPhone = this.cleanPhoneNumber(phone.value);
        if (cleanPhone) {
          info.phoneNumbers.push(cleanPhone);
        }
      }
    }

    // Email
    if (contact.emailAddresses && contact.emailAddresses.length > 0) {
      info.email = contact.emailAddresses[0].value?.toLowerCase()?.trim();
    }

    return info;
  }

  /**
   * Trouve le lead correspondant dans la liste basé uniquement sur le numéro de téléphone
   */
  private findMatchingLead(leads: any[], contactInfo: any): any {
    // Si aucun numéro de téléphone dans le contact, pas de match possible
    if (!contactInfo.phoneNumbers || contactInfo.phoneNumbers.length === 0) {
      return null;
    }

    return leads.find((lead) => {
      // Récupérer tous les numéros du lead
      const leadPhones: string[] = [];

      if (lead.phoneNumber) {
        const cleaned = this.cleanPhoneNumber(lead.phoneNumber);
        if (cleaned) leadPhones.push(cleaned);
      }

      if (lead.whatsappNumber) {
        const cleaned = this.cleanPhoneNumber(lead.whatsappNumber);
        if (cleaned) leadPhones.push(cleaned);
      }

      // Vérifier si au moins un numéro du contact correspond à un numéro du lead
      for (const contactPhone of contactInfo.phoneNumbers) {
        if (leadPhones.includes(contactPhone)) {
          return true; // Match trouvé !
        }
      }

      return false;
    });
  }

  /**
   * Met à jour un contact Google avec les informations du lead
   * (Lead ID, prénom, nom, email)
   */
  private async updateGoogleContactWithLeadInfo(
    resourceName: string,
    lead: any,
  ): Promise<void> {
    // Récupérer le contact existant pour obtenir l'etag
    const existingContact = await this.getContact(resourceName);

    // Conserver les userDefined existants et ajouter/mettre à jour le Lead ID
    const userDefined = existingContact.userDefined || [];
    const leadIdIndex = userDefined.findIndex(
      (field: any) => field.key === 'Lead ID',
    );

    if (leadIdIndex >= 0) {
      // ne rien faire, le Lead ID est déjà là
    } else {
      userDefined.push({
        key: 'Lead ID',
        value: lead.ID.toString(),
      });
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      etag: existingContact.etag,
      userDefined: userDefined,
      // names: [
      //   {
      //     givenName: lead.firstName,
      //     familyName: lead.lastName,
      //   },
      // ],
    };

    // Ajouter l'email si disponible
    // if (lead.email) {
    //   updateData.emailAddresses = [
    //     {
    //       value: lead.email,
    //       type: 'other',
    //     },
    //   ];
    // }

    await axios.patch(
      `https://people.googleapis.com/v1/${resourceName}:updateContact`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          updatePersonFields: 'names,emailAddresses,userDefined',
        },
      },
    );
  }

  /**
   * Crée un fichier CSV pour les contacts non matchés
   */
  private async createUnmatchedContactsCsv(
    unmatchedContacts: any[],
  ): Promise<string> {
    try {
      this.logger.log(
        `Creating CSV for ${unmatchedContacts.length} unmatched contacts`,
      );

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `unmatched-contacts-${timestamp}.csv`;
      const filePath = path.join(process.cwd(), 'logs', fileName);

      this.logger.log(`CSV file path: ${filePath}`);

      // Créer le dossier logs s'il n'existe pas
      const logsDir = path.join(process.cwd(), 'logs');
      this.logger.log(`Checking/creating logs directory: ${logsDir}`);

      if (!fs.existsSync(logsDir)) {
        this.logger.log('Creating logs directory...');
        await fsPromises.mkdir(logsDir, { recursive: true });
        this.logger.log('Logs directory created');
      } else {
        this.logger.log('Logs directory already exists');
      }

      // En-têtes CSV
      const headers = [
        'Resource Name',
        'Prénom',
        'Nom',
        'Email',
        'Numéros de téléphone',
        'Raison',
      ];

      // Fonction pour échapper et nettoyer les valeurs CSV
      const escapeCsvValue = (value: string): string => {
        if (!value) return '';

        // Remplacer les guillemets doubles par deux guillemets doubles
        const escaped = value.replace(/"/g, '""');

        // Entourer de guillemets si contient virgule, guillemet, saut de ligne ou point-virgule
        if (
          escaped.includes(',') ||
          escaped.includes('"') ||
          escaped.includes('\n') ||
          escaped.includes(';')
        ) {
          return `"${escaped}"`;
        }

        return escaped;
      };

      // Construire le contenu CSV
      this.logger.log('Building CSV content...');
      let csvContent = headers.map((h) => escapeCsvValue(h)).join(',') + '\n';

      for (const contact of unmatchedContacts) {
        const row = [
          contact.resourceName || '',
          contact.firstName || '',
          contact.lastName || '',
          contact.email || '',
          contact.phoneNumbers || '',
          contact.reason || '',
        ];

        csvContent +=
          row.map((val) => escapeCsvValue(val.toString())).join(',') + '\n';
      }

      this.logger.log(
        `CSV content built, length: ${csvContent.length} characters`,
      );

      // Écrire le fichier avec encodage UTF-8 et BOM pour Excel
      this.logger.log('Writing CSV file...');
      const bom = '\uFEFF'; // BOM pour UTF-8
      await fsPromises.writeFile(filePath, bom + csvContent, 'utf8');

      this.logger.log(`CSV file created successfully: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error('Failed to create CSV file:', error);
      throw error;
    }
  }

  /**
   * Nettoie un numéro de téléphone pour la comparaison
   */
  private cleanPhoneNumber(
    phoneNumber: string | undefined,
  ): string | undefined {
    if (!phoneNumber) return undefined;

    // Supprimer espaces, tirets, points, parenthèses
    let cleaned = phoneNumber.replace(/[\s\-\.\(\)]/g, '').trim();

    // Gérer les préfixes internationaux courants
    // +33 (France) -> 0
    if (cleaned.startsWith('+33')) {
      cleaned = '0' + cleaned.substring(3);
    }
    // +972 (Israël) -> 0
    else if (cleaned.startsWith('+972')) {
      cleaned = '0' + cleaned.substring(4);
    }
    // 0033 (France avec 00) -> 0
    else if (cleaned.startsWith('0033')) {
      cleaned = '0' + cleaned.substring(4);
    }
    // 00972 (Israël avec 00) -> 0
    else if (cleaned.startsWith('00972')) {
      cleaned = '0' + cleaned.substring(5);
    }
    // 00 suivi d'autres chiffres (autre pays) -> retirer le premier 0
    else if (cleaned.startsWith('00') && cleaned.length > 2) {
      cleaned = '0' + cleaned.substring(2);
    }

    return cleaned;
  }
}
