import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, CheckCircle, XCircle, Plus } from "lucide-react";

import { DataTable } from "@/components/app-components/table/table";
import Section from "@/components/app-components/section/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { ColumnDef } from "@tanstack/react-table";
import { ActiviteConf } from "@/store/adapters/activite-conf/activite-conf.adapter";

import { RootState, AppDispatch } from "@/store/store";
import {
  getActiviteConfByActivityTypeThunk,
  updateActiviteConfThunk,
  createActiviteConfThunk,
} from "@/store/thunks/activite-conf/activite-conf.thunk";
import { getActivitiesThunk } from "@/store/thunks/activity/activity.thunk";
import { searchLeadByEmailThunk } from "@/store/thunks/lead/search-lead-by-email.thunk";
import { AddParticipantDrawer } from "@/components/forms-drawer-content/add-participant-drawer";

// Colonnes pour les activités Salon/Conférence
const activiteConfColumns: ColumnDef<ActiviteConf>[] = [
  {
    accessorKey: "fullName",
    header: "Nom complet",
    cell: ({ row }) => {
      const activiteConf = row.original;
      return (
        <div className="font-medium">
          {activiteConf.firstName} {activiteConf.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "isFuturSoldier",
    header: "Statut",
    cell: ({ row }) => {
      const isFuturSoldier = row.getValue("isFuturSoldier") as boolean;
      return (
        <Badge variant={isFuturSoldier ? "default" : "secondary"}>
          {isFuturSoldier ? "Futur Soldat" : "Accompagnant"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Téléphone",
    cell: ({ row }) => {
      const phoneNumber = row.getValue("phoneNumber") as string;
      return <div>{phoneNumber}</div>;
    },
  },
  {
    accessorKey: "mail",
    header: "Email",
    cell: ({ row }) => {
      const mail = row.getValue("mail") as string;
      return <div>{mail}</div>;
    },
  },
  {
    id: "hasArrived",
    accessorKey: "hasArrived",
    header: "Confirmation de venue",
    cell: ({ row }) => {
      const activiteConf = row.original;
      const hasArrived = activiteConf.hasArrived;

      return (
        <div className="flex items-center gap-2">
          {hasArrived ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              Présent
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
              <XCircle className="mr-1 h-3 w-3" />
              Non confirmé
            </Badge>
          )}
        </div>
      );
    },
  },
];

export default function SalonActivityDetails() {
  const { idActivite } = useParams<{ idActivite: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { activiteConfs, isLoading, error, isCreating } = useSelector(
    (state: RootState) => state.activiteConf
  );

  const { activities } = useSelector((state: RootState) => state.activity);
  const { isLoading: isSearchingLeads } = useSelector(
    (state: RootState) => state.searchLeads
  );

  // Déterminer le type d'activité depuis le state de navigation
  const activityName = location.state?.activityName || "";

  useEffect(() => {
    // Load activities if not already loaded
    if (activities.length === 0) {
      dispatch(getActivitiesThunk());
    }

    if (idActivite) {
      const activityId = parseInt(idActivite, 10);
      if (!isNaN(activityId)) {
        // Charger les conférences pour les activités Salon/Conférence
        dispatch(getActiviteConfByActivityTypeThunk(activityId));
      }
    }
  }, [dispatch, idActivite, activities.length]);

  const handleRowClick = async (data: ActiviteConf) => {
    // Gérer les clics pour les activités Salon/Conférence
    const updatedStatus = !data.hasArrived;
    try {
      await dispatch(
        updateActiviteConfThunk({
          id: data.id,
          updates: { hasArrived: updatedStatus },
        })
      ).unwrap();
      // Recharger les données après modification
      if (idActivite) {
        const activityId = parseInt(idActivite, 10);
        if (!isNaN(activityId)) {
          dispatch(getActiviteConfByActivityTypeThunk(activityId));
        }
      }
    } catch (error) {
      console.error("Failed to update participant status:", error);
    }
  };

  const handleGoBack = () => {
    navigate("/activities");
  };

  const handleAddParticipant = async (participant: {
    firstName: string;
    lastName: string;
    mail: string;
    phoneNumber: string;
    isFuturSoldier: boolean;
    lead_id: number;
  }) => {
    if (!idActivite) return;

    const activityId = parseInt(idActivite, 10);
    if (isNaN(activityId)) return;

    try {
      await dispatch(
        createActiviteConfThunk({
          activiteType: activityId,
          firstName: participant.firstName,
          lastName: participant.lastName,
          mail: participant.mail,
          phoneNumber: participant.phoneNumber,
          isFuturSoldier: participant.isFuturSoldier,
          lead_id: participant.lead_id,
        })
      ).unwrap();
      // Recharger les données après ajout
      dispatch(getActiviteConfByActivityTypeThunk(activityId));
    } catch (error) {
      console.error("Failed to add participant:", error);
    }
  };

  const handleSearchLeads = async (email: string) => {
    const result = await dispatch(searchLeadByEmailThunk(email));
    return (result.payload as any[]) || [];
  };

  // Find the current activity details
  const currentActivity = activities.find(
    (activity) => activity.id === parseInt(idActivite || "0", 10)
  );

  if (error) {
    return (
      <Section title="Détails de l'activité">
        <div className="p-4 text-center text-red-500">
          Erreur lors du chargement des participants: {error}
        </div>
      </Section>
    );
  }

  // Filtrer les participants selon le terme de recherche
  const filteredParticipants = activiteConfs.filter((conf) => {
    if (!searchTerm) return true;
    const fullName = `${conf.firstName} ${conf.lastName}`.toLowerCase();
    const email = conf.mail.toLowerCase();
    const phone = conf.phoneNumber.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      phone.includes(searchLower)
    );
  });

  // Calculer les statistiques
  const totalParticipants = activiteConfs.length;
  const presentCount = activiteConfs.filter((conf) => conf.hasArrived).length;
  const absentCount = totalParticipants - presentCount;

  return (
    <Section
      title={`Détails de l'activité ${
        activityName || (currentActivity ? currentActivity.name : "")
      }`}
    >
      <div className="space-y-4">
        {/* Header with back button and activity info */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux activités
          </Button>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un participant
            </Button>

            {currentActivity && (
              <div className="text-right">
                <h2 className="text-lg font-semibold">
                  {activityName || currentActivity.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {new Date(currentActivity.date).toLocaleDateString("fr-FR")} -{" "}
                  {currentActivity.category}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {totalParticipants}
            </div>
            <div className="text-sm text-blue-800">Total participants</div>
            <div className="text-xs text-blue-600 mt-1">
              {activiteConfs.filter((conf) => conf.isFuturSoldier).length}{" "}
              futurs soldats •{" "}
              {activiteConfs.filter((conf) => !conf.isFuturSoldier).length}{" "}
              accompagnants
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {presentCount}
            </div>
            <div className="text-sm text-green-800">Présents</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <div className="text-sm text-red-800">Absents</div>
          </div>
        </div>

        {/* Participants Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Liste des participants</h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Cliquez sur une ligne pour marquer/démarquer la présence d'un
            participant.
            {searchTerm && (
              <span className="ml-2 text-blue-600">
                {filteredParticipants.length} résultat(s) trouvé(s)
              </span>
            )}
          </p>
          <DataTable
            columns={activiteConfColumns}
            data={filteredParticipants}
            isLoading={isLoading}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      {/* Add Participant Drawer */}
      <AddParticipantDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAddParticipant={handleAddParticipant}
        onSearchLeads={handleSearchLeads}
        isSearching={isSearchingLeads || isCreating}
      />
    </Section>
  );
}
