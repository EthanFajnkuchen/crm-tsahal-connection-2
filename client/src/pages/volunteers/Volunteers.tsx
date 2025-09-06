import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  getChangeRequestsThunk,
  acceptChangeRequestThunk,
  rejectChangeRequestThunk,
  bulkAcceptChangeRequestsThunk,
  bulkRejectChangeRequestsThunk,
} from "@/store/thunks/change-request/change-request.thunk";
import { createChangeRequestColumns } from "@/table-columns/change-request-columns";
import { DataTable } from "@/components/app-components/table/table";
import Section from "@/components/app-components/section/section";
import ProtectedComponent from "@/components/app-components/protected-component/protected-component";
import { ChangeRequest } from "@/types/change-request";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";

const Volunteers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { changeRequests, isLoading, error } = useSelector(
    (state: RootState) => state.changeRequest
  );
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [bulkProcessing, setBulkProcessing] = useState<{
    accept: boolean;
    reject: boolean;
  }>({
    accept: false,
    reject: false,
  });

  useEffect(() => {
    dispatch(getChangeRequestsThunk());
  }, [dispatch]);

  const handleAccept = async (changeRequest: ChangeRequest) => {
    setProcessingId(changeRequest.id);
    try {
      await dispatch(acceptChangeRequestThunk(changeRequest)).unwrap();
      toast.success(`Modification acceptée`);
    } catch (error) {
      toast.error("Erreur lors de l'acceptation de la modification");
      console.error("Error accepting change request:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessingId(id);
    try {
      await dispatch(rejectChangeRequestThunk(id)).unwrap();
      toast.success("Modification refusée");
    } catch (error) {
      toast.error("Erreur lors du refus de la modification");
      console.error("Error rejecting change request:", error);
    } finally {
      setProcessingId(null);
    }
  };

  // Bulk operations
  const handleBulkAccept = async () => {
    if (selectedItems.size === 0) {
      toast.warning("Veuillez sélectionner au moins une demande");
      return;
    }

    setBulkProcessing((prev) => ({ ...prev, accept: true }));
    try {
      const selectedChangeRequests = changeRequests.filter((cr) =>
        selectedItems.has(cr.id)
      );
      const result = await dispatch(
        bulkAcceptChangeRequestsThunk(selectedChangeRequests)
      ).unwrap();

      const { successful, failed, totalCount } = result;

      if (failed.length === 0) {
        toast.success(
          `${successful.length} modification(s) acceptée(s) avec succès`
        );
      } else {
        toast.warning(
          `${successful.length}/${totalCount} modification(s) acceptée(s). ${failed.length} ont échoué.`
        );
      }

      setSelectedItems(new Set());
    } catch (error) {
      toast.error("Erreur lors de l'acceptation des modifications");
      console.error("Error bulk accepting change requests:", error);
    } finally {
      setBulkProcessing((prev) => ({ ...prev, accept: false }));
    }
  };

  const handleBulkReject = async () => {
    if (selectedItems.size === 0) {
      toast.warning("Veuillez sélectionner au moins une demande");
      return;
    }

    setBulkProcessing((prev) => ({ ...prev, reject: true }));
    try {
      const selectedIds = Array.from(selectedItems);
      const result = await dispatch(
        bulkRejectChangeRequestsThunk(selectedIds)
      ).unwrap();

      const { successful, failed, totalCount } = result;

      if (failed.length === 0) {
        toast.success(
          `${successful.length} modification(s) refusée(s) avec succès`
        );
      } else {
        toast.warning(
          `${successful.length}/${totalCount} modification(s) refusée(s). ${failed.length} ont échoué.`
        );
      }

      setSelectedItems(new Set());
    } catch (error) {
      toast.error("Erreur lors du refus des modifications");
      console.error("Error bulk rejecting change requests:", error);
    } finally {
      setBulkProcessing((prev) => ({ ...prev, reject: false }));
    }
  };

  const columns = createChangeRequestColumns({
    onAccept: handleAccept,
    onReject: handleReject,
    processingId,
    selectedItems,
    onSelectionChange: setSelectedItems,
    enableSelection: true,
  });

  if (error) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erreur</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh]">
      <ProtectedComponent showUnauthorizedMessage={true}>
        <Section title="Demandes de modification des volontaires">
          <div className="space-y-4">
            {/* Bulk Actions */}
            {selectedItems.size > 0 && (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-700">
                    {selectedItems.size} élément(s) sélectionné(s)
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedItems(new Set())}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Désélectionner tout
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkAccept}
                    disabled={bulkProcessing.accept || bulkProcessing.reject}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    {bulkProcessing.accept ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Accepter ({selectedItems.size})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkReject}
                    disabled={bulkProcessing.accept || bulkProcessing.reject}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    {bulkProcessing.reject ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <X className="h-4 w-4 mr-2" />
                    )}
                    Refuser ({selectedItems.size})
                  </Button>
                </div>
              </div>
            )}

            {changeRequests.length === 0 && !isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Aucune demande de modification en attente
                </p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={changeRequests}
                isLoading={isLoading && changeRequests.length === 0}
              />
            )}
          </div>
        </Section>
      </ProtectedComponent>
    </div>
  );
};

export default Volunteers;
