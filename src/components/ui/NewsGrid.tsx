import Link from "next/link";
import Image from "next/image";

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug?: string; // when set, cards link to /news/<categorySlug>/<slug>
  author: string;
  date: string;
  readTime: string;
  gradient?: string; // tailwind gradient classes for the placeholder thumbnail
  image: string;
};

type Props = {
  articles: NewsArticle[];
  categorySlug?: string;
};

export function NewsGrid({ articles, categorySlug }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a) => {
        const slug = categorySlug ?? a.categorySlug;
        const href = slug ? `/news/${slug}/${a.slug}` : undefined;

        const inner = (
          <>
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
              {a.image ? (
                <Image
                  src={a.image}
                  alt={a.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className={`h-full w-full ${a.gradient ?? "bg-slate-200"}`} />
              )}
              <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-700 uppercase backdrop-blur">
                {a.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-700">
                {a.title}
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                {a.excerpt}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                <span className="font-medium text-slate-700">{a.author}</span>
                <span aria-hidden>·</span>
                <span>{a.date}</span>
                <span aria-hidden>·</span>
                <span>{a.readTime}</span>
              </div>
            </div>
          </>
        );

        const cls =
          "group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md";

        return href ? (
          <Link key={a.slug} href={href} className={cls}>
            {inner}
          </Link>
        ) : (
          <article key={a.slug} className={cls}>
            {inner}
          </article>
        );
      })}
    </div>
  );
}
