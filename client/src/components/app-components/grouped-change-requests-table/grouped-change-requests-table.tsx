import React, { useState } from "react";
import { GroupedChangeRequest, ChangeRequest } from "@/types/change-request";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ChevronDown, ChevronRight, Loader2, User } from "lucide-react";
import {
  formatDisplayValue,
  shouldDisplayAsImage,
} from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GroupedChangeRequestsTableProps {
  groupedRequests: GroupedChangeRequest[];
  onAccept: (changeRequest: ChangeRequest) => void;
  onReject: (id: number) => void;
  processingId?: number | null;
  selectedItems?: Set<number>;
  onSelectionChange?: (selected: Set<number>) => void;
  enableSelection?: boolean;
}

export const GroupedChangeRequestsTable: React.FC<
  GroupedChangeRequestsTableProps
> = ({
  groupedRequests,
  onAccept,
  onReject,
  processingId,
  selectedItems = new Set(),
  onSelectionChange,
  enableSelection = false,
}) => {
  const [expandedLeads, setExpandedLeads] = useState<Set<number>>(new Set());

  const toggleLead = (leadId: number) => {
    const newExpanded = new Set(expandedLeads);
    if (newExpanded.has(leadId)) {
      newExpanded.delete(leadId);
    } else {
      newExpanded.add(leadId);
    }
    setExpandedLeads(newExpanded);
  };

  const toggleSelectAll = (_leadId: number, requestIds: number[]) => {
    if (!onSelectionChange) return;

    const allSelected = requestIds.every((id) => selectedItems.has(id));
    const newSelected = new Set(selectedItems);

    if (allSelected) {
      requestIds.forEach((id) => newSelected.delete(id));
    } else {
      requestIds.forEach((id) => newSelected.add(id));
    }

    onSelectionChange(newSelected);
  };

  const toggleSelectRequest = (requestId: number) => {
    if (!onSelectionChange) return;

    const newSelected = new Set(selectedItems);
    if (newSelected.has(requestId)) {
      newSelected.delete(requestId);
    } else {
      newSelected.add(requestId);
    }
    onSelectionChange(newSelected);
  };

  if (groupedRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Aucune demande de modification en attente
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {groupedRequests.map((group) => {
        const isExpanded = expandedLeads.has(group.leadId);
        const allSelected =
          enableSelection &&
          group.requests.every((req) => selectedItems.has(req.id));
        const someSelected =
          enableSelection &&
          group.requests.some((req) => selectedItems.has(req.id));

        return (
          <div
            key={group.leadId}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
          >
            {/* Header du groupe */}
            <div
              className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => toggleLead(group.leadId)}
            >
              <div className="flex items-center gap-3 flex-1">
                {enableSelection && (
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected && !allSelected;
                    }}
                    onChange={() =>
                      toggleSelectAll(
                        group.leadId,
                        group.requests.map((r) => r.id)
                      )
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                )}
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {group.lead.firstName} {group.lead.lastName}
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {group.totalCount} demande{group.totalCount > 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>ID: #{group.lead.ID}</span>
                      {group.lead.email && (
                        <span>{group.lead.email}</span>
                      )}
                      {group.volunteers.length > 0 && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{group.volunteers.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu détaillé */}
            {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          {enableSelection && (
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                              <input
                                type="checkbox"
                                checked={allSelected}
                                ref={(input) => {
                                  if (input)
                                    input.indeterminate = someSelected && !allSelected;
                                }}
                                onChange={() =>
                                  toggleSelectAll(
                                    group.leadId,
                                    group.requests.map((r) => r.id)
                                  )
                                }
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                            </th>
                          )}
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Champ
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Ancienne valeur
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Nouvelle valeur
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Modifié par
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {group.requests.map((request) => {
                          const isProcessing = processingId === request.id;
                          const isSelected = selectedItems.has(request.id);

                          return (
                            <tr
                              key={request.id}
                              className={`hover:bg-gray-50 ${
                                isSelected ? "bg-blue-50" : ""
                              }`}
                            >
                              {enableSelection && (
                                <td className="px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelectRequest(request.id)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                </td>
                              )}
                              <td className="px-4 py-3">
                                {isProcessing ? (
                                  <div className="h-5 w-24 bg-gray-200 animate-pulse rounded" />
                                ) : (
                                  <Badge variant="outline" className="font-medium">
                                    {request.fieldChanged}
                                  </Badge>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {isProcessing ? (
                                  <div className="h-5 w-40 bg-gray-200 animate-pulse rounded" />
                                ) : shouldDisplayAsImage(
                                    request.oldValue,
                                    request.fieldChanged
                                  ) ? (
                                  <div className="flex items-center">
                                    {request.oldValue &&
                                    request.oldValue !== "null" &&
                                    request.oldValue !== "undefined" ? (
                                      <Avatar className="h-12 w-12 border-2 border-red-200">
                                        <AvatarImage
                                          src={request.oldValue}
                                          alt="Ancienne valeur"
                                          className="object-cover"
                                        />
                                        <AvatarFallback className="bg-red-50 text-red-600">
                                          <User className="h-6 w-6" />
                                        </AvatarFallback>
                                      </Avatar>
                                    ) : (
                                      <span className="text-gray-500 text-sm italic">
                                        (vide)
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div
                                    className="max-w-[200px] truncate text-gray-600"
                                    title={formatDisplayValue(request.oldValue)}
                                  >
                                    {formatDisplayValue(request.oldValue) || "-"}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {isProcessing ? (
                                  <div className="h-5 w-40 bg-gray-200 animate-pulse rounded" />
                                ) : shouldDisplayAsImage(
                                    request.newValue,
                                    request.fieldChanged
                                  ) ? (
                                  <div className="flex items-center">
                                    {request.newValue &&
                                    request.newValue !== "null" &&
                                    request.newValue !== "undefined" ? (
                                      <Avatar className="h-12 w-12 border-2 border-green-300">
                                        <AvatarImage
                                          src={request.newValue}
                                          alt="Nouvelle valeur"
                                          className="object-cover"
                                        />
                                        <AvatarFallback className="bg-green-50 text-green-600">
                                          <User className="h-6 w-6" />
                                        </AvatarFallback>
                                      </Avatar>
                                    ) : (
                                      <span className="text-gray-500 text-sm italic">
                                        (vide)
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div
                                    className="max-w-[200px] truncate font-medium text-green-600"
                                    title={formatDisplayValue(request.newValue)}
                                  >
                                    {formatDisplayValue(request.newValue) || "-"}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {isProcessing ? (
                                  <div className="h-5 w-28 bg-gray-200 animate-pulse rounded" />
                                ) : (
                                  <span className="text-gray-700">
                                    {request.changedBy}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {isProcessing ? (
                                  <div className="h-5 w-36 bg-gray-200 animate-pulse rounded" />
                                ) : (
                                  <span className="text-gray-600 text-sm">
                                    {new Date(request.dateModified).toLocaleDateString(
                                      "fr-FR",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => onAccept(request)}
                                    disabled={isProcessing}
                                    title="Accepter la modification"
                                  >
                                    {isProcessing ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => onReject(request.id)}
                                    disabled={isProcessing}
                                    title="Refuser la modification"
                                  >
                                    {isProcessing ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <X className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

