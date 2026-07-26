"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { upsertArticle } from "@/lib/actions";
import { Button, Field, inputClass } from "@/components/admin/ui";

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
  canPublish: boolean;
};

export default function ArticleForm({ article, categories, canPublish }: Props) {
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

      <Field label="Title">
        <input name="title" defaultValue={article?.title} required className={inputClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category">
          <select name="categorySlug" defaultValue={article?.category.slug} required className={inputClass}>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Author">
          <input name="author" defaultValue={article?.author} required className={inputClass} />
        </Field>
      </div>

      <Field label="Image URL">
        <input name="imageUrl" type="url" defaultValue={article?.imageUrl ?? ""} className={inputClass} />
      </Field>

      <Field label="Excerpt">
        <textarea name="excerpt" defaultValue={article?.excerpt} required rows={2} className={inputClass} />
      </Field>

      <Field label="Body" hint="Separate paragraphs with a blank line">
        <textarea name="body" defaultValue={article?.body} required rows={12} className={`${inputClass} font-mono`} />
      </Field>

      <Field label="Status">
        <select name="status" defaultValue={article?.status ?? "draft"} className={`${inputClass} sm:w-48`}>
          <option value="draft">Draft</option>
          {canPublish && <option value="published">Published</option>}
        </select>
      </Field>
      {!canPublish && (
        <p className="text-xs text-amber-700">
          You can save drafts only — publishing requires the <code className="rounded bg-amber-50 px-1">articles.publish</code> permission.
        </p>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending} icon={Save}>
          {pending ? "Saving…" : article ? "Save changes" : "Create article"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/articles")}>Cancel</Button>
      </div>
    </form>
  );
}
