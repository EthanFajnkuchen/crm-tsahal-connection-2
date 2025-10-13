import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600">
            Candidature soumise avec succès !
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-lg text-gray-700">
              Merci pour votre candidature. Nous avons bien reçu votre dossier.
            </p>
            <p className="text-gray-600">
              Notre équipe va examiner votre candidature et vous contactera dans
              les plus brefs délais.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Prochaines étapes :</strong>
            </p>
            <ul className="text-sm text-green-700 mt-2 space-y-1 text-left">
              <li>• Vérification de votre dossier</li>
              <li>• Contact par notre équipe</li>
              <li>• Planification des prochaines étapes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessPage;
