import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "@/store/store";
import { fetchMahzorGiyusCountsThunk } from "@/store/thunks/mahzor-giyus/mahzor-giyus.thunk";
import { InfiniteScrollTable } from "./infinite-scroll-table";
import {
  createMahzorColumnDefinitions,
  MahzorColumnKey,
  AVAILABLE_MAHZOR_COLUMNS,
} from "./mahzor-columns.config";
import { filterMahzorLeads, MahzorFilters } from "./mahzor-filters.utils";
import { MahzorTableFilters } from "./mahzor-table-filters";
import { MahzorColumnSettings } from "./mahzor-column-settings";
import Section from "@/components/app-components/section/section";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lead } from "@/types/lead";

const COLUMN_STORAGE_KEY = "mahzor-table-visible-columns";
const DEFAULT_VISIBLE_COLUMNS: MahzorColumnKey[] =
  AVAILABLE_MAHZOR_COLUMNS.filter((col) => col.defaultVisible).map(
    (col) => col.key
  );

const MahzorGiyusDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { mahzorKey } = useParams<{ mahzorKey: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDownloading, setIsDownloading] = useState(false);

  // Récupérer l'onglet actif depuis l'URL
  const activeTab = searchParams.get("tab") || "no-response";

  // Récupérer les colonnes visibles depuis localStorage
  const [visibleColumns, setVisibleColumns] = useState<MahzorColumnKey[]>(
    () => {
      const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_VISIBLE_COLUMNS;
    }
  );

  // Récupérer les filtres depuis URL params
  const filters: MahzorFilters = useMemo(
    () => ({
      search: searchParams.get("search") || undefined,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
      currentStatus: searchParams.get("currentStatus") || undefined,
      typeGiyus: searchParams.get("typeGiyus") || undefined,
      pikoud: searchParams.get("pikoud") || undefined,
      city: searchParams.get("city") || undefined,
    }),
    [searchParams]
  );

  const { data, isLoading, error } = useSelector(
    (state: RootState) => state.mahzorGiyus
  );

  useEffect(() => {
    if (!data) {
      dispatch(fetchMahzorGiyusCountsThunk());
    }
  }, [dispatch, data]);

  // Récupérer tous les leads du mahzor
  const allLeads = useMemo(() => {
    if (!data || !mahzorKey) return [];
    const decodedKey = decodeURIComponent(mahzorKey);

    for (const yearData of Object.values(data)) {
      if (yearData[decodedKey]) {
        return yearData[decodedKey].leads || [];
      }
    }
    return [];
  }, [data, mahzorKey]);

  // Filtrer les leads par catégorie ET appliquer les filtres utilisateur
  const noResponseLeads = useMemo(() => {
    const categoryFiltered = allLeads.filter(
      (lead: Lead) => lead.statutCandidat === "Ne répond pas / Ne sait pas"
    );
    return filterMahzorLeads(categoryFiltered, filters);
  }, [allLeads, filters]);

  const abandonDuringServiceLeads = useMemo(() => {
    const categoryFiltered = allLeads.filter(
      (lead: Lead) => lead.statutCandidat === "Abandon pendant le service"
    );
    return filterMahzorLeads(categoryFiltered, filters);
  }, [allLeads, filters]);

  const activeServiceLeads = useMemo(() => {
    const categoryFiltered = allLeads.filter((lead: Lead) => {
      const validStatutCandidat = [
        "En cours de traitement",
        "Dossier traité",
      ].includes(lead.statutCandidat);

      const validCurrentStatus = [
        "Un soldat - Michve Alon",
        "Un soldat - unité",
        "Un soldat libéré",
      ].includes(lead.currentStatus);

      return validStatutCandidat && validCurrentStatus;
    });
    return filterMahzorLeads(categoryFiltered, filters);
  }, [allLeads, filters]);

  // Gérer les changements de filtres
  const handleFiltersChange = useCallback(
    (newFilters: MahzorFilters) => {
      const params = new URLSearchParams(searchParams);

      // Mettre à jour les params
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // Effacer tous les filtres
  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("currentStatus");
    params.delete("typeGiyus");
    params.delete("pikoud");
    params.delete("city");
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // Gérer les changements de colonnes visibles
  const handleColumnsChange = useCallback((newColumns: MahzorColumnKey[]) => {
    setVisibleColumns(newColumns);
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(newColumns));
  }, []);

  // Changer d'onglet
  const handleTabChange = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", tab);
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // Export Excel - fonction factice pour l'instant
  const handleDownloadExcel = useCallback(async () => {
    setIsDownloading(true);
    // TODO: Implémenter l'export Excel
    setTimeout(() => {
      alert("Export Excel à implémenter côté backend");
      setIsDownloading(false);
    }, 1000);
  }, []);

  const handleRowClick = useCallback(
    (lead: Lead) => {
      if (lead.ID) {
        navigate(
          `/lead-details/${lead.ID}?returnUrl=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`
        );
      }
    },
    [navigate]
  );

  const handleBack = () => {
    navigate("/mahzor-giyus");
  };

  // Créer les colonnes avec useMemo
  const columns = useMemo(
    () => createMahzorColumnDefinitions(visibleColumns),
    [visibleColumns]
  );

  if (isLoading) {
    return (
      <Section title="Chargement...">
        <div>Chargement des données...</div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section title="Erreur">
        <div>Une erreur est survenue lors du chargement des données.</div>
      </Section>
    );
  }

  const decodedKey = mahzorKey ? decodeURIComponent(mahzorKey) : "";

  return (
    <Section
      title={decodedKey || "Détails Mahzor Giyus"}
      onAction={handleDownloadExcel}
      actionLoading={isDownloading}
      actionButtonClassName="bg-[#3daa58] hover:bg-green-700 rounded-md"
      actionButtonContent={
        isDownloading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Excel
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>

        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <MahzorTableFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
          <MahzorColumnSettings
            visibleColumns={visibleColumns}
            onColumnsChange={handleColumnsChange}
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="no-response">
              Ne répond pas / Ne sait pas ({noResponseLeads.length})
            </TabsTrigger>
            <TabsTrigger value="abandon">
              Abandon pendant le service ({abandonDuringServiceLeads.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              En service / Libéré ({activeServiceLeads.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="no-response" className="mt-4">
            <InfiniteScrollTable
              columns={columns}
              data={noResponseLeads}
              isLoading={false}
              error={null}
              onRowClick={handleRowClick}
            />
          </TabsContent>

          <TabsContent value="abandon" className="mt-4">
            <InfiniteScrollTable
              columns={columns}
              data={abandonDuringServiceLeads}
              isLoading={false}
              error={null}
              onRowClick={handleRowClick}
            />
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <InfiniteScrollTable
              columns={columns}
              data={activeServiceLeads}
              isLoading={false}
              error={null}
              onRowClick={handleRowClick}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Section>
  );
};

export default MahzorGiyusDetails;
