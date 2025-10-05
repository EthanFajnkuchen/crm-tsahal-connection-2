import React, { useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChangeRequest } from "@/types/change-request";
import { Badge } from "@/components/ui/badge";

interface ChangeRequestIndicatorProps {
  changeRequests: ChangeRequest[];
  fieldName: string;
  label: string;
  onApprove: (changeRequestId: number) => void;
  onReject: (changeRequestId: number) => void;
  isLoading?: boolean;
}

export const ChangeRequestIndicator: React.FC<ChangeRequestIndicatorProps> = ({
  changeRequests,
  fieldName,
  label,
  onApprove,
  onReject,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(
    null
  );
  const [actionLoading, setActionLoading] = useState<
    "approve" | "reject" | null
  >(null);

  // Filter change requests for this specific field
  const fieldChangeRequests = changeRequests.filter(
    (request) => request.fieldChanged === fieldName
  );

  if (fieldChangeRequests.length === 0) {
    return null;
  }

  const handleIndicatorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (fieldChangeRequests.length === 1) {
      setSelectedRequest(fieldChangeRequests[0]);
    } else {
      setSelectedRequest(fieldChangeRequests[0]); // For now, take the first one
    }
    setIsDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    setActionLoading("approve");
    try {
      await onApprove(selectedRequest.id);
      setIsDialogOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error approving change request:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    setActionLoading("reject");
    try {
      await onReject(selectedRequest.id);
      setIsDialogOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error rejecting change request:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatValue = (value: string) => {
    if (!value || value === "null" || value === "undefined") {
      return "(vide)";
    }
    return value;
  };

  return (
    <>
      <button
        type="button"
        onClick={handleIndicatorClick}
        className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 hover:bg-red-200 transition-colors relative"
        title={`${fieldChangeRequests.length} demande(s) de modification en attente`}
      >
        <AlertTriangle className="w-3 h-3 text-red-600" />
        {fieldChangeRequests.length > 1 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs"
          >
            {fieldChangeRequests.length}
          </Badge>
        )}
      </button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Demande de modification en attente
            </DialogTitle>
            <DialogDescription>
              Un volontaire a demandé une modification pour ce champ.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Champ concerné :
                  </label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {label}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Valeur actuelle :
                  </label>
                  <p className="text-sm bg-red-50 p-2 rounded border border-red-200">
                    {formatValue(selectedRequest.oldValue)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Nouvelle valeur proposée :
                  </label>
                  <p className="text-sm bg-green-50 p-2 rounded border border-green-200">
                    {formatValue(selectedRequest.newValue)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <label className="font-medium">Demandé par :</label>
                    <p>{selectedRequest.changedBy}</p>
                  </div>
                  <div>
                    <label className="font-medium">Date :</label>
                    <p>
                      {new Date(
                        selectedRequest.dateModified
                      ).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={actionLoading !== null}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading !== null}
              className="flex items-center gap-2"
            >
              {actionLoading === "reject" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Refus...
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  Refuser
                </>
              )}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={actionLoading !== null}
              className="flex items-center gap-2"
            >
              {actionLoading === "approve" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Approbation...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Approuver
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
