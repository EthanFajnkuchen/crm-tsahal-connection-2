import React from "react";
import TafkidimCard from "../tafkidim-card/TafkidimCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  title: string;
  leads: { id: number; fullName: string; nomPoste: string }[];
  total: number;
  isLoading?: boolean;
  error?: string;
}

const TafkidimColumn: React.FC<Props> = ({
  title,
  leads,
  total,
  isLoading = false,
  error = false,
}) => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col lg:h-full h-96">
    <div className="flex items-center justify-between mb-2">
      <h2 className="font-bold text-lg">{title}</h2>
      {isLoading ? (
        <Skeleton className="h-6 w-8 rounded-full" />
      ) : (
        <span className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold">
          {total}
        </span>
      )}
    </div>
    <div className="flex-1 flex flex-col gap-2 overflow-y-auto min-h-0">
      {isLoading || error ? (
        Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="border rounded p-2 bg-gray-50">
            <Skeleton className="h-4 w-3/4 mb-1" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))
      ) : (
        <>
          {leads.map((lead) => (
            <TafkidimCard
              key={lead.id}
              id={lead.id}
              fullName={lead.fullName}
              nomPoste={lead.nomPoste}
            />
          ))}
          {leads.length === 0 && (
            <div className="text-gray-400 text-center mt-4">Aucun résultat</div>
          )}
        </>
      )}
    </div>
  </div>
);

export default TafkidimColumn;
