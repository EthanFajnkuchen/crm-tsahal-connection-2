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
import { API_ROUTES } from "@/constants/api-routes";

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
  const activeTab = searchParams.get("tab") || "tab1";

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
  
  // Onglet 1 : Statut candidat = "Ne répond pas / Ne sait pas"
  const tab1Leads = useMemo(() => {
    const categoryFiltered = allLeads.filter(
      (lead: Lead) => lead.statutCandidat === "Ne répond pas / Ne sait pas"
    );
    return filterMahzorLeads(categoryFiltered, filters);
  }, [allLeads, filters]);

  // Onglet 2 : Situation actuelle = "Abandon pendant le service"
  const tab2Leads = useMemo(() => {
    const categoryFiltered = allLeads.filter(
      (lead: Lead) => lead.currentStatus === "Abandon pendant le service"
    );
    return filterMahzorLeads(categoryFiltered, filters);
  }, [allLeads, filters]);

  // Onglet 3 : Statut candidat = "En cours de traitement" OU "Dossier traité"
  const tab3Leads = useMemo(() => {
    const categoryFiltered = allLeads.filter((lead: Lead) =>
      ["En cours de traitement", "Dossier traité"].includes(lead.statutCandidat)
    );
    return filterMahzorLeads(categoryFiltered, filters);
  }, [allLeads, filters]);

  // Onglet 4 : Situation actuelle = "Un soldat - Michve Alon"
  const tab4Leads = useMemo(() => {
    const categoryFiltered = allLeads.filter(
      (lead: Lead) => lead.currentStatus === "Un soldat - Michve Alon"
    );
    return filterMahzorLeads(categoryFiltered, filters);
  }, [allLeads, filters]);

  // Onglet 5 : Autres (tout ce qui n'est pas dans les 4 premiers cas)
  const tab5Leads = useMemo(() => {
    const categoryFiltered = allLeads.filter((lead: Lead) => {
      // Exclure les leads des 4 premiers onglets
      const isTab1 = lead.statutCandidat === "Ne répond pas / Ne sait pas";
      const isTab2 = lead.currentStatus === "Abandon pendant le service";
      const isTab3 = ["En cours de traitement", "Dossier traité"].includes(
        lead.statutCandidat
      );
      const isTab4 = lead.currentStatus === "Un soldat - Michve Alon";

      return !isTab1 && !isTab2 && !isTab3 && !isTab4;
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

  // Export Excel
  const handleDownloadExcel = useCallback(async () => {
    try {
      setIsDownloading(true);

      if (!mahzorKey) {
        alert("Erreur : Mahzor Giyus non trouvé");
        return;
      }

      const decodedKey = decodeURIComponent(mahzorKey);

      // Parser le mahzorKey pour extraire mahzorGiyus et typeGiyus
      // Format attendu: "Mars 2026 - Olim / Mahal Hesder" ou "Mars 2026 - Mahal Nahal / Mahal Haredi"
      const parts = decodedKey.split(' - ');
      let mahzorGiyusValue = '';
      let typeGiyusValue = '';
      
      if (parts.length === 2) {
        mahzorGiyusValue = parts[0].trim(); // "Mars 2026"
        const typePart = parts[1].trim(); // "Olim / Mahal Hesder" ou "Mahal Nahal / Mahal Haredi"
        
        // Convertir le format affiché vers le format stocké en DB
        if (typePart === 'Olim / Mahal Hesder') {
          typeGiyusValue = 'Olim/Hesder';
        } else if (typePart === 'Mahal Nahal / Mahal Haredi') {
          typeGiyusValue = 'Mahal Nahal / Mahal Haredi';
        }
      }

      // Construire les filtres selon l'onglet actif
      const exportFilters: Record<string, string> = {};
      
      if (mahzorGiyusValue) {
        exportFilters.mahzorGiyus = mahzorGiyusValue;
      }
      if (typeGiyusValue) {
        exportFilters.typeGiyus = typeGiyusValue;
      }

      // Ajouter les filtres selon l'onglet actif
      switch (activeTab) {
        case "tab1":
          exportFilters.statutCandidat = "Ne répond pas / Ne sait pas";
          break;
        case "tab2":
          exportFilters.currentStatus = "Abandon pendant le service";
          break;
        case "tab3":
          // Pour tab3, on doit filtrer par plusieurs statuts candidat
          // On va utiliser une approche différente côté backend
          exportFilters.statutCandidat = "En cours de traitement,Dossier traité";
          break;
        case "tab4":
          exportFilters.currentStatus = "Un soldat - Michve Alon";
          break;
        case "tab5":
          // Pour tab5 (Autres), on doit exclure les autres cas
          // On va utiliser une approche différente côté backend
          exportFilters.excludeTab1 = "true";
          exportFilters.excludeTab2 = "true";
          exportFilters.excludeTab3 = "true";
          exportFilters.excludeTab4 = "true";
          break;
      }

      // Ajouter les filtres utilisateur
      if (filters.search) exportFilters.search = filters.search;
      if (filters.dateFrom) exportFilters.dateFrom = filters.dateFrom;
      if (filters.dateTo) exportFilters.dateTo = filters.dateTo;
      if (filters.currentStatus && activeTab !== "tab2" && activeTab !== "tab4") {
        exportFilters.currentStatus = filters.currentStatus;
      }
      if (filters.typeGiyus) exportFilters.typeGiyus = filters.typeGiyus;
      if (filters.pikoud) exportFilters.pikoud = filters.pikoud;
      if (filters.city) exportFilters.city = filters.city;

      // Construire l'URL avec les query params
      const queryParams = new URLSearchParams();
      Object.entries(exportFilters).forEach(([key, value]) => {
        if (value && value !== "all") {
          queryParams.append(key, value);
        }
      });

      const url = `${API_ROUTES.DOWNLOAD_LEADS}?${queryParams.toString()}`;
      const M2M_TOKEN = import.meta.env.VITE_API_M2M_TOKEN;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${M2M_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download leads");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      
      // Créer un nom de fichier descriptif
      const tabNames: Record<string, string> = {
        tab1: "ne-repond-pas",
        tab2: "abandon-pendant-service",
        tab3: "en-cours-dossier-traite",
        tab4: "michve-alon",
        tab5: "autres",
      };
      const tabName = tabNames[activeTab] || activeTab;
      const fileName = `mahzor-giyus-${decodedKey.replace(/\s+/g, "-").replace(/\//g, "-")}-${tabName}.xlsx`;
      
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Erreur lors du téléchargement du fichier :", err);
      alert("Erreur lors du téléchargement du fichier Excel");
    } finally {
      setIsDownloading(false);
    }
  }, [mahzorKey, activeTab, filters]);

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
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex w-full min-w-max sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 h-auto">
              <TabsTrigger 
                value="tab1" 
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-1.5 sm:py-2 whitespace-nowrap"
              >
                <span className="hidden sm:inline">Ne répond pas / Ne sait pas</span>
                <span className="sm:hidden">Ne répond pas</span>
                <span className="ml-1">({tab1Leads.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tab2" 
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-1.5 sm:py-2 whitespace-nowrap"
              >
                <span className="hidden sm:inline">Abandon pendant le service</span>
                <span className="sm:hidden">Abandon</span>
                <span className="ml-1">({tab2Leads.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tab3" 
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-1.5 sm:py-2 whitespace-nowrap"
              >
                <span className="hidden sm:inline">En cours / Dossier traité</span>
                <span className="sm:hidden">En cours</span>
                <span className="ml-1">({tab3Leads.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tab4" 
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-1.5 sm:py-2 whitespace-nowrap"
              >
                <span className="hidden sm:inline">Un soldat - Michve Alon</span>
                <span className="sm:hidden">Michve Alon</span>
                <span className="ml-1">({tab4Leads.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tab5" 
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-1.5 sm:py-2 whitespace-nowrap"
              >
                Autres <span className="ml-1">({tab5Leads.length})</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tab1" className="mt-4">
            <InfiniteScrollTable
              columns={columns}
              data={tab1Leads}
              isLoading={false}
              error={null}
              onRowClick={handleRowClick}
            />
          </TabsContent>

          <TabsContent value="tab2" className="mt-4">
            <InfiniteScrollTable
              columns={columns}
              data={tab2Leads}
              isLoading={false}
              error={null}
              onRowClick={handleRowClick}
            />
          </TabsContent>

          <TabsContent value="tab3" className="mt-4">
            <InfiniteScrollTable
              columns={columns}
              data={tab3Leads}
              isLoading={false}
              error={null}
              onRowClick={handleRowClick}
            />
          </TabsContent>

          <TabsContent value="tab4" className="mt-4">
            <InfiniteScrollTable
              columns={columns}
              data={tab4Leads}
              isLoading={false}
              error={null}
              onRowClick={handleRowClick}
            />
          </TabsContent>

          <TabsContent value="tab5" className="mt-4">
            <InfiniteScrollTable
              columns={columns}
              data={tab5Leads}
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
