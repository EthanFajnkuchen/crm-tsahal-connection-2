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
    (filters.statutCandidat && filters.statutCandidat !== "all");

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
              filters.dateFrom && `Du ${format(new Date(filters.dateFrom), "dd/MM/yyyy", { locale: fr })}`,
              filters.dateTo && `Au ${format(new Date(filters.dateTo), "dd/MM/yyyy", { locale: fr })}`,
              filters.statutCandidat && filters.statutCandidat !== "all" && STATUS_CANDIDAT.find(s => s.value === filters.statutCandidat)?.displayName,
            ].filter(Boolean).join(" • ")}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex flex-wrap gap-4 p-6 border rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 shadow-sm">
          <div className="space-y-2 flex-1 min-w-[250px]">
            <Label htmlFor="search" className="text-sm font-semibold text-foreground">
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
            <Label htmlFor="dateFrom" className="text-sm font-semibold text-foreground">
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
            <Label htmlFor="dateTo" className="text-sm font-semibold text-foreground">
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
            <Label htmlFor="statut" className="text-sm font-semibold text-foreground">
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
        </div>
      )}
    </div>
  );
}
