# Module Google Contacts

Ce module permet d'intégrer Google Contacts avec l'application CRM pour sauvegarder automatiquement les leads en tant que contacts Google.

## Configuration

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google People (Contacts)

### 2. Créer des identifiants de service

1. Dans Google Cloud Console, allez dans "IAM & Admin" > "Service Accounts"
2. Créez un nouveau compte de service
3. Téléchargez le fichier JSON des identifiants
4. Placez le fichier dans le répertoire racine du serveur et nommez-le `google-credentials.json`

### 3. Variables d'environnement

Ajoutez les variables suivantes à votre fichier `.env` :

```env
# Chemin vers le fichier de credentials Google (optionnel, par défaut: ./google-credentials.json)
GOOGLE_CREDENTIALS_FILE=./google-credentials.json
```

### 4. Partager le calendrier Google Contacts

1. Ouvrez Google Contacts
2. Allez dans "Paramètres" > "Partager avec d'autres"
3. Ajoutez l'email du compte de service créé précédemment
4. Donnez les permissions "Modifier" au compte de service

## Fonctionnalités

### Création automatique de contacts

Lors de la création d'un lead, un contact Google est automatiquement créé avec :
- Prénom et nom
- Numéro de téléphone principal
- Numéro WhatsApp (si différent du téléphone principal)
- Email
- ID du lead (dans les champs personnalisés)

### Endpoints disponibles

- `POST /google-contacts` - Créer un contact
- `GET /google-contacts/:contactId` - Récupérer un contact
- `PUT /google-contacts/:contactId` - Mettre à jour un contact
- `DELETE /google-contacts/:contactId` - Supprimer un contact
- `GET /google-contacts/search?q=query` - Rechercher des contacts

## Utilisation

Le module est automatiquement intégré dans le processus de création de leads. Aucune action supplémentaire n'est requise pour créer des contacts Google lors de la création d'un lead.

## Dépannage

### Erreur d'authentification
- Vérifiez que le fichier `google-credentials.json` est présent et correct
- Vérifiez que l'API Google People est activée
- Vérifiez que le compte de service a les permissions appropriées

### Erreur de permissions
- Vérifiez que le compte de service a accès au calendrier Google Contacts
- Vérifiez que l'email du compte de service est partagé avec le calendrier

