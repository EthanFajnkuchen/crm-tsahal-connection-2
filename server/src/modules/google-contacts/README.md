# Module Google Contacts

Ce module permet d'intégrer Google Contacts avec l'application CRM pour sauvegarder automatiquement les leads en tant que contacts Google.

## Configuration

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API **People API** (qui gère Google Contacts)

### 2. Créer des identifiants OAuth 2.0

1. Dans Google Cloud Console, allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "+ CREATE CREDENTIALS" > "OAuth client ID"
3. Sélectionnez "Web application"
4. Donnez un nom (ex: "CRM Google Contacts")
5. Ajoutez `http://localhost:3000` dans "Authorized redirect URIs"
6. Cliquez sur "Create"
7. Notez le `client_id` et `client_secret`

### 3. Obtenir un refresh token

1. Utilisez l'URL d'autorisation suivante (remplacez YOUR_CLIENT_ID) :

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000&scope=https://www.googleapis.com/auth/contacts&response_type=code&access_type=offline
```

2. Autorisez l'application et récupérez le `code` depuis l'URL de redirection
3. Échangez le code contre un refresh token :

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&code=YOUR_CODE&grant_type=authorization_code&redirect_uri=http://localhost:3000"
```

### 4. Variables d'environnement

Ajoutez les variables suivantes à votre fichier `.env` :

```env
# Google Contacts API Configuration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
```

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
