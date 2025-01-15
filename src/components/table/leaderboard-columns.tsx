"use client"

import { EthereumIcon } from "@/assets/icons/ethereum-icon"
import { workSans } from "@/lib/fonts"
import { leaderboardData } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
// import Image from "next/image"

export const LeaderboardColumns: ColumnDef<leaderboardData>[] = [
  {
    accessorKey: "name",
    header: "DAO",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row justify-start items-center gap-2">
          <div className="bg-white h-10 w-10">
            {/*<Image
              src={row.getValue("icon")}
              alt="DAO icon"
            />*/}
          </div>
          <p className={`text-xs font-medium ${workSans.className} leading-[18px] tracking-wide`}>{row.getValue("name")}</p>
        </div>
      )
    }
  },
  {
    accessorKey: "creator",
    header: "Creator",
    cell: ({ row }) => {
      return (
        <p>@{row.getValue("creator")}</p>
      )
    }
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row justify-start items-center gap-2">
          <EthereumIcon />
          <p>{row.getValue("price")}</p>
        </div>
      )
    }
  },
  {
    accessorKey: "dayVol",
    header: "24H Vol",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row justify-start items-center gap-2">
          <EthereumIcon />
          <p>{row.getValue("dayVol")}</p>
        </div>
      )
    }

  },
  {
    accessorKey: "marketCap",
    header: "Mcap",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row justify-start items-center gap-2">
          <EthereumIcon />
          <p className={true ? `text-[#39db83]` : `text-[#d83939]`}>{true ? '+' : '-'}{row.getValue("marketCap")}</p>
        </div>
      )
    }

  }
]
