import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  getChangeRequestsThunk,
  acceptChangeRequestThunk,
  rejectChangeRequestThunk,
} from "@/store/thunks/change-request/change-request.thunk";
import { createChangeRequestColumns } from "@/table-columns/change-request-columns";
import { DataTable } from "@/components/app-components/table/table";
import Section from "@/components/app-components/section/section";
import ProtectedComponent from "@/components/app-components/protected-component/protected-component";
import { ChangeRequest } from "@/types/change-request";
import { toast } from "sonner";

const Volunteers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { changeRequests, isLoading, error } = useSelector(
    (state: RootState) => state.changeRequest
  );
  const [processingId, setProcessingId] = useState<number | null>(null);

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

  const columns = createChangeRequestColumns({
    onAccept: handleAccept,
    onReject: handleReject,
    processingId,
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
