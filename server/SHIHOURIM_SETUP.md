# Configuration du système Shihourim

Ce guide vous explique comment configurer le système d'envoi automatique des rapports Shihourim hebdomadaires.

## 🚀 Fonctionnalités

- **Envoi automatique** : Tous les samedis à 18h00 (heure d'Israël)
- **Contenu intelligent** : Inclut tous les leads dont la `dateFinService` arrive dans les 7 jours suivants
- **Email formaté** : HTML avec tableau détaillé et résumé
- **Gestion d'erreurs** : Logs détaillés et vérification de santé quotidienne

## 📧 Configuration Gmail (Google Workspace)

### 1. Activation de l'authentification à 2 facteurs

1. Allez dans votre [compte Google](https://myaccount.google.com/)
2. **Sécurité** > **Connexion à Google** > **Authentification à 2 facteurs**
3. Activez l'authentification à 2 facteurs si ce n'est pas déjà fait

### 2. Génération d'un mot de passe d'application

1. Dans **Sécurité** > **Authentification à 2 facteurs**
2. Cliquez sur **Mots de passe des applications**
3. Sélectionnez l'application : **Autre** (nom personnalisé)
4. Nommez-la : "CRM Tsahal Shihourim"
5. **Générez** le mot de passe
6. ⚠️ **IMPORTANT** : Copiez ce mot de passe, il ne sera plus affiché

### 3. Configuration des variables d'environnement

Ajoutez ces variables à votre fichier `.env` :

```env
# Gmail Configuration pour Shihourim
GMAIL_USER=info@tsahalco.com
GMAIL_APP_PASSWORD=votre_mot_de_passe_application_google
SHIHOURIM_RECIPIENTS=info@tsahalco.com
```

**Notes importantes :**

- `GMAIL_USER` : Votre adresse email Google Workspace
- `GMAIL_APP_PASSWORD` : Le mot de passe d'application généré (PAS votre mot de passe habituel)
- `SHIHOURIM_RECIPIENTS` : Liste des destinataires (séparés par des virgules pour plusieurs)

## 🔧 Endpoints de test

### Test manuel du rapport Shihourim

#### Test avec la date actuelle (semaine suivante)

```
POST /scheduler/test-shihourim-report
```

#### Test avec une date personnalisée

```
POST /scheduler/test-shihourim-report?startDate=2024-01-15
```

- **startDate** : Date de début au format YYYY-MM-DD
- Le système cherchera les leads avec `dateFinService` entre cette date et 7 jours après
- Exemple : `startDate=2024-01-15` cherche entre le 15/01/2024 et le 22/01/2024

**Réponse :**

```json
{
  "message": "Test Shihourim report sent successfully",
  "success": true,
  "leadsCount": 3,
  "dateRange": "2024-01-15 to 2024-01-22"
}
```

### Vérification de la santé du service mail

```
GET /scheduler/mail-health-check
```

### Vérification de la configuration

```
GET /scheduler/check-config
```

## 📋 Format du rapport

Le rapport inclut automatiquement :

### Informations générales

- Date d'envoi
- Nombre total de leads concernés
- Période couverte (7 jours suivants)

### Détails pour chaque lead

- Nom complet
- Email
- Téléphone
- Date de fin de service
- Statut actuel
- Type de service

## ⏰ Planification

### Rapport hebdomadaire

- **Quand** : Tous les samedis à 18h00
- **Timezone** : Asia/Jerusalem (heure d'Israël)
- **Contenu** : Leads avec `dateFinService` dans les 7 prochains jours

### Vérification de santé

- **Quand** : Tous les jours à 9h00
- **Action** : Test de connexion au service mail
- **Logs** : Résultats dans les logs de l'application

## 🐛 Dépannage

### Le mail ne s'envoie pas

1. Vérifiez que les variables d'environnement sont correctes
2. Testez la connexion : `GET /scheduler/mail-health-check`
3. Vérifiez que l'authentification à 2 facteurs est activée
4. Assurez-vous d'utiliser un mot de passe d'application et non votre mot de passe principal

### Aucun lead dans le rapport

- C'est normal s'il n'y a aucun lead avec une `dateFinService` dans les 7 prochains jours
- Le rapport sera quand même envoyé avec un message indiquant qu'il n'y a aucun lead

### Problèmes de timezone

- Le système utilise la timezone `Asia/Jerusalem`
- Si vous êtes dans une autre timezone, ajustez dans `scheduler.service.ts`

## 🔍 Logs

Surveillez les logs pour :

- Confirmations d'envoi réussi
- Erreurs de connexion mail
- Nombre de leads trouvés
- Résultats des vérifications de santé

## 🚨 Sécurité

- ⚠️ **JAMAIS** de mot de passe en dur dans le code
- Utilisez toujours des mots de passe d'application Google
- Gardez vos variables d'environnement sécurisées
- Vérifiez régulièrement les logs pour détecter des anomalies
