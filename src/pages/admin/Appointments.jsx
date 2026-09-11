import { useEffect, useMemo, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import AdminLayout from "./AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import { formatRelativeTime } from "../../lib/formatRelativeTime";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function Appointments() {
  const [enquiries, setEnquiries] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const [globalFilter, setGlobalFilter] = useState("");

  const [columnFilters, setColumnFilters] = useState([]);

  // floating filter popup
  const [openFilter, setOpenFilter] = useState(null);

  const [filterValues, setFilterValues] = useState({});

  const [filterPosition, setFilterPosition] = useState({
    top: 0,
    left: 0,
  });

  const load = async () => {
    setLoading(true);

    const { data, error: fetchError } = await supabase

      .from("contact_enquiries")

      .select("*")

      .order("created_at", {
        ascending: false,
      });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setEnquiries(data || []);

      setError("");
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);

    const { error: deleteError } = await supabase

      .from("contact_enquiries")

      .delete()

      .eq("id", id);

    setDeletingId(null);

    if (deleteError) {
      setError(deleteError.message);

      return;
    }

    setEnquiries((previous) => previous.filter((item) => item.id !== id));
  };

  const applyColumnFilter = (columnId) => {
    const value = filterValues[columnId] || "";

    setColumnFilters((previous) => {
      const remaining = previous.filter((item) => item.id !== columnId);

      if (!value.trim()) {
        return remaining;
      }

      return [
        ...remaining,

        {
          id: columnId,
          value: value,
        },
      ];
    });

    setOpenFilter(null);
  };

  const clearColumnFilter = (columnId) => {
    setFilterValues((previous) => ({
      ...previous,

      [columnId]: "",
    }));

    setColumnFilters((previous) =>
      previous.filter((item) => item.id !== columnId),
    );

    setOpenFilter(null);
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },

      {
        accessorKey: "email",
        header: "Email",
      },

      {
        accessorKey: "phone",
        header: "Phone",
      },

      {
        accessorKey: "treatment",
        header: "Treatment",
      },

      {
        accessorKey: "appointment_date",
        header: "Appointment Date",
      },

      {
        accessorKey: "message",
        header: "Message",

        cell: ({ getValue }) => (
          <p
            className="
            max-w-[260px]
            line-clamp-3
          "
          >
            {getValue() || "-"}
          </p>
        ),
      },

      {
        accessorKey: "created_at",

        header: "Submitted",

        cell: ({ getValue }) => formatRelativeTime(getValue()),
      },

      {
        id: "action",

        header: "Action",

        enableColumnFilter: false,

        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleDelete(row.original.id)}
            disabled={deletingId === row.original.id}
            className="
              rounded-lg
              border
              border-[#f7c8d5]
              bg-[#fce8ee]
              px-3
              py-1.5
              text-xs
              font-semibold
              text-[#df2759]
              hover:bg-[#df2759]
              hover:text-white
              disabled:opacity-50
            "
          >
            {deletingId === row.original.id ? "Removing..." : "Remove"}
          </button>
        ),
      },
    ],

    [deletingId],
  );

  const table = useReactTable({
    data: enquiries,

    columns,

    state: {
      globalFilter,

      columnFilters,
    },

    onGlobalFilterChange: setGlobalFilter,

    onColumnFiltersChange: setColumnFilters,

    getCoreRowModel: getCoreRowModel(),

    getFilteredRowModel: getFilteredRowModel(),

    getSortedRowModel: getSortedRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <AdminLayout activeNav="appointments" pageTitle="Appointments">
      <div
        className="
        flex
        flex-col
        gap-[22px]
      "
      >
        <div>
          <h1
            className="
            font-heading
            text-[28px]
            font-bold
            text-[#101828]
          "
          >
            Appointment Enquiries
          </h1>

          <p
            className="
            mt-1
            font-body
            text-sm
            text-[#667085]
          "
          >
            Submissions from appointment form.
          </p>
        </div>

        {/* Global Search */}

        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="
            Search all columns...
          "
          className="
            h-12
            rounded-lg
            border
            border-[#d0d5dd]
            px-4
            text-sm
            outline-none
            focus:border-[#df2759]
          "
        />

        {loading ? (
          <p className="text-sm text-[#667085]">Loading...</p>
        ) : error ? (
          <p className="text-sm text-[#df2759]">{error}</p>
        ) : (
          <div
            className="
            overflow-x-auto
            rounded-xl
            border
            border-[#e4eae7]
            bg-white
          "
          >
            <table
              className="
              min-w-[1300px]
              w-full
              border-collapse
              
            "
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="
                        bg-[#f8faf9]
                      "
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="
    border
    border-[#e4e7ec]
    px-4
    py-4
    text-left
    text-sm
    text-[#344054]
    bg-[#f8faf9]
  "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className="
                                font-semibold
                              "
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}

                            {header.column.getIsSorted()
                              ? header.column.getIsSorted() === "asc"
                                ? " ↑"
                                : " ↓"
                              : ""}
                          </button>

                          {header.column.getCanFilter() && (
                            <button
                              type="button"
                              onClick={(e) => {
                                const rect =
                                  e.currentTarget.getBoundingClientRect();

                                setFilterPosition({
                                  top: rect.bottom + window.scrollY + 8,

                                  left: rect.left + window.scrollX,
                                });

                                setOpenFilter(
                                  openFilter === header.id ? null : header.id,
                                );
                              }}
                              className="
                                    flex
                                    h-6
                                    w-6
                                    items-center
                                    justify-center
                                    rounded
                                    text-accent
                                    text-xs
                                    hover:bg-gray-100
                                  "
                              title="Filter"
                            >
                              <FontAwesomeIcon
                                icon={faFilter}
                                className="text-[11px]"
                              />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="
                      border-t
                      border-[#eaecf0]
                    "
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="
    border
    border-[#e4e7ec]
    px-4
    py-4
    text-sm
    text-[#344054]
    align-top
  "
                      >
                        {flexRender(
                          cell.column.columnDef.cell ??
                            cell.column.columnDef.header,

                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Floating Filter Popup Outside Table */}

        {openFilter && (
          <div
            style={{
              position: "absolute",

              top: filterPosition.top,

              left: filterPosition.left,
            }}
            className="
                z-[9999]
                w-[240px]
                rounded-xl
                border
                border-[#e4e7ec]
                bg-white
                p-4
                shadow-xl
              "
          >
            <input
              value={filterValues[openFilter] || ""}
              onChange={(e) =>
                setFilterValues((previous) => ({
                  ...previous,

                  [openFilter]: e.target.value,
                }))
              }
              placeholder="Search..."
              className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-[#d0d5dd]
                  px-3
                  text-sm
                  outline-none
                  focus:border-[#df2759]
                "
            />

            <div
              className="
                  mt-3
                  flex
                  justify-end
                  gap-2
                "
            >
              <button
                type="button"
                onClick={() => clearColumnFilter(openFilter)}
                className="
                    rounded-lg
                    border
                    border-[#d0d5dd]
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                  "
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => applyColumnFilter(openFilter)}
                className="
                    rounded-lg
                    bg-[#df2759]
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-white
                  "
              >
                Filter
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}

        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="
              rounded-lg
              border
              px-4
              py-2
              text-sm
              disabled:opacity-50
            "
          >
            Previous
          </button>

          <span className="text-sm text-[#667085]">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="
              rounded-lg
              border
              px-4
              py-2
              text-sm
              disabled:opacity-50
            "
          >
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}