import { useLocation } from "react-router-dom";
import SalonActivityDetails from "./SalonActivityDetails";
import MassaActivityDetails from "./MassaActivityDetails";

export default function ActivityDetails() {
  const location = useLocation();

  // Déterminer le type d'activité depuis le state de navigation
  const activityType = location.state?.activityType || "salon";

  // Router vers le bon composant selon le type d'activité
  if (activityType === "massa") {
    return <MassaActivityDetails />;
  }

  return <SalonActivityDetails />;
}
