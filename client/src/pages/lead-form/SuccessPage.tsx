import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const SuccessPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600">
            Formulaire de contact reçu avec succès !
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-lg text-gray-700">
              Merci pour votre formulaire de contact. Nous avons bien reçu votre
              demande.
            </p>
            <p className="text-gray-600">
              Vous allez recevoir un email de confirmation et notre équipe vous
              recontactera dans les plus brefs délais.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Prochaines étapes :</strong>
            </p>
            <ul className="text-sm text-green-700 mt-2 space-y-1 text-left">
              <li>• Réception d'un email de confirmation</li>
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
