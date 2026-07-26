import { Filter, RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import { Button, inputClass } from "@/components/admin/ui";

export type FilterOption = {
  value: string;
  label: string;
};

export type TableFilter = {
  name: string;
  label: string;
  value: string;
  options: FilterOption[];
};

export type TableSort = {
  value: string;
  label: string;
};

type Props = {
  action: string;
  search?: string;
  searchPlaceholder?: string;
  filters?: TableFilter[];
  sort?: string;
  sortOptions?: TableSort[];
  defaultSort?: string;
  resultCount: number;
};

/**
 * Shared server-rendered toolbar for admin collections. The URL remains the
 * source of truth, so filters work with refresh, links, and browser history.
 */
export function DataTableToolbar({
  action,
  search = "",
  searchPlaceholder = "Search...",
  filters = [],
  sort,
  sortOptions = [],
  defaultSort,
  resultCount,
}: Props) {
  const hasFilters = Boolean(
    search ||
      filters.some((filter) => filter.value) ||
      (sort && defaultSort && sort !== defaultSort),
  );

  return (
    <form method="get" action={action} className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Search</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className={`${inputClass} pl-9`}
            />
          </span>
        </label>

        {filters.map((filter) => (
          <label key={filter.name} className="min-w-40">
            <span className="mb-1 block text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
              {filter.label}
            </span>
            <select name={filter.name} defaultValue={filter.value} className={inputClass}>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}

        {sortOptions.length > 0 && (
          <label className="min-w-44">
            <span className="mb-1 block text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
              Sort by
            </span>
            <select name="sort" defaultValue={sort} className={inputClass}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" icon={Filter}>
            Apply
          </Button>
          {hasFilters && (
            <Link
              href={action}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              <RotateCcw className="size-3.5" />
              Clear
            </Link>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>
          <strong className="text-slate-700">{resultCount}</strong> matching {resultCount === 1 ? "record" : "records"}
        </span>
        <span>15 records per page</span>
      </div>
    </form>
  );
}
