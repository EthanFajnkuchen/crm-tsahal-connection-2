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

  async sendActivityConfirmationEmail(
    participantEmail: string,
    participantName: string,
    activityName: string,
    activityDate: Date | string,
  ): Promise<void> {
    try {
      // Vérifier les credentials avant d'essayer d'envoyer
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        throw new Error(
          'Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.',
        );
      }

      // Convertir la date en chaîne pour le formatage
      let dateString: string;
      if (activityDate instanceof Date) {
        dateString = activityDate.toISOString();
      } else {
        dateString = activityDate;
      }

      const formattedDate = this.formatDateForDisplay(dateString);
      const subject = `Confirmation d'inscription - ${activityName}`;

      const htmlContent = this.generateActivityConfirmationEmailContent(
        participantName,
        activityName,
        formattedDate,
      );

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: participantEmail,
        subject: subject,
        html: htmlContent,
      };

      this.logger.log(
        `Sending activity confirmation email to ${participantEmail} for activity: ${activityName}`,
      );

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Activity confirmation email sent successfully: ${result.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send activity confirmation email to ${participantEmail}`,
        error.stack,
      );
      throw error;
    }
  }

  private generateActivityConfirmationEmailContent(
    participantName: string,
    activityName: string,
    activityDate: string,
  ): string {
    return `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0; 
              padding: 0; 
              background-color: #f5f5f5;
            }
            .container { 
              max-width: 600px; 
              margin: 20px auto; 
              background-color: white; 
              border-radius: 10px; 
              overflow: hidden; 
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: black; 
              padding: 30px 20px; 
              text-align: center; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: 300; 
            }
            .content { 
              padding: 40px 30px; 
            }
            .greeting { 
              font-size: 18px; 
              margin-bottom: 20px; 
              color: #2c3e50;
            }
            .event-details { 
              background-color: #f8f9fa; 
              border-left: 4px solid #667eea; 
              padding: 20px; 
              margin: 25px 0; 
              border-radius: 0 8px 8px 0;
            }
            .event-details h2 { 
              margin: 0 0 10px 0; 
              color: #667eea; 
              font-size: 20px;
            }
            .event-date { 
              font-size: 16px; 
              color: #7f8c8d; 
              font-weight: 500;
            }
            .message { 
              font-size: 16px; 
              line-height: 1.8; 
              margin: 20px 0; 
            }
            .highlight { 
              color: #667eea; 
              font-weight: 600; 
            }
            .footer { 
              background-color: #f8f9fa; 
              padding: 20px; 
              text-align: center; 
              color: #7f8c8d; 
              font-size: 14px; 
              border-top: 1px solid #e9ecef;
            }
            .logo { 
              font-size: 24px; 
              font-weight: bold; 
              margin-bottom: 10px; 
              color: black;
            }
            .cta { 
              background-color: #667eea; 
              color: white; 
              padding: 12px 25px; 
              border-radius: 25px; 
              text-decoration: none; 
              display: inline-block; 
              margin: 20px 0; 
              font-weight: 500; 
              transition: background-color 0.3s;
            }
            .emoji { 
              font-size: 20px; 
              margin: 0 5px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🇮🇱 Tsahal Connection</div>
              <h1>Inscription confirmée !</h1>
            </div>
            
            <div class="content">
              <div class="greeting">
                Shalom <strong>${participantName}</strong> ! 👋
              </div>
              
              <div class="message">
                Nous avons le plaisir de vous confirmer votre inscription pour :
              </div>
              
              <div class="event-details">
                <h2><span class="emoji">🎯</span> ${activityName}</h2>
                <div class="event-date">
                  <span class="emoji">📅</span> Prévu pour le <strong>${activityDate}</strong>
                </div>
              </div>
              
              <div class="message">
                <span class="highlight">Nous avons hâte de vous retrouver</span> lors de cet événement ! 
                Votre participation contribue à renforcer la communauté des français en Israël 
                et à soutenir nos futurs soldats.
              </div>
              
              <div class="message">
                <strong>Quelques informations importantes :</strong>
                <ul style="margin: 15px 0; padding-left: 20px;">
                  <li>Merci de conserver cet email comme confirmation de votre inscription</li>
                  <li>En cas d'empêchement, nous vous remercions de nous prévenir à l'avance</li>
                  <li>N'hésitez pas à nous contacter si vous avez des questions</li>
                </ul>
              </div>
              
              <div class="message">
                Merci pour votre engagement et à très bientôt ! <span class="emoji">🙏</span>
              </div>
            </div>
            
            <div class="footer">
              <strong>Équipe Tsahal Connection</strong><br>
              Pour toute question : ${process.env.GMAIL_USER || 'info@tsahalconnection.com'}<br>
              <em>Vous accompagner, notre fierté !</em>
            </div>
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
