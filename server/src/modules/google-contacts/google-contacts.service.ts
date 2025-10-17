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

      const contact: any = {
        names:
          updateData.firstName || updateData.lastName
            ? [
                {
                  givenName: updateData.firstName,
                  familyName: updateData.lastName,
                },
              ]
            : undefined,
        phoneNumbers: updateData.phoneNumber
          ? [
              {
                value: updateData.phoneNumber,
                type: 'mobile',
              },
            ]
          : undefined,
        userDefined: updateData.leadId
          ? [
              {
                key: 'Lead ID',
                value: updateData.leadId.toString(),
              },
            ]
          : undefined,
      };

      // Ajouter le numéro WhatsApp s'il est fourni et différent du numéro de téléphone
      if (
        updateData.whatsappNumber &&
        updateData.whatsappNumber !== updateData.phoneNumber
      ) {
        if (!contact.phoneNumbers) contact.phoneNumbers = [];
        contact.phoneNumbers.push({
          value: updateData.whatsappNumber,
          type: 'other',
        });
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
}
