import Link from "next/link";

type Social = {
  title: string;
  href: string;
  src: string;
  alt: string;
};

export const SOCIALS: Social[] = [
  {
    title: "Instagram",
    href: "https://www.instagram.com/kuberanow",
    src: "/insta.svg",
    alt: "Instagram",
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61590120462544",
    src: "/fb.svg",
    alt: "Facebook",
  },
  {
    title: "X",
    href: "https://x.com/KuberaNow17430",
    src: "/x.svg",
    alt: "X",
  },
  {
    title: "YouTube",
    href: "https://www.youtube.com/@KuberaNow",
    src: "/yt.svg",
    alt: "YouTube",
  },
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/kubera-now-6407a93b6/",
    src: "/linkedin.svg",
    alt: "LinkedIn",
  },
];

export function SocialLinks({ iconSize = 26 }: { iconSize?: number }) {
  return (
    <div className="mt-0 flex flex-wrap items-center gap-1 xl:mt-2">
      {SOCIALS.map((s) => (
        <Link
          key={s.title}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          title={s.title}
          className="hover:opacity-80 transition-opacity block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.src}
            alt={s.alt}
            width={iconSize}
            height={iconSize}
            loading="lazy"
            className="inline-block"
          />
        </Link>
      ))}
    </div>
  );
}
