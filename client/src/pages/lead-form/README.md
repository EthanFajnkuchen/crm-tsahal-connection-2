# Lead Form - Formulaire Multi-Étapes

Ce formulaire multi-étapes permet aux utilisateurs de remplir leurs informations pour l'API lead. Il est construit avec React Hook Form et utilise les composants existants du projet.

## Structure

### Étapes du formulaire

1. **Général** - Informations personnelles et contact d'urgence
2. **Judaïsme & Nationalité** - (À implémenter)
3. **Éducation** - (À implémenter)
4. **Intégration Israël** - (À implémenter)
5. **Tsahal** - (À implémenter)

### Section Générale (Étape 1)

#### Informations personnelles

- Prénom(s) \*
- Nom(s) de famille \*
- Date de naissance \*
- Genre \* (Masculin/Féminin)
- Email \*
- Confirmez votre email \*
- Téléphone mobile \*
- Confirmez votre numéro \*
- WhatsApp (avec option "même numéro que le téléphone")
- Numéro WhatsApp \*
- Confirmez votre numéro WhatsApp \*
- Ville de résidence \*
- Êtes-vous enfant unique ? \*

#### Contact d'urgence

- Prénom(s) \*
- Nom(s) de famille \*
- Téléphone mobile \*
- Confirmez votre numéro \*
- Email \*
- Confirmez votre email \*
- Lien \* (relation avec le contact)

## Utilisation

```tsx
import { LeadForm } from "@/pages/lead-form";

// Dans votre composant
<LeadForm />;
```

## Fonctionnalités

- ✅ Navigation entre les étapes
- ✅ Validation des champs requis
- ✅ Barre de progression
- ✅ Interface responsive
- ✅ Utilisation des composants existants (FormInput, FormDropdown, etc.)
- ✅ Gestion des numéros de téléphone avec codes pays
- ✅ Validation des emails
- ✅ Confirmation des champs sensibles (email, téléphone)

## À implémenter

- [ ] Validation personnalisée avancée
- [ ] Sauvegarde automatique des données
- [ ] Intégration avec l'API
- [ ] Autres étapes du formulaire
- [ ] Gestion des erreurs serveur
- [ ] Tests unitaires

## Composants utilisés

- `FormInput` - Champs de saisie texte
- `FormDropdown` - Listes déroulantes
- `FormDatePicker` - Sélecteur de date
- `FormCheckbox` - Cases à cocher
- `PhoneInput` - Saisie de numéros de téléphone avec codes pays
