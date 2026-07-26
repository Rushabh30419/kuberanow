import { PlusCircle, LineChart } from "lucide-react";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/auth-guard";
import { getUserPermissions } from "@/lib/data-access";
import {
  PageHeader,
  ButtonLink,
  EmptyState,
} from "@/components/admin/ui";
import { Pagination } from "@/components/admin/Pagination";
import { DataTableToolbar, type TableSort } from "@/components/admin/DataTableToolbar";
import {
  PAGE_SIZE,
  buildListHref,
  clampPage,
  parseChoice,
  parsePage,
  parseParam,
} from "@/lib/pagination";
import MarketTable, { CATEGORY_LABELS } from "./MarketTable";

const CATEGORY_KEYS = ["", "index", "stock", "mutual_fund", "ipo", "commodity", "crypto"] as const;
type CategoryValue = (typeof CATEGORY_KEYS)[number];

const MOVEMENT_VALUES = ["", "up", "down", "flat"] as const;
type MovementValue = (typeof MOVEMENT_VALUES)[number];

const SORT_OPTIONS: readonly TableSort[] = [
  { value: "sortOrder", label: "Configured order" },
  { value: "symbol_asc", label: "Symbol A–Z" },
  { value: "price_desc", label: "Price (high → low)" },
  { value: "price_asc", label: "Price (low → high)" },
  { value: "change_desc", label: "Biggest gainers" },
  { value: "change_asc", label: "Biggest losers" },
  { value: "updated_desc", label: "Recently updated" },
] as const;

const SORT_DEFAULT = "sortOrder";
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function buildOrderBy(sort: SortValue): Prisma.MarketQuoteOrderByWithRelationInput {
  switch (sort) {
    case "symbol_asc":
      return { symbol: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "price_asc":
      return { price: "asc" };
    case "change_desc":
      return { change: "desc" };
    case "change_asc":
      return { change: "asc" };
    case "updated_desc":
      return { updatedAt: "desc" };
    case "sortOrder":
    default:
      return { category: "asc" };
  }
}

const PATH = "/admin/market";

export default async function MarketAdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requirePermission("market.view");
  const perms = await getUserPermissions(user.id);
  const canEdit = perms.includes("market.edit");
  const sp = await searchParams;

  const q = parseParam(sp.q);
  const category = parseChoice<CategoryValue>(sp.category, CATEGORY_KEYS, "");
  const movement = parseChoice<MovementValue>(sp.movement, MOVEMENT_VALUES, "");
  const sort = parseChoice<SortValue>(sp.sort, SORT_OPTIONS.map((o) => o.value), SORT_DEFAULT);
  const requestedPage = parsePage(sp.page);
  const orderBy = buildOrderBy(sort);

  const where: Prisma.MarketQuoteWhereInput = {
    ...(q
      ? {
          OR: [
            { symbol: { contains: q } },
            { name: { contains: q } },
            { volume: { contains: q } },
          ],
        }
      : {}),
    ...(category ? { category } : {}),
    ...(movement === "up"
      ? { change: { gt: 0 } }
      : movement === "down"
        ? { change: { lt: 0 } }
        : movement === "flat"
          ? { change: 0 }
          : {}),
  };

  const [quotes, total] = await Promise.all([
    prisma.marketQuote.findMany({
      where,
      orderBy,
      take: PAGE_SIZE,
      skip: (requestedPage - 1) * PAGE_SIZE,
    }),
    prisma.marketQuote.count({ where }),
  ]);

  const page = clampPage(requestedPage, total);
  const rows =
    page === requestedPage
      ? quotes
      : await prisma.marketQuote.findMany({
          where,
          orderBy,
          take: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
        });

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = Boolean(q || category || movement || sort !== SORT_DEFAULT);
  const params = { q, category, movement, sort };

  return (
    <div>
      <PageHeader
        title="Market data"
        subtitle="Edit price, change %, and volume. Changes appear on the live site immediately."
        actions={canEdit && <ButtonLink href="/admin/market/new" icon={PlusCircle}>Add quote</ButtonLink>}
      />

      <DataTableToolbar
        action={PATH}
        search={q}
        searchPlaceholder="Search symbol, name, or volume..."
        filters={[
          {
            name: "category",
            label: "Category",
            value: category,
            options: [
              { value: "", label: "All categories" },
              ...CATEGORY_KEYS.filter((c) => c !== "").map((c) => ({
                value: c,
                label: CATEGORY_LABELS[c] ?? c,
              })),
            ],
          },
          {
            name: "movement",
            label: "Movement",
            value: movement,
            options: [
              { value: "", label: "All movements" },
              { value: "up", label: "Gainers" },
              { value: "down", label: "Losers" },
              { value: "flat", label: "Unchanged" },
            ],
          },
        ]}
        sort={sort}
        defaultSort={SORT_DEFAULT}
        sortOptions={[...SORT_OPTIONS]}
        resultCount={total}
      />

      {rows.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={LineChart}
            title="No quotes match these filters"
            description="Try clearing the search or filters."
            action={
              <Link
                href={PATH}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear filters
              </Link>
            }
          />
        ) : (
          <EmptyState
            icon={LineChart}
            title="No market quotes yet"
            description="Add the first quote to start populating the market tables."
          />
        )
      ) : (
        <MarketTable quotes={rows} canEdit={canEdit} page={page} pageCount={pageCount} />
      )}

      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        hrefFor={(p) => buildListHref(PATH, params, p)}
      />
    </div>
  );
}
