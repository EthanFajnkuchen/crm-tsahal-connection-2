import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { GripVertical } from "lucide-react";
import {
  MahzorColumnKey,
  AVAILABLE_MAHZOR_COLUMNS,
} from "./mahzor-columns.config";

interface ColumnSettingsProps {
  visibleColumns: MahzorColumnKey[];
  onColumnsChange: (columns: MahzorColumnKey[]) => void;
}

interface SortableItemProps {
  id: string;
  label: string;
  isVisible: boolean;
  onToggle: (id: string) => void;
}

function SortableItem({ id, label, isVisible, onToggle }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 bg-background border rounded-md"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Checkbox
        id={id}
        checked={isVisible}
        onCheckedChange={() => onToggle(id)}
      />
      <Label htmlFor={id} className="flex-1 cursor-pointer">
        {label}
      </Label>
    </div>
  );
}

export function MahzorColumnSettings({
  visibleColumns,
  onColumnsChange,
}: ColumnSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localColumns, setLocalColumns] =
    useState<MahzorColumnKey[]>(visibleColumns);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localColumns.indexOf(active.id as MahzorColumnKey);
      const newIndex = localColumns.indexOf(over.id as MahzorColumnKey);
      const newColumns = arrayMove(localColumns, oldIndex, newIndex);
      setLocalColumns(newColumns);
      onColumnsChange(newColumns);
    }
  };

  const handleToggle = (columnKey: string) => {
    const key = columnKey as MahzorColumnKey;
    if (localColumns.includes(key)) {
      const newColumns = localColumns.filter((col) => col !== key);
      setLocalColumns(newColumns);
      onColumnsChange(newColumns);
    } else {
      // Ajouter la colonne à la fin
      const newColumns = [...localColumns, key];
      setLocalColumns(newColumns);
      onColumnsChange(newColumns);
    }
  };

  const allColumnKeys = AVAILABLE_MAHZOR_COLUMNS.map((col) => col.key);
  const sortedKeys = [
    ...localColumns,
    ...allColumnKeys.filter((key) => !localColumns.includes(key)),
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Colonnes
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Gérer les colonnes</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          <p className="text-sm text-muted-foreground mb-4">
            Glissez pour réorganiser, cochez pour afficher/masquer
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedKeys}
              strategy={verticalListSortingStrategy}
            >
              {sortedKeys.map((key) => {
                const column = AVAILABLE_MAHZOR_COLUMNS.find(
                  (col) => col.key === key
                );
                if (!column) return null;
                return (
                  <SortableItem
                    key={key}
                    id={key}
                    label={column.label}
                    isVisible={localColumns.includes(key)}
                    onToggle={handleToggle}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      </SheetContent>
    </Sheet>
  );
}
