import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Check, X, Loader2 } from "lucide-react";
import { ChangeRequest } from "@/types/change-request";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

interface ChangeRequestColumnsProps {
  onAccept: (changeRequest: ChangeRequest) => void;
  onReject: (id: number) => void;
  processingId?: number | null;
  selectedItems?: Set<number>;
  onSelectionChange?: (selected: Set<number>) => void;
  enableSelection?: boolean;
}

export const createChangeRequestColumns = ({
  onAccept,
  onReject,
  processingId,
  selectedItems = new Set(),
  onSelectionChange,
  enableSelection = false,
}: ChangeRequestColumnsProps): ColumnDef<ChangeRequest>[] => {
  // Helper function to format dates for display
  const formatDisplayValue = (value: string): string => {
    if (!value) return value;

    // Check if it's a date in yyyy-MM-dd format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(value)) {
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        return dateValue.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    }

    return value;
  };

  const baseColumns: ColumnDef<ChangeRequest>[] = [
    // Selection column (conditional)
    ...(enableSelection
      ? [
          {
            id: "select",
            header: ({ table }: any) => (
              <Checkbox
                checked={
                  selectedItems.size === table.getRowModel().rows.length &&
                  table.getRowModel().rows.length > 0
                }
                onCheckedChange={(value) => {
                  if (!onSelectionChange) return;

                  if (value) {
                    // Select all
                    const allIds = new Set<number>(
                      table
                        .getRowModel()
                        .rows.map((row: any) => row.original.id)
                    );
                    onSelectionChange(allIds);
                  } else {
                    // Deselect all
                    onSelectionChange(new Set<number>());
                  }
                }}
                aria-label="Select all"
              />
            ),
            cell: ({ row }: any) => (
              <Checkbox
                checked={selectedItems.has(row.original.id)}
                onCheckedChange={(value) => {
                  if (!onSelectionChange) return;

                  const newSelected = new Set<number>(selectedItems);
                  if (value) {
                    newSelected.add(row.original.id);
                  } else {
                    newSelected.delete(row.original.id);
                  }
                  onSelectionChange(newSelected);
                }}
                aria-label="Select row"
              />
            ),
            enableSorting: false,
            enableHiding: false,
          },
        ]
      : []),
    {
      accessorKey: "lead",
      header: ({ column }) => (
        <Button
          variant="link"
          className="p-0 m-0 border-none shadow-none text-inherit hover:no-underline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Futur soldat
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const changeRequest = row.original;
        const isProcessing = processingId === changeRequest.id;

        if (isProcessing) {
          return <Skeleton className="h-5 w-32" />;
        }

        const fullName = changeRequest.lead
          ? `${changeRequest.lead.firstName} ${changeRequest.lead.lastName}`
          : `Lead #${changeRequest.leadId}`;
        return <span className="font-medium">{fullName}</span>;
      },
      sortingFn: (rowA, rowB) => {
        const nameA = rowA.original.lead
          ? `${rowA.original.lead.firstName} ${rowA.original.lead.lastName}`
          : "";
        const nameB = rowB.original.lead
          ? `${rowB.original.lead.firstName} ${rowB.original.lead.lastName}`
          : "";
        return nameA.localeCompare(nameB);
      },
    },
    {
      accessorKey: "fieldChanged",
      header: "Champ modifié",
      cell: ({ row }) => {
        const changeRequest = row.original;
        const isProcessing = processingId === changeRequest.id;

        if (isProcessing) {
          return <Skeleton className="h-6 w-24" />;
        }

        const field = row.getValue("fieldChanged") as string;
        return (
          <Badge variant="outline" className="font-medium">
            {field}
          </Badge>
        );
      },
    },
    {
      accessorKey: "oldValue",
      header: "Ancienne valeur",
      cell: ({ row }) => {
        const changeRequest = row.original;
        const isProcessing = processingId === changeRequest.id;

        if (isProcessing) {
          return <Skeleton className="h-5 w-40" />;
        }

        const oldValue = row.getValue("oldValue") as string;
        const displayValue = formatDisplayValue(oldValue);
        return (
          <div className="max-w-[200px] truncate" title={displayValue}>
            {displayValue || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "newValue",
      header: "Nouvelle valeur",
      cell: ({ row }) => {
        const changeRequest = row.original;
        const isProcessing = processingId === changeRequest.id;

        if (isProcessing) {
          return <Skeleton className="h-5 w-40" />;
        }

        const newValue = row.getValue("newValue") as string;
        const displayValue = formatDisplayValue(newValue);
        return (
          <div
            className="max-w-[200px] truncate font-medium text-green-600"
            title={displayValue}
          >
            {displayValue || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "changedBy",
      header: "Modifié par",
      cell: ({ row }) => {
        const changeRequest = row.original;
        const isProcessing = processingId === changeRequest.id;

        if (isProcessing) {
          return <Skeleton className="h-5 w-28" />;
        }

        const changedBy = row.getValue("changedBy") as string;
        return <span>{changedBy}</span>;
      },
    },
    {
      accessorKey: "dateModified",
      header: ({ column }) => (
        <Button
          variant="link"
          className="p-0 m-0 border-none shadow-none text-inherit hover:no-underline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date de modification
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const changeRequest = row.original;
        const isProcessing = processingId === changeRequest.id;

        if (isProcessing) {
          return <Skeleton className="h-5 w-36" />;
        }

        const rawDate = row.getValue("dateModified");
        if (!rawDate || typeof rawDate !== "string") return "-";
        const date = new Date(rawDate);
        return isNaN(date.getTime())
          ? "-"
          : date.toLocaleDateString("fr-FR") +
              " " +
              date.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              });
      },
      sortingFn: "datetime",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const changeRequest = row.original;
        const isProcessing = processingId === changeRequest.id;

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => onAccept(changeRequest)}
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
              onClick={() => onReject(changeRequest.id)}
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
        );
      },
    },
  ];

  return baseColumns;
};
