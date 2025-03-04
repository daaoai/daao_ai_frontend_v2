'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/components/ui/table';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table';

type Asset = {
  token: string;
  // tokenIcon?: string
  balance: number;
  price: number;
  totalValue: number;
};

interface AssetTableProps {
  columns: ColumnDef<Asset>[];
  data: Asset[];
}

///

export function AssetTable({ columns, data }: AssetTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4 text-center rounded-md border-none w-full pb-4">
      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className={`border-none mb-2 text-yellow text-semibold`}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className={`mb-2 text-yellow text-normal text-left text-xl`}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="!border-none">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-left text-base md:text-lg w-min ">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="!border-none">
              <TableCell colSpan={columns.length} className="text-center py-4">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
