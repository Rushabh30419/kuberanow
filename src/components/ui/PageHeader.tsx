type Props = {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
};

export function PageHeader({ title, subtitle, breadcrumb }: Props) {
  return (
    <section className="bg-gradient-to-r from-dark-navy2 to-primary-navy w-full border-b border-[#00FFEE] px-4 py-10 text-white sm:py-14">
      <div className="mx-auto max-w-7xl">
        {breadcrumb && (
          <p className="text-xs font-medium tracking-widest text-[#00FFEE] uppercase">
            {breadcrumb}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
