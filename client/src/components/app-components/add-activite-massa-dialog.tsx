import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { RootState, AppDispatch } from "@/store/store";
import { createActiviteMassaThunk } from "@/store/thunks/activite-massa/activite-massa.thunk";
import { getActivitiesThunk } from "@/store/thunks/activity/activity.thunk";
import { INTEGRATION_IN_ISRAEL } from "@/i18n/integration-in-israel";

interface AddActiviteMassaDialogProps {
  onSuccess?: () => void;
}

export function AddActiviteMassaDialog({
  onSuccess,
}: AddActiviteMassaDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id_activite_type: "",
    programName: "",
    programYear: "",
    date: "",
  });

  const { activities, isLoading: activitiesLoading } = useSelector(
    (state: RootState) => state.activity
  );
  const { isCreating } = useSelector((state: RootState) => state.activiteMassa);

  // Filter activities to only show "Massa/Écoles" category
  const massaActivities = activities.filter(
    (activity) => activity.category === "Massa/Écoles"
  );

  // Generate year options (current year - 1, current year, current year + 1)
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    `${currentYear - 1}-${currentYear}`,
    `${currentYear}-${currentYear + 1}`,
    `${currentYear + 1}-${currentYear + 2}`,
  ];

  useEffect(() => {
    // Load activities when dialog opens
    if (open) {
      dispatch(getActivitiesThunk());
    }
  }, [dispatch, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.id_activite_type ||
      formData.id_activite_type === "loading" ||
      formData.id_activite_type === "no-activities" ||
      !formData.programName ||
      !formData.programYear ||
      !formData.date
    ) {
      return;
    }

    try {
      await dispatch(
        createActiviteMassaThunk({
          id_activite_type: parseInt(formData.id_activite_type),
          programName: formData.programName,
          programYear: formData.programYear,
          date: formData.date,
        })
      ).unwrap();

      // Reset form and close dialog
      setFormData({
        id_activite_type: "",
        programName: "",
        programYear: "",
        date: "",
      });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create activite massa:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une activité Massa/École
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une activité Massa/École</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activity">Nom de l'activité</Label>
            <Select
              value={formData.id_activite_type}
              onValueChange={(value) =>
                handleInputChange("id_activite_type", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une activité" />
              </SelectTrigger>
              <SelectContent>
                {activitiesLoading ? (
                  <SelectItem value="loading" disabled>
                    Chargement...
                  </SelectItem>
                ) : massaActivities.length === 0 ? (
                  <SelectItem value="no-activities" disabled>
                    Aucune activité Massa/École disponible
                  </SelectItem>
                ) : (
                  massaActivities.map((activity) => (
                    <SelectItem
                      key={activity.id}
                      value={activity.id.toString()}
                    >
                      {activity.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date de l'activité</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="programName">Nom du programme</Label>
            <Select
              value={formData.programName}
              onValueChange={(value) => handleInputChange("programName", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un programme" />
              </SelectTrigger>
              <SelectContent>
                {INTEGRATION_IN_ISRAEL.integration_program_names.map(
                  (program) => (
                    <SelectItem key={program.value} value={program.value}>
                      {program.displayName}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="programYear">Années d'études</Label>
            <Select
              value={formData.programYear}
              onValueChange={(value) => handleInputChange("programYear", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner les années" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={
                isCreating ||
                !formData.id_activite_type ||
                formData.id_activite_type === "loading" ||
                formData.id_activite_type === "no-activities" ||
                !formData.programName ||
                !formData.programYear ||
                !formData.date
              }
            >
              {isCreating ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
