export function AdminPageHeader({
  kicker,
  title,
  description,
}: {
  kicker?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      {kicker ? (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
          {kicker}
        </p>
      ) : null}
      <h1 className="mt-1 break-words text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{title}</h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{description}</p>
      ) : null}
    </header>
  );
}
