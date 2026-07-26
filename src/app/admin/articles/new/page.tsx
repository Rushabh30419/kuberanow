import Link from "next/link";
import ArticleForm from "../ArticleForm";
import { getCategories } from "@/lib/data-access";

export default async function NewArticlePage() {
  const categories = await getCategories();
  return (
    <div>
      <Link href="/admin/articles" className="text-xs text-slate-500 hover:text-slate-900">
        ← Back to articles
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">New article</h1>
      <div className="mt-6 max-w-2xl rounded-xl border border-slate-200 bg-white p-6">
        <ArticleForm categories={categories} />
      </div>
    </div>
  );
}
