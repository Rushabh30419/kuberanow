"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertArticle } from "@/lib/actions";

type Category = { id: string; slug: string; name: string };

type Props = {
  article?: {
    id: string;
    title: string;
    excerpt: string;
    body: string;
    imageUrl: string | null;
    author: string;
    status: string;
    category: { slug: string };
  };
  categories: Category[];
};

export default function ArticleForm({ article, categories }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={(fd) =>
        start(async () => {
          setError(null);
          const res = await upsertArticle(fd);
          if (res.ok) {
            router.push("/admin/articles");
            router.refresh();
          } else {
            setError(res.error ?? "Save failed.");
          }
        })
      }
      className="space-y-5"
    >
      {article && <input type="hidden" name="id" value={article.id} />}

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700">Title</label>
        <input
          name="title"
          defaultValue={article?.title}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">Category</label>
          <select
            name="categorySlug"
            defaultValue={article?.category.slug}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">Author</label>
          <input
            name="author"
            defaultValue={article?.author}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700">Image URL</label>
        <input
          name="imageUrl"
          type="url"
          defaultValue={article?.imageUrl ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700">Excerpt</label>
        <textarea
          name="excerpt"
          defaultValue={article?.excerpt}
          required
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700">Body</label>
        <textarea
          name="body"
          defaultValue={article?.body}
          required
          rows={12}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-slate-500">Separate paragraphs with a blank line.</p>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700">Status</label>
        <select
          name="status"
          defaultValue={article?.status ?? "draft"}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 sm:w-48"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {pending ? "Saving…" : article ? "Save changes" : "Create article"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/articles")}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
