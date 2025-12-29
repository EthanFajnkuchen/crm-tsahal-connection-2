import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings2, GripVertical } from "lucide-react";
import {
  AVAILABLE_COLUMNS,
  ColumnKey,
  ColumnConfig,
} from "./lead-columns.config.tsx";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ColumnSettingsProps {
  visibleColumns: ColumnKey[];
  onColumnsChange: (columns: ColumnKey[]) => void;
}

function SortableColumnItem({
  column,
  isVisible,
  onToggle,
}: {
  column: ColumnConfig;
  isVisible: boolean;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Actions column cannot be hidden or reordered
  const isActionsColumn = column.key === "actions";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 border rounded-md bg-background"
    >
      {!isActionsColumn && (
        <div {...attributes} {...listeners} className="cursor-move">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <Checkbox
        id={column.key}
        checked={isVisible}
        onCheckedChange={onToggle}
        disabled={isActionsColumn}
      />
      <label
        htmlFor={column.key}
        className="flex-1 text-sm cursor-pointer select-none"
      >
        {column.label}
      </label>
    </div>
  );
}

export function ColumnSettings({
  visibleColumns,
  onColumnsChange,
}: ColumnSettingsProps) {
  const [open, setOpen] = useState(false);
  const [orderedColumns, setOrderedColumns] = useState<ColumnConfig[]>(
    () => {
      // Order columns based on visibleColumns order
      const columnsMap = new Map(
        AVAILABLE_COLUMNS.map((col) => [col.key, col])
      );
      const ordered: ColumnConfig[] = [];

      // Add visible columns in order
      visibleColumns.forEach((key) => {
        const col = columnsMap.get(key);
        if (col) {
          ordered.push(col);
          columnsMap.delete(key);
        }
      });

      // Add remaining columns
      columnsMap.forEach((col) => ordered.push(col));

      return ordered;
    }
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedColumns((items) => {
        const oldIndex = items.findIndex((item) => item.key === active.id);
        const newIndex = items.findIndex((item) => item.key === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Update visible columns with new order
        const newVisibleColumns = newOrder
          .filter((col) => visibleColumns.includes(col.key))
          .map((col) => col.key);
        onColumnsChange(newVisibleColumns);

        return newOrder;
      });
    }
  };

  const handleToggle = (columnKey: ColumnKey) => {
    if (columnKey === "actions") return; // Actions column is always visible

    const newVisibleColumns = visibleColumns.includes(columnKey)
      ? visibleColumns.filter((key) => key !== columnKey)
      : [...visibleColumns, columnKey];

    onColumnsChange(newVisibleColumns);
  };

  const handleResetToDefault = () => {
    const defaultColumns = AVAILABLE_COLUMNS.filter(
      (col) => col.defaultVisible
    ).map((col) => col.key);
    onColumnsChange(defaultColumns);
    setOrderedColumns(AVAILABLE_COLUMNS);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Colonnes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gérer les colonnes</DialogTitle>
          <DialogDescription>
            Cochez/décochez pour afficher/masquer les colonnes. Glissez-déposez
            pour réorganiser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedColumns.map((col) => col.key)}
              strategy={verticalListSortingStrategy}
            >
              {orderedColumns.map((column) => (
                <SortableColumnItem
                  key={column.key}
                  column={column}
                  isVisible={visibleColumns.includes(column.key)}
                  onToggle={() => handleToggle(column.key)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button variant="outline" size="sm" onClick={handleResetToDefault}>
            Réinitialiser par défaut
          </Button>
          <Button onClick={() => setOpen(false)}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
