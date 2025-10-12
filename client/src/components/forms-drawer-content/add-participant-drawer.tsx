import React, { useState, useEffect } from "react";
import { User, UserCheck, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/form-components/phone-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  SideDrawer,
  SideDrawerContent,
  SideDrawerHeader,
  SideDrawerTitle,
  SideDrawerClose,
  SideDrawerAction,
} from "@/components/ui/side-drawer";

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  mail: string;
  phoneNumber: string;
}

interface ApiLead {
  id: number;
  lead_firstName?: string;
  lead_lastName?: string;
  lead_email?: string;
  lead_phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

interface AddParticipantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddParticipant: (participant: {
    firstName: string;
    lastName: string;
    mail: string;
    phoneNumber: string;
    isFuturSoldier: boolean;
    lead_id: number;
  }) => void;
  onSearchLeads: (email: string) => Promise<ApiLead[]>;
  isSearching: boolean;
}

type ParticipantType = "futur-soldat" | "accompagnateur";

export function AddParticipantDrawer({
  isOpen,
  onClose,
  onAddParticipant,
  onSearchLeads,
  isSearching,
}: AddParticipantDrawerProps) {
  const [participantType, setParticipantType] = useState<ParticipantType | "">(
    ""
  );
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [foundLead, setFoundLead] = useState<Lead | null>(null);
  const [isSearchingLead, setIsSearchingLead] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Reset form when drawer opens/closes
  useEffect(() => {
    if (isOpen) {
      setParticipantType("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setFoundLead(null);
      setSearchError("");
      setHasSearched(false);
    }
  }, [isOpen]);

  const handleParticipantTypeChange = (value: string) => {
    setParticipantType(value as ParticipantType);
    setFoundLead(null);
    setSearchError("");
    setHasSearched(false);
  };

  const handleEmailBlur = async () => {
    if (participantType === "futur-soldat" && email.trim()) {
      setIsSearchingLead(true);
      setSearchError("");
      setFoundLead(null);
      setHasSearched(false);

      try {
        const leads = await onSearchLeads(email);
        console.log("Leads found:", leads);
        console.log("Leads length:", leads[0]);
        if (leads.length > 0) {
          const lead = leads[0];
          // Map the lead data with correct field names
          const mappedLead = {
            id: lead.id,
            firstName: lead.lead_firstName || lead.firstName || "",
            lastName: lead.lead_lastName || lead.lastName || "",
            mail: lead.lead_email || lead.email || "",
            phoneNumber: lead.lead_phoneNumber || lead.phoneNumber || "",
          };

          setFoundLead(mappedLead);
          setFirstName(mappedLead.firstName);
          setLastName(mappedLead.lastName);
          setPhoneNumber(mappedLead.phoneNumber);
        } else {
          // No lead found - this is not an error, just no results
          setSearchError("");
        }
      } catch (error) {
        setSearchError("Erreur lors de la recherche du lead");
        console.error("Error searching leads:", error);
      } finally {
        setIsSearchingLead(false);
        setHasSearched(true);
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Reset lead data if email changes
    if (foundLead && newEmail !== email) {
      setFoundLead(null);
      setSearchError("");
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setHasSearched(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (participantType === "accompagnateur") {
      if (!firstName || !lastName || !email || !phoneNumber) {
        setSearchError("Veuillez remplir tous les champs");
        return;
      }
    } else if (participantType === "futur-soldat") {
      if (!email) {
        setSearchError("Veuillez saisir une adresse email");
        return;
      }
      if (!foundLead && (!firstName || !lastName || !phoneNumber)) {
        setSearchError("Veuillez remplir tous les champs");
        return;
      }
    }

    onAddParticipant({
      firstName,
      lastName,
      mail: email,
      phoneNumber,
      isFuturSoldier: participantType === "futur-soldat",
      lead_id: foundLead?.id || 0, // 0 if no lead found
    });

    onClose();
  };

  return (
    <SideDrawer isOpen={isOpen} onClose={onClose}>
      <SideDrawerContent isOpen={isOpen} onClose={onClose}>
        <SideDrawerHeader>
          <SideDrawerTitle>Ajouter un participant</SideDrawerTitle>
          <SideDrawerClose onClose={onClose} />
        </SideDrawerHeader>

        <div className="flex-1 overflow-y-auto">
          <form
            id="add-participant-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Participant Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="participant-type">Type de participant</Label>
              <Select
                value={participantType}
                onValueChange={handleParticipantTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="futur-soldat">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Futur soldat
                    </div>
                  </SelectItem>
                  <SelectItem value="accompagnateur">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Accompagnateur
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {participantType === "accompagnateur" && (
              <>
                {/* Accompagnateur Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">Prénom</Label>
                    <Input
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Prénom"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last-name">Nom</Label>
                    <Input
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nom"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <PhoneInput
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    label="Téléphone"
                    placeholder="Numéro de téléphone"
                  />
                </div>
              </>
            )}

            {participantType === "futur-soldat" && (
              <>
                {/* Futur Soldat Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-search">Adresse Email</Label>
                    <div className="relative">
                      <Input
                        id="email-search"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        placeholder="email@example.com"
                        required
                        className={isSearchingLead ? "pr-10" : ""}
                      />
                      {isSearchingLead && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        </div>
                      )}
                    </div>
                    {isSearchingLead && (
                      <p className="text-sm text-gray-500">
                        Recherche en cours...
                      </p>
                    )}
                  </div>

                  {/* Show results only after search is completed */}
                  {hasSearched && (
                    <>
                      {foundLead && (
                        <Alert>
                          <UserCheck className="h-4 w-4" />
                          <AlertDescription>
                            Cette personne existe déjà dans la base de données.
                          </AlertDescription>
                        </Alert>
                      )}

                      {searchError && (
                        <Alert variant="destructive">
                          <AlertDescription>{searchError}</AlertDescription>
                        </Alert>
                      )}

                      {/* Lead found - show disabled fields */}
                      {foundLead && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="found-first-name">Prénom</Label>
                            <Input
                              id="found-first-name"
                              value={firstName}
                              disabled
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="found-last-name">Nom</Label>
                            <Input
                              id="found-last-name"
                              value={lastName}
                              disabled
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="found-email">Email</Label>
                            <Input id="found-email" value={email} disabled />
                          </div>

                          <PhoneInput
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            label="Téléphone"
                            disabled
                          />
                        </div>
                      )}

                      {/* No lead found - show editable fields */}
                      {!foundLead && (
                        <div className="space-y-4">
                          <Alert>
                            <UserCheck className="h-4 w-4" />
                            <AlertDescription>
                              Aucun lead trouvé avec cette adresse email.
                              Veuillez saisir les informations manquantes.
                            </AlertDescription>
                          </Alert>

                          <div className="space-y-2">
                            <Label htmlFor="new-first-name">Prénom</Label>
                            <Input
                              id="new-first-name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="Prénom"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="new-last-name">Nom</Label>
                            <Input
                              id="new-last-name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Nom"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="new-email">Email</Label>
                            <Input
                              id="new-email"
                              type="email"
                              value={email}
                              disabled
                              className="bg-gray-50"
                            />
                          </div>

                          <PhoneInput
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            label="Téléphone"
                            placeholder="Numéro de téléphone"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </form>
        </div>

        <SideDrawerAction
          buttonContent={isSearching ? "Ajout..." : "Ajouter"}
          onSave={() => {
            const form = document.getElementById(
              "add-participant-form"
            ) as HTMLFormElement;
            if (form) {
              form.requestSubmit();
            }
          }}
          disabled={isSearching}
          isLoading={isSearching}
        />
      </SideDrawerContent>
    </SideDrawer>
  );
}
