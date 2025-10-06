import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Lead } from "@/types/lead";
import { FormSection } from "@/components/form-components/form-section";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Activity } from "lucide-react";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/store/store";
import { getActiviteConfByLeadIdThunk } from "@/store/thunks/activite-conf/activite-conf.thunk";
import { getActivitiesThunk } from "@/store/thunks/activity/activity.thunk";
import { getActiviteMassaThunk } from "@/store/thunks/activite-massa/activite-massa.thunk";
import { getActiviteMassaParticipationByLeadThunk } from "@/store/thunks/activite-massa-participation/activite-massa-participation.thunk";

interface ActivitiesSectionProps {
  lead: Lead;
}

export const ActivitiesSection = ({ lead }: ActivitiesSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { activiteConfsByLead, isLoading, error, currentLeadId } = useSelector(
    (state: RootState) => state.activiteConf
  );

  const { activities } = useSelector((state: RootState) => state.activity);
  const { activiteMassa } = useSelector(
    (state: RootState) => state.activiteMassa
  );
  const {
    activiteMassaParticipations,
    isLoading: massaLoading,
    error: massaError,
  } = useSelector((state: RootState) => state.activiteMassaParticipation);

  useEffect(() => {
    // Load activities if not already loaded
    if (activities.length === 0) {
      dispatch(getActivitiesThunk());
    }

    // Load activite massa if not already loaded
    if (activiteMassa.length === 0) {
      dispatch(getActiviteMassaThunk({}));
    }

    // Only fetch if we don't have activite confs for this lead or if it's a different lead
    if (currentLeadId !== lead.ID) {
      dispatch(getActiviteConfByLeadIdThunk(lead.ID));
      dispatch(getActiviteMassaParticipationByLeadThunk(lead.ID));
    }
  }, [
    dispatch,
    lead.ID,
    currentLeadId,
    activities.length,
    activiteMassa.length,
  ]);

  useEffect(() => {
    if (error || massaError) {
      toast.error("Erreur lors du chargement des activités");
    }
  }, [error, massaError]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getActivityInfo = (activiteType: number) => {
    const activity = activities.find((act) => act.id === activiteType);
    return (
      activity || {
        name: `Activité ${activiteType}`,
        date: "",
        category: "Non spécifiée",
      }
    );
  };

  const getMassaActivityInfo = (activiteMassaId: number) => {
    const massaActivity = activiteMassa.find(
      (massa) => massa.id === activiteMassaId
    );

    console.log(activities);

    if (massaActivity) {
      // Récupérer le nom de l'activité type depuis le tableau activities
      const activityTypeInfo = activities.find(
        (activity) => activity.id === massaActivity.id_activite_type
      );

      console.log("activityTypeInfo:", activityTypeInfo);
      return {
        name: `${activityTypeInfo?.name || "Activité inconnue"} - ${
          massaActivity.programName
        } - ${massaActivity.programYear}`,
        date: massaActivity.date,
        category: "Massa/École",
      };
    }
    return {
      name: `Activité Massa ${activiteMassaId}`,
      date: "",
      category: "Massa/École",
    };
  };

  // Combiner toutes les activités (Salon + Massa)
  const allActivities = [
    ...activiteConfsByLead.map((activiteConf) => ({
      id: `salon-${activiteConf.id}`,
      type: "salon" as const,
      activityInfo: getActivityInfo(activiteConf.activiteType),
    })),
    ...activiteMassaParticipations
      .filter((participation) => participation.lead_id === lead.ID)
      .map((participation) => ({
        id: `massa-${participation.id}`,
        type: "massa" as const,
        activityInfo: getMassaActivityInfo(participation.id_activite_massa),
      })),
  ];

  const totalActivities = allActivities.length;

  return (
    <FormSection
      title={
        <div className="flex items-center gap-2">
          Activités ({totalActivities})
        </div>
      }
      notEditable={true}
    >
      <div className="space-y-4">
        {/* Activities List */}
        {isLoading || massaLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Chargement des activités...</div>
          </div>
        ) : totalActivities === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Aucune activité</p>
            <p className="text-sm">
              Ce lead n'a participé à aucune activité pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {allActivities.map((activity) => (
              <Card key={activity.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {activity.activityInfo.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {activity.activityInfo.date
                            ? formatDate(activity.activityInfo.date)
                            : "Date non spécifiée"}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {activity.activityInfo.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </FormSection>
  );
};
