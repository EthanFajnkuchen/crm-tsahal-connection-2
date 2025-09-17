# 📋 API Documentation - Activité Confirmation

Module de gestion des confirmations de participation aux activités de service.

## 🌐 Base URL

```
/api/activite-conf
```

---

## 📝 Endpoints

### 1. **POST** `/api/activite-conf`

**Créer une nouvelle confirmation d'activité**

#### Body (JSON):

```json
{
  "activiteType": 1,
  "firstName": "Jean",
  "lastName": "Dupont",
  "isFuturSoldier": true,
  "phoneNumber": "0123456789",
  "mail": "jean.dupont@email.com",
  "lead_id": 42,
  "hasArrived": false
}
```

#### Response: `201 Created`

```json
{
  "id": 1,
  "activiteType": 1,
  "firstName": "Jean",
  "lastName": "Dupont",
  "isFuturSoldier": true,
  "phoneNumber": "0123456789",
  "mail": "jean.dupont@email.com",
  "lead_id": 42,
  "hasArrived": false
}
```

---

### 2. **GET** `/api/activite-conf`

**Lister toutes les confirmations avec filtres optionnels**

#### Query Parameters (optionnels):

- `activiteType` : Filtrer par type d'activité
- `lead_id` : Filtrer par ID du lead
- `isFuturSoldier` : Filtrer par statut futur soldat (`true`/`false`)
- `hasArrived` : Filtrer par statut d'arrivée (`true`/`false`)

#### Exemples:

```
GET /api/activite-conf
GET /api/activite-conf?activiteType=1
GET /api/activite-conf?lead_id=42
GET /api/activite-conf?isFuturSoldier=true&hasArrived=false
```

#### Response: `200 OK`

```json
[
  {
    "id": 1,
    "activiteType": 1,
    "firstName": "Jean",
    "lastName": "Dupont",
    "isFuturSoldier": true,
    "phoneNumber": "0123456789",
    "mail": "jean.dupont@email.com",
    "lead_id": 42,
    "hasArrived": false
  }
]
```

---

### 3. **GET** `/api/activite-conf/statistics`

**Obtenir les statistiques globales**

#### Response: `200 OK`

```json
{
  "total": 150,
  "futurSoldiers": 95,
  "hasArrived": 87,
  "byActiviteType": [
    {
      "activiteType": 1,
      "count": 45
    },
    {
      "activiteType": 2,
      "count": 32
    }
  ]
}
```

---

### 4. **GET** `/api/activite-conf/by-lead/:leadId`

**Lister les confirmations pour un lead spécifique**

#### Path Parameters:

- `leadId` : ID du lead

#### Exemple:

```
GET /api/activite-conf/by-lead/42
```

#### Response: `200 OK`

```json
[
  {
    "id": 1,
    "activiteType": 1,
    "firstName": "Jean",
    "lastName": "Dupont",
    "isFuturSoldier": true,
    "phoneNumber": "0123456789",
    "mail": "jean.dupont@email.com",
    "lead_id": 42,
    "hasArrived": false
  }
]
```

---

### 5. **GET** `/api/activite-conf/by-activite-type/:activiteType`

**Lister les confirmations pour un type d'activité spécifique**

#### Path Parameters:

- `activiteType` : ID du type d'activité

#### Exemple:

```
GET /api/activite-conf/by-activite-type/1
```

#### Response: `200 OK`

```json
[
  {
    "id": 1,
    "activiteType": 1,
    "firstName": "Jean",
    "lastName": "Dupont",
    "isFuturSoldier": true,
    "phoneNumber": "0123456789",
    "mail": "jean.dupont@email.com",
    "lead_id": 42,
    "hasArrived": false
  }
]
```

---

### 6. **GET** `/api/activite-conf/:id`

**Obtenir une confirmation par son ID**

#### Path Parameters:

- `id` : ID de la confirmation

#### Exemple:

```
GET /api/activite-conf/1
```

#### Response: `200 OK`

```json
{
  "id": 1,
  "activiteType": 1,
  "firstName": "Jean",
  "lastName": "Dupont",
  "isFuturSoldier": true,
  "phoneNumber": "0123456789",
  "mail": "jean.dupont@email.com",
  "lead_id": 42,
  "hasArrived": false
}
```

#### Response: `404 Not Found`

```json
{
  "statusCode": 404,
  "message": "ActiviteConf with ID 999 not found"
}
```

---

### 7. **PUT** `/api/activite-conf/:id`

**Modifier une confirmation existante**

#### Path Parameters:

- `id` : ID de la confirmation

#### Body (JSON) - Tous les champs sont optionnels:

```json
{
  "firstName": "Pierre",
  "hasArrived": true
}
```

#### Exemple:

```
PUT /api/activite-conf/1
```

#### Response: `200 OK`

```json
{
  "id": 1,
  "activiteType": 1,
  "firstName": "Pierre",
  "lastName": "Dupont",
  "isFuturSoldier": true,
  "phoneNumber": "0123456789",
  "mail": "jean.dupont@email.com",
  "lead_id": 42,
  "hasArrived": true
}
```

---

### 8. **DELETE** `/api/activite-conf/:id`

**Supprimer une confirmation**

#### Path Parameters:

- `id` : ID de la confirmation

#### Exemple:

```
DELETE /api/activite-conf/1
```

#### Response: `204 No Content`

(Aucun contenu retourné)

#### Response: `404 Not Found`

```json
{
  "statusCode": 404,
  "message": "ActiviteConf with ID 999 not found"
}
```

---

## 🔍 Champs de l'entité

| Champ            | Type      | Description                          |
| ---------------- | --------- | ------------------------------------ |
| `id`             | `int`     | ID unique (auto-généré)              |
| `activiteType`   | `bigint`  | Foreign key vers table activite_type |
| `firstName`      | `string`  | Prénom du participant                |
| `lastName`       | `string`  | Nom du participant                   |
| `isFuturSoldier` | `boolean` | Statut futur soldat                  |
| `phoneNumber`    | `string`  | Numéro de téléphone                  |
| `mail`           | `string`  | Adresse email                        |
| `lead_id`        | `int`     | Foreign key vers table leads         |
| `hasArrived`     | `boolean` | Statut d'arrivée                     |

---

## ⚠️ Codes d'erreur

- `400 Bad Request` : Données de validation invalides
- `404 Not Found` : Ressource non trouvée
- `500 Internal Server Error` : Erreur serveur

---

## 📊 Cas d'usage typiques

### Marquer l'arrivée d'un participant

```bash
PUT /api/activite-conf/1
Content-Type: application/json

{
  "hasArrived": true
}
```

### Voir toutes les arrivées pour une activité

```bash
GET /api/activite-conf?activiteType=1&hasArrived=true
```

### Statistiques du jour

```bash
GET /api/activite-conf/statistics
```
