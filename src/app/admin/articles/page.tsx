import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteArticle } from "@/lib/actions";
import DeleteButton from "../DeleteButton";

export default async function ArticlesList() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Articles</h1>
          <p className="mt-1 text-sm text-slate-500">{articles.length} total</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          + New article
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Title</th>
              <th className="hidden px-4 py-3 text-left font-semibold sm:table-cell">Category</th>
              <th className="hidden px-4 py-3 text-left font-semibold md:table-cell">Author</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/articles/${a.id}`} className="font-medium text-slate-900 hover:text-blue-700">
                    {a.title}
                  </Link>
                </td>
                <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">{a.category.name}</td>
                <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{a.author}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      a.status === "published"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Link
                      href={`/admin/articles/${a.id}`}
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={a.id} action={deleteArticle} label="Delete" />
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No articles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
