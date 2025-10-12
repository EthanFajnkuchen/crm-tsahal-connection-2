import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

import { DataTable } from "@/components/app-components/table/table";
import Section from "@/components/app-components/section/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { Lead } from "@/types/lead";

import { RootState, AppDispatch } from "@/store/store";
import { getActivitiesThunk } from "@/store/thunks/activity/activity.thunk";
import { getActiviteMassaThunk } from "@/store/thunks/activite-massa/activite-massa.thunk";
import { getActiviteMassaParticipationByActiviteMassaThunk } from "@/store/thunks/activite-massa-participation/activite-massa-participation.thunk";
import {
  createActiviteMassaParticipationThunk,
  deleteActiviteMassaParticipationThunk,
} from "@/store/thunks/activite-massa-participation/activite-massa-participation.thunk";
import { fetchFilteredLeadsThunk } from "@/store/thunks/dashboard/filtered-card-leads.thunk";
import { LeadFilterDto } from "@/store/adapters/dashboard/filtered-card-leads.adapter";

// Colonnes pour les activités Massa/Ecole
const massaColumns: ColumnDef<Lead & { isParticipating: boolean }>[] = [
  {
    accessorKey: "fullName",
    header: "Nom complet",
    cell: ({ row }) => {
      const lead = row.original;
      return (
        <div className="font-medium">
          {lead.firstName} {lead.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <div>{email}</div>;
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
    id: "isParticipating",
    accessorKey: "isParticipating",
    header: "Confirmation de venue",
    cell: ({ row }) => {
      const isParticipating = row.getValue("isParticipating") as boolean;

      return (
        <div className="flex items-center gap-2">
          {isParticipating ? (
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

export default function MassaActivityDetails() {
  const { idActivite } = useParams<{ idActivite: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { activities } = useSelector((state: RootState) => state.activity);
  const { activiteMassa } = useSelector(
    (state: RootState) => state.activiteMassa
  );
  const { activiteMassaParticipations } = useSelector(
    (state: RootState) => state.activiteMassaParticipation
  );
  const { data: filteredLeads, status: _leadsStatus } = useSelector(
    (state: RootState) => state.filteredLeads
  );

  const [massaLeads, setMassaLeads] = useState<
    (Lead & { isParticipating: boolean })[]
  >([]);
  const [isMassaLoading, setIsMassaLoading] = useState(false);
  const [massaError, setMassaError] = useState<string | null>(null);

  // Déterminer le type d'activité depuis le state de navigation
  const activityName = location.state?.activityName || "";

  useEffect(() => {
    // Load activities if not already loaded
    if (activities.length === 0) {
      dispatch(getActivitiesThunk());
    }

    // Load activite massa if not already loaded
    if (activiteMassa.length === 0) {
      dispatch(getActiviteMassaThunk({}));
    }
  }, [dispatch, activities.length, activiteMassa.length]);

  // Charger les participations quand l'ID change
  useEffect(() => {
    if (idActivite) {
      const activityId = parseInt(idActivite, 10);
      if (!isNaN(activityId)) {
        dispatch(getActiviteMassaParticipationByActiviteMassaThunk(activityId));
      }
    }
  }, [dispatch, idActivite]);

  // Mettre à jour les leads quand les données changent
  useEffect(() => {
    if (filteredLeads) {
      setIsMassaLoading(true);
      setMassaError(null);

      try {
        // Marquer les leads qui participent déjà
        const leadsWithParticipation = filteredLeads.map((lead: any) => ({
          ...lead,
          isParticipating: activiteMassaParticipations.some(
            (participation) => participation.lead_id === lead.ID
          ),
        }));

        setMassaLeads(leadsWithParticipation);
      } catch (error) {
        console.error("Error loading Massa leads:", error);
        setMassaError("Erreur lors du chargement des leads");
      } finally {
        setIsMassaLoading(false);
      }
    }
  }, [filteredLeads, activiteMassaParticipations]);

  // Charger les leads filtrés quand l'activité Massa est trouvée
  useEffect(() => {
    if (idActivite && activiteMassa.length > 0) {
      const activityId = parseInt(idActivite, 10);
      const activity = activiteMassa.find((a) => Number(a.id) === activityId);

      if (activity) {
        const filters: LeadFilterDto = {
          included: {
            programName: [activity.programName],
            schoolYears: [activity.programYear],
          },
          excluded: {},
          fieldsToSend: [
            "ID",
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "programName",
            "schoolYears",
          ],
        };
        dispatch(fetchFilteredLeadsThunk(filters));
      }
    }
  }, [idActivite, activiteMassa, dispatch]);

  const handleRowClick = (data: Lead & { isParticipating: boolean }) => {
    // Gérer les clics pour les activités Massa
    const lead = data;
    const activityId = parseInt(idActivite || "0", 10);

    if (lead.isParticipating) {
      // Supprimer la participation
      const participation = activiteMassaParticipations.find(
        (p) =>
          p.lead_id === lead.ID && Number(p.id_activite_massa) === activityId
      );
      if (participation) {
        dispatch(deleteActiviteMassaParticipationThunk(participation.id));
      }
    } else {
      // Ajouter la participation
      dispatch(
        createActiviteMassaParticipationThunk({
          id_activite_massa: activityId,
          lead_id: lead.ID,
        })
      );
    }
  };

  const handleGoBack = () => {
    navigate("/activities");
  };

  // Find the current activity details
  const currentActivity = activiteMassa.find(
    (activity) => activity.id === parseInt(idActivite || "0", 10)
  );

  if (massaError) {
    return (
      <Section title="Détails de l'activité">
        <div className="p-4 text-center text-red-500">
          Erreur lors du chargement des participants: {massaError}
        </div>
      </Section>
    );
  }

  // Calculer les statistiques
  const totalParticipants = massaLeads.length;
  const presentCount = massaLeads.filter((lead) => lead.isParticipating).length;
  const absentCount = totalParticipants - presentCount;

  return (
    <Section
      title={`Détails de l'activité ${
        activityName ||
        (currentActivity
          ? `${currentActivity.programName} - ${currentActivity.programYear}`
          : "")
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

          {currentActivity && (
            <div className="text-right">
              <h2 className="text-lg font-semibold">
                {activityName ||
                  `${currentActivity.programName} - ${currentActivity.programYear}`}
              </h2>
              <p className="text-sm text-gray-600">
                {new Date(currentActivity.date).toLocaleDateString("fr-FR")} -{" "}
                Massa/École
              </p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {totalParticipants}
            </div>
            <div className="text-sm text-blue-800">Total participants</div>
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
          <h3 className="text-lg font-medium mb-3">Liste des participants</h3>
          <p className="text-sm text-gray-600 mb-4">
            Cliquez sur une ligne pour marquer/démarquer la présence d'un
            participant.
          </p>
          <DataTable
            columns={massaColumns}
            data={massaLeads}
            isLoading={isMassaLoading}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </Section>
  );
}
