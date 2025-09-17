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

interface ActivitiesSectionProps {
  lead: Lead;
}

export const ActivitiesSection = ({ lead }: ActivitiesSectionProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { activiteConfsByLead, isLoading, error, currentLeadId } = useSelector(
    (state: RootState) => state.activiteConf
  );

  const { activities } = useSelector((state: RootState) => state.activity);

  useEffect(() => {
    // Load activities if not already loaded
    if (activities.length === 0) {
      dispatch(getActivitiesThunk());
    }

    // Only fetch if we don't have activite confs for this lead or if it's a different lead
    if (currentLeadId !== lead.ID) {
      dispatch(getActiviteConfByLeadIdThunk(lead.ID));
    }
  }, [dispatch, lead.ID, currentLeadId, activities.length]);

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des activités");
    }
  }, [error]);

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

  return (
    <FormSection
      title={
        <div className="flex items-center gap-2">
          Activités ({activiteConfsByLead.length})
        </div>
      }
      notEditable={true}
    >
      <div className="space-y-4">
        {/* Activities List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Chargement des activités...</div>
          </div>
        ) : activiteConfsByLead.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Aucune activité</p>
            <p className="text-sm">
              Ce lead n'a participé à aucune activité pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activiteConfsByLead.map((activiteConf) => {
              const activityInfo = getActivityInfo(activiteConf.activiteType);
              return (
                <Card key={activiteConf.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-purple-600" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {activityInfo.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {activityInfo.date
                              ? formatDate(activityInfo.date)
                              : "Date non spécifiée"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </FormSection>
  );
};
