import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Lead } from '../lead/lead.entity';
import { ChangeRequest } from '../change-request/change-request.entity';

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

  async sendLeadConfirmationEmail(
    candidateEmail: string,
    candidateName: string,
    leadId: number,
  ): Promise<void> {
    try {
      // Vérifier les credentials avant d'essayer d'envoyer
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        throw new Error(
          'Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.',
        );
      }

      const subject = 'Formulaire reçu ! - Tsahal Connection';
      const htmlContent = this.generateLeadConfirmationEmailContent(
        candidateName,
        leadId,
      );

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: candidateEmail,
        subject: subject,
        html: htmlContent,
      };

      this.logger.log(
        `Sending lead confirmation email to ${candidateEmail} for lead ID: ${leadId}`,
      );

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Lead confirmation email sent successfully: ${result.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send lead confirmation email to ${candidateEmail}`,
        error.stack,
      );
      throw error;
    }
  }

  async sendNewLeadNotificationEmail(
    candidateName: string,
    candidateEmail: string,
    leadId: number,
  ): Promise<void> {
    try {
      // Vérifier les credentials avant d'essayer d'envoyer
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        throw new Error(
          'Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.',
        );
      }

      const subject = `Nouvelle candidature reçue - ${candidateName}`;
      const htmlContent = this.generateNewLeadNotificationEmailContent(
        candidateName,
        candidateEmail,
        leadId,
      );

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: 'info@tsahalco.com',
        subject: subject,
        html: htmlContent,
      };

      this.logger.log(
        `Sending new lead notification email for lead ID: ${leadId}`,
      );

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `New lead notification email sent successfully: ${result.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send new lead notification email for lead ID: ${leadId}`,
        error.stack,
      );
      throw error;
    }
  }

  private generateLeadConfirmationEmailContent(
    candidateName: string,
    leadId: number,
  ): string {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de candidature</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #1e3a8a;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .content {
                background-color: #f8f9fa;
                padding: 30px;
                border-radius: 0 0 8px 8px;
            }
            .highlight {
                background-color: #e3f2fd;
                padding: 15px;
                border-left: 4px solid #2196f3;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🇮🇱 Tsahal Connection</h1>
            <h2>Formulaire reçu !</h2>
        </div>
        
        <div class="content">
            <p>Shalom ${candidateName} 👋</p>
            
            <p>Nous avons bien reçu votre inscription via notre formulaire de contact.<br>
            Un membre de notre équipe prendra contact avec vous dans les prochains jours afin de répondre à votre demande.</p>
            
            <div class="highlight">
                <strong>📩 Et si vous ne recevez pas de réponse sous 14 jours ouvrés, n'hésitez pas à nous relancer directement :</strong><br><br>
                <strong>📧 Par email :</strong> info@tsahalco.com<br><br>
                <strong>💬 Ou par WhatsApp :</strong> +972-54-905-6016
            </div>
            
            <p>Nous vous remercions pour votre intérêt et votre confiance.<br>
            À très bientôt,</p>
            
            <p><strong>L'équipe Tsahal Connection</strong><br>
            <em>"Vous accompagner, notre fierté !"</em></p>
        </div>
        
        <div class="footer">
            <p>Tsahal Connection - Votre partenaire pour l'intégration en Israël</p>
        </div>
    </body>
    </html>
    `;
  }

  private generateNewLeadNotificationEmailContent(
    candidateName: string,
    candidateEmail: string,
    leadId: number,
  ): string {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouvelle candidature reçue</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #861A8F;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .content {
                background-color: #fef2f2;
                padding: 30px;
                border-radius: 0 0 8px 8px;
            }
            .alert {
                background-color: #fef3c7;
                padding: 15px;
                border-left: 4px solid #f59e0b;
                margin: 20px 0;
            }
            .info-box {
                background-color: #e0f2fe;
                padding: 15px;
                border-radius: 5px;
                margin: 15px 0;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚨 Nouveau formulaire reçu</h1>
            <h2>Action requise</h2>
        </div>
        
        <div class="content">
            <div class="alert">
                <strong>⚠️ Une nouvelle candidature vient d'être soumise et nécessite votre attention.</strong>
            </div>
            
            <div class="info-box">
                <h3>📋 Informations du candidat :</h3>
                <ul>
                    <li><strong>Nom :</strong> ${candidateName}</li>
                    <li><strong>Email :</strong> ${candidateEmail}</li>
                    <li><strong>ID Candidature :</strong> #${leadId}</li>
                    <li><strong>Date de soumission :</strong> ${new Date().toLocaleDateString('fr-FR')}</li>
                </ul>
            </div>
            
            <p>Le candidat a reçu un email de confirmation automatique. Il est maintenant temps de traiter sa candidature dans le système CRM.</p>
            
            <p><strong>Prochaines étapes :</strong></p>
            <ol>
                <li>Connectez-vous au système CRM</li>
                <li>Consultez le dossier du candidat (ID: ${leadId})</li>
                <li>Examinez les informations fournies</li>
                <li>Mettez à jour le statut selon votre processus</li>
            </ol>
            
            <p>Merci de traiter cette candidature dans les plus brefs délais.</p>
        </div>
        
        <div class="footer">
            <p>Tsahal Co - Système de notification automatique</p>
        </div>
    </body>
      </html>
    `;
  }

  /**
   * Envoie un email de notification groupé pour les demandes de modification
   * @param lead Le contact concerné
   * @param requests Les demandes de modification à notifier
   * @param volunteer Le nom du volontaire qui a fait les modifications
   */
  async sendChangeRequestNotificationEmail(
    lead: Lead,
    requests: ChangeRequest[],
    volunteer: string,
  ): Promise<void> {
    try {
      // Vérifier les credentials avant d'essayer d'envoyer
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        throw new Error(
          'Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.',
        );
      }

      const leadName = `${lead.firstName} ${lead.lastName}`;
      const subject = `Nouvelles demandes de modification - ${leadName}`;
      const htmlContent = this.generateChangeRequestNotificationEmailContent(
        lead,
        requests,
        volunteer,
      );

      // Récupérer l'email des admins depuis les variables d'environnement
      const isProduction = process.env.NODE_ENV === 'production';
      const adminEmails = isProduction
        ? process.env.SHIHOURIM_RECIPIENTS
        : 'yoan.partouche@gmail.com';

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: Array.isArray(adminEmails) ? adminEmails.join(',') : adminEmails,
        subject: subject,
        html: htmlContent,
      };

      this.logger.log(
        `Sending change request notification email (${isProduction ? 'PROD' : 'DEV'}) to ${Array.isArray(adminEmails) ? adminEmails.join(',') : adminEmails}`,
      );

      this.logger.log(
        `Sending change request notification email for ${requests.length} request(s) from ${volunteer} for lead ${leadName} (ID: ${lead.ID})`,
      );

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Change request notification email sent successfully: ${result.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send change request notification email for lead ${lead.ID}`,
        error.stack,
      );
      throw error;
    }
  }

  private generateChangeRequestNotificationEmailContent(
    lead: Lead,
    requests: ChangeRequest[],
    volunteer: string,
  ): string {
    const leadName = `${lead.firstName} ${lead.lastName}`;
    const leadId = lead.ID;
    const requestCount = requests.length;
    const plural = requestCount > 1 ? 's' : '';

    // Générer la liste des modifications
    const requestsList = requests
      .map((request, index) => {
        const oldValue = this.formatDisplayValue(request.oldValue);
        const newValue = this.formatDisplayValue(request.newValue);
        const dateModified = new Date(request.dateModified).toLocaleDateString(
          'fr-FR',
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          },
        );

        return `
          <tr style="border-bottom: 1px solid #e0e0e0;">
            <td style="padding: 12px; vertical-align: top;">
              <strong style="color: #667eea;">${index + 1}.</strong>
            </td>
            <td style="padding: 12px; vertical-align: top;">
              <div style="margin-bottom: 8px;">
                <strong style="color: #333;">Champ modifié :</strong><br>
                <span style="background-color: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${request.fieldChanged}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <strong style="color: #d32f2f;">Ancienne valeur :</strong><br>
                <span style="color: #666;">${oldValue || '(vide)'}</span>
              </div>
              <div>
                <strong style="color: #2e7d32;">Nouvelle valeur :</strong><br>
                <span style="color: #333; font-weight: 500;">${newValue || '(vide)'}</span>
              </div>
            </td>
            <td style="padding: 12px; vertical-align: top; color: #666; font-size: 14px;">
              ${dateModified}
            </td>
          </tr>
        `;
      })
      .join('');

    // URL de l'application (à configurer dans les variables d'environnement)
    const appUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const reviewUrl = `${appUrl}/volontaires`;

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Demandes de modification</title>
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
            max-width: 700px;
            margin: 20px auto;
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 300;
          }
          .content {
            padding: 30px;
          }
          .alert-box {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-box {
            background-color: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .cta-button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 12px 25px;
            border-radius: 25px;
            text-decoration: none;
            margin: 20px 0;
            font-weight: 500;
            transition: background-color 0.3s;
          }
          .cta-button:hover {
            background-color: #5568d3;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e9ecef;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Nouvelles demandes de modification</h1>
          </div>
          
          <div class="content">
            <div class="alert-box">
              <strong>⚠️ Action requise</strong><br>
              Le volontaire <strong>${volunteer}</strong> a soumis ${requestCount} demande${plural} de modification pour le contact suivant.
            </div>

            <div class="info-box">
              <h2 style="margin-top: 0; color: #2196f3;">📋 Informations du contact</h2>
              <p style="margin: 5px 0;">
                <strong>Nom :</strong> ${leadName}<br>
                <strong>ID Candidature :</strong> #${leadId}<br>
                <strong>Email :</strong> ${lead.email || 'Non renseigné'}<br>
                <strong>Téléphone :</strong> ${lead.phoneNumber || 'Non renseigné'}
              </p>
            </div>

            <h2 style="color: #333; margin-top: 30px;">📝 Détails des modifications</h2>
            
            <table>
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 12px; text-align: left; width: 50px;">#</th>
                  <th style="padding: 12px; text-align: left;">Modification</th>
                  <th style="padding: 12px; text-align: left; width: 150px;">Date</th>
                </tr>
              </thead>
              <tbody>
                ${requestsList}
              </tbody>
            </table>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${reviewUrl}" class="cta-button">
                👉 Examiner les demandes dans le CRM
              </a>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              <strong>Note :</strong> Ces modifications sont en attente de validation. 
              Veuillez les examiner et les approuver ou les refuser depuis l'interface d'administration.
            </p>
          </div>
          
          <div class="footer">
            <strong>Équipe Tsahal Connection</strong><br>
            Système de notification automatique<br>
            <em>Vous accompagner, notre fierté !</em>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Formate une valeur pour l'affichage dans l'email
   */
  private formatDisplayValue(value: string): string {
    if (!value || value === 'null' || value === 'undefined') {
      return '(vide)';
    }

    // Vérifier si c'est une date au format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(value)) {
      return this.formatDateForDisplay(value);
    }

    return value;
  }
}
