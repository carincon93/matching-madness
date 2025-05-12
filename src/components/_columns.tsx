import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import type { Pair } from "@/data/pairs";

export const columns: ColumnDef<Pair>[] = [
  {
    id: "Word",
    accessorFn: (row) => row.word,
    header: ({ column }) => {
      return (
        <Button
          className="!pl-0 text-xs uppercase text-black"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Word
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ getValue }) => (
      <div className="uppercase">{getValue() as string}</div>
    ),
  },
];
