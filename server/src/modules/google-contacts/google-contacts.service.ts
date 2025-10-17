import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as path from 'path';
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
      this.logger.error('Failed to get Google contact:', error);
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

  private cleanPhoneNumber(
    phoneNumber: string | undefined,
  ): string | undefined {
    if (!phoneNumber) {
      return undefined;
    }

    // Supprimer les espaces, tirets, points et parenthèses
    return phoneNumber.replace(/[\s\-\.\(\)]/g, '').trim();
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
}
