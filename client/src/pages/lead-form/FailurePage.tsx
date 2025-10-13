import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FailurePage: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/candidature");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-red-600">
            Erreur lors de la soumission
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-lg text-gray-700">
              Nous sommes désolés, une erreur s'est produite lors de l'envoi de
              votre candidature.
            </p>
            <p className="text-gray-600">
              Veuillez réessayer ou contactez notre support technique si le
              problème persiste.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Que faire maintenant :</strong>
            </p>
            <ul className="text-sm text-red-700 mt-2 space-y-1 text-left">
              <li>• Vérifiez votre connexion internet</li>
              <li>• Réessayez de soumettre votre candidature</li>
              <li>• Contactez le support si le problème persiste</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FailurePage;
