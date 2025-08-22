import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import Loading from "./Loading";

interface TableProps<DType> {
  data: DType[];
  columns: ColumnDef<DType, any>[];
  rowCount: number;
  isLoading?: boolean;
  emptyTableChild?: React.ReactNode;
}

const Table = ({
  data,
  columns,
  isLoading,
  emptyTableChild
}: TableProps<any>) => {
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-1 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {!isLoading ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-1 sm:px-3 py-4 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="py-96">
                <td className="py-40" colSpan={6} rowSpan={5}>
                  <Loading />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {table.getRowModel().rows.length === 0 && !isLoading && emptyTableChild}
    </div>
  );
};
Table.displayName = "Table";

export default Table;
