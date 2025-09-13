import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Lead } from '../lead/lead.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // Vérification des variables d'environnement requises
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      this.logger.error(
        'Missing Gmail configuration. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.',
      );
      this.logger.error(
        `GMAIL_USER: ${process.env.GMAIL_USER ? 'SET' : 'MISSING'}`,
      );
      this.logger.error(
        `GMAIL_APP_PASSWORD: ${process.env.GMAIL_APP_PASSWORD ? 'SET' : 'MISSING'}`,
      );
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // info@tsahalco.com
        pass: process.env.GMAIL_APP_PASSWORD, // Google App Password
      },
    });
  }

  async sendShihourimWeeklyReport(leads: Lead[]): Promise<void> {
    try {
      // Vérifier les credentials avant d'essayer d'envoyer
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        throw new Error(
          'Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.',
        );
      }

      const today = new Date();
      const dateString = today.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const subject = `Shihourim de la semaine - ${dateString}`;

      const htmlContent = this.generateShihourimEmailContent(leads, dateString);

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.SHIHOURIM_RECIPIENTS || process.env.GMAIL_USER,
        subject: subject,
        html: htmlContent,
      };

      this.logger.log(
        `Attempting to send email from ${mailOptions.from} to ${mailOptions.to}`,
      );
      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Shihourim weekly report sent successfully: ${result.messageId}`,
      );
    } catch (error) {
      this.logger.error('Failed to send Shihourim weekly report', error.stack);
      if (error.message.includes('Missing credentials')) {
        this.logger.error(
          'Gmail authentication failed. Please check your GMAIL_USER and GMAIL_APP_PASSWORD environment variables.',
        );
        this.logger.error(
          'Make sure you are using a Google App Password, not your regular password.',
        );
      }
      throw error;
    }
  }

  private generateShihourimEmailContent(
    leads: Lead[],
    dateString: string,
  ): string {
    if (leads.length === 0) {
      return `
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .no-leads { text-align: center; color: #666; font-style: italic; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Shihourim de la semaine</h1>
              <p>${dateString}</p>
            </div>
            <div class="content">
              <div class="no-leads">
                <p>Aucun lead avec une date de fin de service dans la semaine à venir.</p>
              </div>
            </div>
          </body>
        </html>
      `;
    }

    const leadsList = leads
      .map(
        (lead) =>
          `<li style="margin-bottom: 8px; padding: 8px; background-color: #f9f9f9; border-left: 3px solid #007bff;">
        <strong>${lead.firstName} ${lead.lastName}</strong> - ${this.formatDateForDisplay(lead.dateFinService)} - ${lead.nomPoste || 'Poste non spécifié'}
      </li>`,
      )
      .join('');

    return `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .summary { background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            ul { list-style-type: none; padding: 0; }
            li { margin-bottom: 8px; padding: 8px; background-color: #f9f9f9; border-left: 3px solid #007bff; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Shihourim de la semaine</h1>
            <p>${dateString}</p>
          </div>
          <div class="content">
            <div class="summary">
              <h2>Résumé</h2>
              <p><strong>Nombre total de leads :</strong> ${leads.length}</p>
              <p><strong>Période :</strong> Leads dont la date de fin de service est dans les 7 prochains jours</p>
            </div>
            
            <h2>Liste des leads</h2>
            <ul>
              ${leadsList}
            </ul>
          </div>
        </body>
      </html>
    `;
  }

  async testConnection(): Promise<boolean> {
    try {
      // Vérifier d'abord les variables d'environnement
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        this.logger.error(
          'Cannot test connection: Missing Gmail credentials in environment variables',
        );
        return false;
      }

      await this.transporter.verify();
      this.logger.log('Mail service connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('Mail service connection failed', error.stack);
      if (error.message.includes('Missing credentials')) {
        this.logger.error(
          'This usually means GMAIL_USER or GMAIL_APP_PASSWORD environment variables are not set correctly',
        );
      }
      return false;
    }
  }

  // Méthode utilitaire pour formater les dates au format dd/mm/yyyy
  private formatDateForDisplay(dateString: string): string {
    try {
      // Si la date est déjà au format dd/mm/yyyy, la retourner telle quelle
      if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return dateString;
      }

      // Essayer de parser différents formats de date
      let date: Date;

      // Format YYYY-MM-DD
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        date = new Date(dateString);
      }
      // Format MM/DD/YYYY
      else if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [month, day, year] = dateString.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      // Format DD-MM-YYYY
      else if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = dateString.split('-');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      // Autres formats
      else {
        date = new Date(dateString);
      }

      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return dateString; // Retourner la chaîne originale si impossible à parser
      }

      // Formater au format dd/mm/yyyy
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      // En cas d'erreur, retourner la chaîne originale
      return dateString;
    }
  }
}
