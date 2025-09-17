import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

import { DataTable } from "@/components/app-components/table/table";
import Section from "@/components/app-components/section/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { ActiviteConf } from "@/store/adapters/activite-conf/activite-conf.adapter";

import { RootState, AppDispatch } from "@/store/store";
import {
  getActiviteConfByActivityTypeThunk,
  updateActiviteConfThunk,
} from "@/store/thunks/activite-conf/activite-conf.thunk";
import { getActivitiesThunk } from "@/store/thunks/activity/activity.thunk";

const columns: ColumnDef<ActiviteConf>[] = [
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

export default function ActivityDetails() {
  const { idActivite } = useParams<{ idActivite: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { activiteConfs, isLoading, error } = useSelector(
    (state: RootState) => state.activiteConf
  );

  const { activities } = useSelector((state: RootState) => state.activity);

  useEffect(() => {
    // Load activities if not already loaded
    if (activities.length === 0) {
      dispatch(getActivitiesThunk());
    }

    if (idActivite) {
      const activityId = parseInt(idActivite, 10);
      if (!isNaN(activityId)) {
        dispatch(getActiviteConfByActivityTypeThunk(activityId));
      }
    }
  }, [dispatch, idActivite, activities.length]);

  const handleRowClick = (activiteConf: ActiviteConf) => {
    // Toggle hasArrived status
    const updatedStatus = !activiteConf.hasArrived;
    dispatch(
      updateActiviteConfThunk({
        id: activiteConf.id,
        updates: { hasArrived: updatedStatus },
      })
    );
  };

  const handleGoBack = () => {
    navigate("/activities");
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

  return (
    <Section title={`Détails de l'activité ${currentActivity?.name || ""}`}>
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
              <h2 className="text-lg font-semibold">{currentActivity.name}</h2>
              <p className="text-sm text-gray-600">
                {new Date(currentActivity.date).toLocaleDateString("fr-FR")} -{" "}
                {currentActivity.category}
              </p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {activiteConfs.length}
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
              {activiteConfs.filter((conf) => conf.hasArrived).length}
            </div>
            <div className="text-sm text-green-800">Présents</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {activiteConfs.filter((conf) => !conf.hasArrived).length}
            </div>
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
            columns={columns}
            data={activiteConfs}
            isLoading={isLoading}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </Section>
  );
}
