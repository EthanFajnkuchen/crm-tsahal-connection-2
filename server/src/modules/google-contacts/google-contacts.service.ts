import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { google } from 'googleapis';
import { CreateGoogleContactDto, GoogleContactResponseDto } from './google-contacts.dto';

@Injectable()
export class GoogleContactsService {
  private readonly logger = new Logger(GoogleContactsService.name);
  private people: any;

  constructor() {
    this.initializeGoogleAPI();
  }

  private async initializeGoogleAPI() {
    try {
      // Configuration de l'authentification Google
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_CREDENTIALS_FILE || './google-credentials.json',
        scopes: ['https://www.googleapis.com/auth/contacts'],
      });

      this.people = google.people({ version: 'v1', auth });
      this.logger.log('Google Contacts API initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Google Contacts API:', error);
      throw new InternalServerErrorException('Failed to initialize Google Contacts API');
    }
  }

  async createContact(createContactDto: CreateGoogleContactDto): Promise<GoogleContactResponseDto> {
    try {
      const { firstName, lastName, phoneNumber, whatsappNumber, leadId, email } = createContactDto;

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

      // Créer le contact dans Google Contacts
      const response = await this.people.people.createContact({
        requestBody: contact,
      });

      this.logger.log(`Contact created successfully for lead ID: ${leadId}`);

      return {
        success: true,
        message: 'Contact créé avec succès dans Google Contacts',
        contactId: response.data.resourceName,
        resourceName: response.data.resourceName,
      };
    } catch (error) {
      this.logger.error('Failed to create Google contact:', error);
      
      if (error.response?.data?.error) {
        throw new InternalServerErrorException(
          `Erreur Google Contacts API: ${error.response.data.error.message}`
        );
      }
      
      throw new InternalServerErrorException(
        'Erreur lors de la création du contact dans Google Contacts'
      );
    }
  }

  async getContact(contactId: string): Promise<any> {
    try {
      const response = await this.people.people.get({
        resourceName: contactId,
        personFields: 'names,phoneNumbers,emailAddresses,userDefined',
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to get Google contact:', error);
      throw new InternalServerErrorException('Erreur lors de la récupération du contact');
    }
  }

  async updateContact(contactId: string, updateData: Partial<CreateGoogleContactDto>): Promise<GoogleContactResponseDto> {
    try {
      const contact: any = {
        names: updateData.firstName || updateData.lastName ? [
          {
            givenName: updateData.firstName,
            familyName: updateData.lastName,
          },
        ] : undefined,
        phoneNumbers: updateData.phoneNumber ? [
          {
            value: updateData.phoneNumber,
            type: 'mobile',
          },
        ] : undefined,
        userDefined: updateData.leadId ? [
          {
            key: 'Lead ID',
            value: updateData.leadId.toString(),
          },
        ] : undefined,
      };

      // Ajouter le numéro WhatsApp s'il est fourni et différent du numéro de téléphone
      if (updateData.whatsappNumber && updateData.whatsappNumber !== updateData.phoneNumber) {
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

      const response = await this.people.people.updateContact({
        resourceName: contactId,
        updatePersonFields: 'names,phoneNumbers,emailAddresses,userDefined',
        requestBody: contact,
      });

      this.logger.log(`Contact updated successfully: ${contactId}`);

      return {
        success: true,
        message: 'Contact mis à jour avec succès',
        contactId: contactId,
        resourceName: contactId,
      };
    } catch (error) {
      this.logger.error('Failed to update Google contact:', error);
      throw new InternalServerErrorException('Erreur lors de la mise à jour du contact');
    }
  }

  async deleteContact(contactId: string): Promise<GoogleContactResponseDto> {
    try {
      await this.people.people.deleteContact({
        resourceName: contactId,
      });

      this.logger.log(`Contact deleted successfully: ${contactId}`);

      return {
        success: true,
        message: 'Contact supprimé avec succès',
        contactId: contactId,
      };
    } catch (error) {
      this.logger.error('Failed to delete Google contact:', error);
      throw new InternalServerErrorException('Erreur lors de la suppression du contact');
    }
  }

  async searchContacts(query: string): Promise<any[]> {
    try {
      const response = await this.people.people.searchContacts({
        query: query,
        readMask: 'names,phoneNumbers,emailAddresses,userDefined',
      });

      return response.data.results || [];
    } catch (error) {
      this.logger.error('Failed to search Google contacts:', error);
      throw new InternalServerErrorException('Erreur lors de la recherche des contacts');
    }
  }
}
