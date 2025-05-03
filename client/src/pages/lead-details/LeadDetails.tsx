import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { fetchLeadDetailsThunk } from "../../store/thunks/lead-details/lead-details.thunk";
import { RootState, AppDispatch } from "../../store/store";
import { Lead } from "@/types/lead";
import { GeneralSection } from "./components/general-section";
import { ExpertConnectionSection } from "./components/expert-connection-section";

const LeadDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: lead,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.leadDetails);
  const { reset } = useForm<Partial<Lead>>();

  useEffect(() => {
    if (id) {
      dispatch(fetchLeadDetailsThunk(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (lead) {
      reset({
        firstName: lead.firstName,
        lastName: lead.lastName,
        dateInscription: lead.dateInscription,
        birthDate: lead.birthDate,
        city: lead.city,
        gender: lead.gender || "",
        isOnlyChild: lead.isOnlyChild === "Oui" ? true : false,
        contactUrgenceFirstName: lead.contactUrgenceFirstName || "",
        contactUrgenceLastName: lead.contactUrgenceLastName || "",
        contactUrgencePhoneNumber: lead.contactUrgencePhoneNumber || "",
        contactUrgenceMail: lead.contactUrgenceMail || "",
        contactUrgenceRelation: lead.contactUrgenceRelation || "",
        expertConnection: lead.expertConnection || "",
        produitEC1: lead.produitEC1 || "",
        produitEC2: lead.produitEC2 || "",
        produitEC3: lead.produitEC3 || "",
        produitEC4: lead.produitEC4 || "",
        produitEC5: lead.produitEC5 || "",
        dateProduitEC1: lead.dateProduitEC1 || "",
        dateProduitEC2: lead.dateProduitEC2 || "",
        dateProduitEC3: lead.dateProduitEC3 || "",
        dateProduitEC4: lead.dateProduitEC4 || "",
        dateProduitEC5: lead.dateProduitEC5 || "",
      });
    }
  }, [lead, reset]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (!lead) {
    return <div className="text-center p-4">No lead found</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {lead && (
        <>
          <GeneralSection lead={lead} />
          <ExpertConnectionSection lead={lead} />
        </>
      )}
    </div>
  );
};

export default LeadDetailsPage;
