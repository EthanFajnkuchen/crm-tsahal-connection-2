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
import { LeadFilters } from "./lead-filters.utils";
import { STATUS_CANDIDAT } from "@/i18n/status-candidat";

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
    (filters.statutCandidat && filters.statutCandidat !== "all");

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
              {[
                filters.search,
                filters.dateFrom,
                filters.dateTo,
                filters.statutCandidat && filters.statutCandidat !== "all",
              ].filter(Boolean).length}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher (Nom/Prénom)</Label>
            <Input
              id="search"
              placeholder="Ex: Dupont Jean"
              value={filters.search || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFrom">Date inscription (De)</Label>
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
            <Label htmlFor="dateTo">Date inscription (À)</Label>
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
            <Label htmlFor="statut">Statut du candidat</Label>
            <Select
              value={filters.statutCandidat || "all"}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, statutCandidat: value })
              }
            >
              <SelectTrigger id="statut">
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
        </div>
      )}
    </div>
  );
}
