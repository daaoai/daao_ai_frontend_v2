"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Check, X } from "lucide-react"

export const DashboardColumns: ColumnDef<dashboardData>[] = [
  {
    accessorKey: "address",
    header: "Wallet Address",
    cell: ({ row }) => (
      <div className="text-[#498ff8] text-sm font-normal font-['Work Sans'] leading-normal tracking-tight">
        {row.getValue("address")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          className="bg-[#121212] text-[#39db83] hover:bg-[#1a1a1a] hover:text-[#39db83] flex justify-center items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Accept
        </Button>
        <Button
          variant="outline"
          className="bg-[#121212] text-[#ff6961] hover:bg-[#1a1a1a] hover:text-[#ff6961] flex justify-center items-center gap-2"
        >
          <X className="w-4 h-4" />
          Reject
        </Button>
      </div>
    ),
  },
]
