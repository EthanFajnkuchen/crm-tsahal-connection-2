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
import { X, Filter } from "lucide-react";
import { MahzorFilters } from "./mahzor-filters.utils";
import { CURRENT_STATUS } from "@/i18n/current-status";
import { TYPE_GIYUS } from "@/i18n/type-giyus";
import { PIKOUD } from "@/i18n/pikoud";

interface MahzorTableFiltersProps {
  filters: MahzorFilters;
  onFiltersChange: (filters: MahzorFilters) => void;
  onClearFilters: () => void;
}

export function MahzorTableFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: MahzorTableFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    filters.search ||
    filters.dateFrom ||
    filters.dateTo ||
    (filters.currentStatus && filters.currentStatus !== "all") ||
    (filters.typeGiyus && filters.typeGiyus !== "all") ||
    (filters.pikoud && filters.pikoud !== "all") ||
    filters.city;

  const activeFiltersCount = [
    filters.search,
    filters.dateFrom,
    filters.dateTo,
    filters.currentStatus && filters.currentStatus !== "all",
    filters.typeGiyus && filters.typeGiyus !== "all",
    filters.pikoud && filters.pikoud !== "all",
    filters.city,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          {isExpanded ? "Masquer les filtres" : "Afficher les filtres"}
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Réinitialiser
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher</Label>
            <Input
              id="search"
              placeholder="Nom, prénom, email..."
              value={filters.search || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFrom">Date Giyus (De)</Label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, dateFrom: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTo">Date Giyus (À)</Label>
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, dateTo: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentStatus">Statut actuel</Label>
            <Select
              value={filters.currentStatus || "all"}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, currentStatus: value })
              }
            >
              <SelectTrigger id="currentStatus">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {CURRENT_STATUS.internal_status.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="typeGiyus">Type Giyus</Label>
            <Select
              value={filters.typeGiyus || "all"}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, typeGiyus: value })
              }
            >
              <SelectTrigger id="typeGiyus">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {TYPE_GIYUS.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pikoud">Pikoud</Label>
            <Select
              value={filters.pikoud || "all"}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, pikoud: value })
              }
            >
              <SelectTrigger id="pikoud">
                <SelectValue placeholder="Tous les pikoud" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les pikoud</SelectItem>
                {PIKOUD.map((pikoud) => (
                  <SelectItem key={pikoud.value} value={pikoud.value}>
                    {pikoud.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              placeholder="Rechercher une ville..."
              value={filters.city || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, city: e.target.value })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
