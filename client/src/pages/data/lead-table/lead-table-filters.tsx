import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Filter, CalendarIcon } from "lucide-react";
import { LeadFilters } from "./lead-filters.utils";
import { STATUS_CANDIDAT } from "@/i18n/status-candidat";
import { JUDAISM } from "@/i18n/judaism";
import { CURRENT_STATUS } from "@/i18n/current-status";
import { TYPE_GIYUS } from "@/i18n/type-giyus";
import { TYPE_POSTE } from "@/i18n/type-poste";
import { PIKOUD } from "@/i18n/pikoud";
import { EDUCATION } from "@/i18n/education";
import { MILITARY } from "@/i18n/military";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface LeadTableFiltersProps {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  onClearFilters: () => void;
}

export function LeadTableFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: LeadTableFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    filters.search ||
    filters.dateFrom ||
    filters.dateTo ||
    (filters.statutCandidat && filters.statutCandidat !== "all") ||
    filters.firstName ||
    filters.lastName ||
    filters.gender ||
    filters.phoneNumber ||
    filters.whatsappNumber ||
    filters.passportNumber1 ||
    filters.expertConnection ||
    filters.statutLoiRetour ||
    filters.currentStatus ||
    filters.city ||
    filters.soldierAloneStatus ||
    filters.bacObtention ||
    filters.dateFinService ||
    filters.pikoud ||
    filters.nomPoste ||
    filters.typePoste ||
    filters.typeGiyus ||
    filters.giyusDate ||
    filters.mahzorGiyus;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <Filter className="h-4 w-4" />
            {isExpanded ? "Masquer les filtres" : "Afficher les filtres"}
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full font-medium">
                {
                  [
                    filters.search,
                    filters.dateFrom,
                    filters.dateTo,
                    filters.statutCandidat && filters.statutCandidat !== "all",
                    filters.firstName,
                    filters.lastName,
                    filters.gender,
                    filters.phoneNumber,
                    filters.whatsappNumber,
                    filters.passportNumber1,
                    filters.expertConnection,
                    filters.statutLoiRetour,
                    filters.currentStatus,
                    filters.city,
                    filters.soldierAloneStatus,
                    filters.bacObtention,
                    filters.dateFinService,
                    filters.pikoud,
                    filters.nomPoste,
                    filters.typePoste,
                    filters.typeGiyus,
                    filters.giyusDate,
                    filters.mahzorGiyus,
                  ].filter(Boolean).length
                }
              </span>
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 shadow-sm"
            >
              <X className="h-4 w-4" />
              Réinitialiser
            </Button>
          )}
        </div>
        {hasActiveFilters && (
          <div className="text-sm text-muted-foreground hidden lg:block">
            {[
              filters.search && `"${filters.search}"`,
              filters.dateFrom &&
                `Du ${format(new Date(filters.dateFrom), "dd/MM/yyyy", {
                  locale: fr,
                })}`,
              filters.dateTo &&
                `Au ${format(new Date(filters.dateTo), "dd/MM/yyyy", {
                  locale: fr,
                })}`,
              filters.statutCandidat &&
                filters.statutCandidat !== "all" &&
                STATUS_CANDIDAT.find((s) => s.value === filters.statutCandidat)
                  ?.displayName,
            ]
              .filter(Boolean)
              .join(" • ")}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex flex-wrap gap-4 p-6 border rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 shadow-sm">
          <div className="space-y-2 flex-1 min-w-[250px]">
            <Label
              htmlFor="search"
              className="text-sm font-semibold text-foreground"
            >
              Rechercher
            </Label>
            <Input
              id="search"
              placeholder="Nom, prénom ou email..."
              value={filters.search || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              className="shadow-sm"
            />
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="dateFrom"
              className="text-sm font-semibold text-foreground"
            >
              Date inscription (De)
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dateFrom"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal shadow-sm hover:shadow-md transition-shadow",
                    !filters.dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  {filters.dateFrom ? (
                    <span className="font-medium">
                      {format(new Date(filters.dateFrom), "dd/MM/yyyy", {
                        locale: fr,
                      })}
                    </span>
                  ) : (
                    <span>Sélectionner...</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    filters.dateFrom ? new Date(filters.dateFrom) : undefined
                  }
                  onSelect={(date) =>
                    onFiltersChange({
                      ...filters,
                      dateFrom: date ? format(date, "yyyy-MM-dd") : undefined,
                    })
                  }
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="dateTo"
              className="text-sm font-semibold text-foreground"
            >
              Date inscription (À)
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dateTo"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal shadow-sm hover:shadow-md transition-shadow",
                    !filters.dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  {filters.dateTo ? (
                    <span className="font-medium">
                      {format(new Date(filters.dateTo), "dd/MM/yyyy", {
                        locale: fr,
                      })}
                    </span>
                  ) : (
                    <span>Sélectionner...</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    filters.dateTo ? new Date(filters.dateTo) : undefined
                  }
                  onSelect={(date) =>
                    onFiltersChange({
                      ...filters,
                      dateTo: date ? format(date, "yyyy-MM-dd") : undefined,
                    })
                  }
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 flex-1 min-w-[250px]">
            <Label
              htmlFor="statut"
              className="text-sm font-semibold text-foreground"
            >
              Statut du candidat
            </Label>
            <Select
              value={filters.statutCandidat || "all"}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, statutCandidat: value })
              }
            >
              <SelectTrigger id="statut" className="shadow-sm">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {STATUS_CANDIDAT.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="firstName"
              className="text-sm font-semibold text-foreground"
            >
              Prénom
            </Label>
            <Input
              id="firstName"
              placeholder="Prénom..."
              value={filters.firstName || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, firstName: e.target.value })
              }
              className="shadow-sm"
            />
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="lastName"
              className="text-sm font-semibold text-foreground"
            >
              Nom
            </Label>
            <Input
              id="lastName"
              placeholder="Nom..."
              value={filters.lastName || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, lastName: e.target.value })
              }
              className="shadow-sm"
            />
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="gender"
              className="text-sm font-semibold text-foreground"
            >
              Genre
            </Label>
            <Select
              value={filters.gender || "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  gender: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger id="gender" className="shadow-sm">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Masculin">Masculin</SelectItem>
                <SelectItem value="Féminin">Féminin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="phoneNumber"
              className="text-sm font-semibold text-foreground"
            >
              Téléphone
            </Label>
            <Input
              id="phoneNumber"
              placeholder="Numéro de téléphone..."
              value={filters.phoneNumber || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, phoneNumber: e.target.value })
              }
              className="shadow-sm"
            />
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="whatsappNumber"
              className="text-sm font-semibold text-foreground"
            >
              WhatsApp
            </Label>
            <Input
              id="whatsappNumber"
              placeholder="Numéro WhatsApp..."
              value={filters.whatsappNumber || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, whatsappNumber: e.target.value })
              }
              className="shadow-sm"
            />
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="passportNumber"
              className="text-sm font-semibold text-foreground"
            >
              Passeport
            </Label>
            <Input
              id="passportNumber"
              placeholder="Numéro de passeport..."
              value={filters.passportNumber1 || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, passportNumber1: e.target.value })
              }
              className="shadow-sm"
            />
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="expertConnection"
              className="text-sm font-semibold text-foreground"
            >
              Expert Connection
            </Label>
            <Select
              value={filters.expertConnection || "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  expertConnection: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger id="expertConnection" className="shadow-sm">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Oui">Oui</SelectItem>
                <SelectItem value="Non">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="statutLoiRetour"
              className="text-sm font-semibold text-foreground"
            >
              Statut Loi de Retour
            </Label>
            <Select
              value={filters.statutLoiRetour || "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  statutLoiRetour: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger id="statutLoiRetour" className="shadow-sm">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {JUDAISM.status_return_law.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="situationActuelle"
              className="text-sm font-semibold text-foreground"
            >
              Situation Actuelle
            </Label>
            <Select
              value={filters.currentStatus || "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  currentStatus: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger id="situationActuelle" className="shadow-sm">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {CURRENT_STATUS.all_status.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="city"
              className="text-sm font-semibold text-foreground"
            >
              Ville
            </Label>
            <Input
              id="city"
              placeholder="Filtrer par ville..."
              value={filters.city || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, city: e.target.value })
              }
              className="shadow-sm"
            />
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="mahzorGiyus"
              className="text-sm font-semibold text-foreground"
            >
              Mahzor Giyus
            </Label>
            <Input
              id="mahzorGiyus"
              placeholder="Filtrer par mahzor..."
              value={filters.mahzorGiyus || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, mahzorGiyus: e.target.value })
              }
              className="shadow-sm"
            />
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="giyusDate"
              className="text-sm font-semibold text-foreground"
            >
              Date de Giyus
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal shadow-sm",
                    !filters.giyusDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.giyusDate ? (
                    format(new Date(filters.giyusDate), "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    filters.giyusDate ? new Date(filters.giyusDate) : undefined
                  }
                  onSelect={(date) => {
                    onFiltersChange({
                      ...filters,
                      giyusDate: date
                        ? format(date, "yyyy-MM-dd")
                        : undefined,
                    });
                  }}
                  locale={fr}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="typeGiyus"
              className="text-sm font-semibold text-foreground"
            >
              Type de Giyus
            </Label>
            <Select
              value={filters.typeGiyus || "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  typeGiyus: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger id="typeGiyus" className="shadow-sm">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {TYPE_GIYUS.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="pikoud"
              className="text-sm font-semibold text-foreground"
            >
              Pikoud
            </Label>
            <Select
              value={filters.pikoud || "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  pikoud: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger id="pikoud" className="shadow-sm">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {PIKOUD.map((pikoud) => (
                  <SelectItem key={pikoud.value} value={pikoud.value}>
                    {pikoud.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="typePoste"
              className="text-sm font-semibold text-foreground"
            >
              Type de Poste
            </Label>
            <Select
              value={filters.typePoste || "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  typePoste: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger id="typePoste" className="shadow-sm">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {TYPE_POSTE.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="nomPoste"
              className="text-sm font-semibold text-foreground"
            >
              Nom du Poste
            </Label>
            <Input
              id="nomPoste"
              placeholder="Filtrer par nom du poste..."
              value={filters.nomPoste || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, nomPoste: e.target.value })
              }
              className="shadow-sm"
            />
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="dateFinService"
              className="text-sm font-semibold text-foreground"
            >
              Date de Fin de Service
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal shadow-sm",
                    !filters.dateFinService && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFinService ? (
                    format(new Date(filters.dateFinService), "PPP", {
                      locale: fr,
                    })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    filters.dateFinService
                      ? new Date(filters.dateFinService)
                      : undefined
                  }
                  onSelect={(date) => {
                    onFiltersChange({
                      ...filters,
                      dateFinService: date
                        ? format(date, "yyyy-MM-dd")
                        : undefined,
                    });
                  }}
                  locale={fr}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="bacObtention"
              className="text-sm font-semibold text-foreground"
            >
              Obtention du Bac
            </Label>
            <Select
              value={filters.bacObtention || "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  bacObtention: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger id="bacObtention" className="shadow-sm">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {EDUCATION.has_bac.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label
              htmlFor="soldierAloneStatus"
              className="text-sm font-semibold text-foreground"
            >
              Soldat Seul
            </Label>
            <Select
              value={filters.soldierAloneStatus || "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  soldierAloneStatus: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger id="soldierAloneStatus" className="shadow-sm">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {MILITARY.is_lone_solider.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
