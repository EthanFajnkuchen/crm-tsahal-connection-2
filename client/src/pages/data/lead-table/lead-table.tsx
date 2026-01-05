import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Download, Loader2 } from "lucide-react";

import { DataTable } from "@/components/app-components/table/table";
import Section from "@/components/app-components/section/section";
import { Lead } from "@/types/lead";
import { LeadTableFilters } from "./lead-table-filters";
import { ColumnSettings } from "./column-settings";
import {
  createColumnDefinitions,
  ColumnKey,
  AVAILABLE_COLUMNS,
} from "./lead-columns.config.tsx";
import { LeadFilters, hasActiveFilters } from "./lead-filters.utils";

import { RootState, AppDispatch } from "@/store/store";
import { fetchAllLeadsThunk } from "@/store/thunks/data/all-leads.thunk";
import { downloadLeadsThunk } from "@/store/thunks/data/excel.thunk";

const COLUMN_STORAGE_KEY = "lead-table-visible-columns";
const DEFAULT_VISIBLE_COLUMNS: ColumnKey[] = AVAILABLE_COLUMNS.filter(
  (col) => col.defaultVisible
).map((col) => col.key);

export function LeadTable() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isDownloading, setIsDownloading] = useState(false);

  // Récupérer les colonnes visibles depuis localStorage
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(() => {
    const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_VISIBLE_COLUMNS;
  });

  // Récupérer les filtres et la page depuis URL params
  const filters: LeadFilters = useMemo(
    () => ({
      search: searchParams.get("search") || undefined,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
      statutCandidat: searchParams.get("statutCandidat") || undefined,
      firstName: searchParams.get("firstName") || undefined,
      lastName: searchParams.get("lastName") || undefined,
      gender: searchParams.get("gender") || undefined,
      phoneNumber: searchParams.get("phoneNumber") || undefined,
      whatsappNumber: searchParams.get("whatsappNumber") || undefined,
      passportNumber1: searchParams.get("passportNumber1") || undefined,
      expertConnection: searchParams.get("expertConnection") || undefined,
      statutLoiRetour: searchParams.get("statutLoiRetour") || undefined,
      currentStatus: searchParams.get("currentStatus") || undefined,
      city: searchParams.get("city") || undefined,
      soldierAloneStatus: searchParams.get("soldierAloneStatus") || undefined,
      bacObtention: searchParams.get("bacObtention") || undefined,
      dateFinService: searchParams.get("dateFinService") || undefined,
      pikoud: searchParams.get("pikoud") || undefined,
      nomPoste: searchParams.get("nomPoste") || undefined,
      typePoste: searchParams.get("typePoste") || undefined,
      typeGiyus: searchParams.get("typeGiyus") || undefined,
      giyusDate: searchParams.get("giyusDate") || undefined,
      mahzorGiyus: searchParams.get("mahzorGiyus") || undefined,
    }),
    [searchParams]
  );

  const currentPage = useMemo(() => {
    const page = searchParams.get("page");
    // Convertir de base 1 (URL) à base 0 (pageIndex)
    return page ? parseInt(page, 10) - 1 : 0;
  }, [searchParams]);

  const { data, total, isLoading, error } = useSelector(
    (state: RootState) => state.allLeads
  );

  // Charger les données au montage ou quand les filtres/page changent
  useEffect(() => {
    // Créer un objet filtres combiné
    const combinedFilters = hasActiveFilters(filters)
      ? filters
      : undefined;

    dispatch(
      fetchAllLeadsThunk({
        page: currentPage,
        limit: 15,
        filters: combinedFilters,
      })
    );
  }, [dispatch, filters, currentPage]);

  // Les données sont déjà filtrées par le backend, pas besoin de filtrer côté client
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data as Lead[];
  }, [data]);

  // Handler pour rafraîchir les données (optimisé avec useCallback)
  const handleRefresh = useCallback(() => {
    // Créer un objet filtres combiné
    const combinedFilters = hasActiveFilters(filters)
      ? filters
      : undefined;

    dispatch(
      fetchAllLeadsThunk({
        page: currentPage,
        limit: 15,
        filters: combinedFilters,
      })
    );
  }, [dispatch, filters, currentPage]);

  // Créer les colonnes avec useMemo
  const columns = useMemo(
    () =>
      createColumnDefinitions(
        visibleColumns,
        handleRefresh
      ),
    [visibleColumns, handleRefresh]
  );

  // Gérer les changements de filtres
  const handleFiltersChange = useCallback(
    (newFilters: LeadFilters) => {
      const params = new URLSearchParams(searchParams);

      // Mettre à jour les params
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Réinitialiser la page lors d'un changement de filtre
      params.delete("page");

      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // Effacer tous les filtres principaux
  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("statutCandidat");
    params.delete("firstName");
    params.delete("lastName");
    params.delete("gender");
    params.delete("phoneNumber");
    params.delete("whatsappNumber");
    params.delete("passportNumber1");
    params.delete("expertConnection");
    params.delete("statutLoiRetour");
    params.delete("currentStatus");
    params.delete("city");
    params.delete("soldierAloneStatus");
    params.delete("bacObtention");
    params.delete("dateFinService");
    params.delete("pikoud");
    params.delete("nomPoste");
    params.delete("typePoste");
    params.delete("typeGiyus");
    params.delete("giyusDate");
    params.delete("mahzorGiyus");
    params.delete("page");
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // Gérer les changements de colonnes visibles
  const handleColumnsChange = useCallback((newColumns: ColumnKey[]) => {
    setVisibleColumns(newColumns);
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(newColumns));
  }, []);

  // Télécharger Excel
  const handleDownloadExcel = useCallback(async () => {
    try {
      setIsDownloading(true);

      // Créer un objet filtres pour l'export
      const combinedFilters = hasActiveFilters(filters)
        ? filters
        : undefined;

      const result = await dispatch(
        downloadLeadsThunk(combinedFilters)
      ).unwrap();

      const url = window.URL.createObjectURL(result);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur lors du téléchargement du fichier :", err);
    } finally {
      setIsDownloading(false);
    }
  }, [dispatch, filters]);

  // Gérer les changements de page
  const handlePageChange = useCallback(
    (pageIndex: number) => {
      const params = new URLSearchParams(searchParams);
      // Convertir de base 0 (pageIndex) à base 1 (numéro de page pour URL)
      const pageNumber = pageIndex + 1;
      if (pageIndex > 0) {
        params.set("page", pageNumber.toString());
      } else {
        params.delete("page");
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // Naviguer vers les détails d'un lead en gardant les params
  const handleRowClick = useCallback(
    (row: Lead) => {
      navigate(
        `/lead-details/${row.ID}?returnUrl=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`
      );
    },
    [navigate]
  );

  return (
    <div className="p-6 h-full">
      <Section
        title="Liste des leads"
        onAction={handleDownloadExcel}
        actionLoading={isDownloading}
        actionButtonClassName="bg-[#3daa58] hover:bg-green-700 rounded-md"
        actionButtonContent={
          isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Télécharger Excel
            </div>
          )
        }
      >
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <LeadTableFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
            <ColumnSettings
              visibleColumns={visibleColumns}
              onColumnsChange={handleColumnsChange}
            />
          </div>

          <DataTable
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
            error={error}
            onRowClick={handleRowClick}
            initialPage={currentPage}
            onPageChange={handlePageChange}
            pageCount={Math.ceil(total / 15)}
          />
        </div>
      </Section>
    </div>
  );
}
