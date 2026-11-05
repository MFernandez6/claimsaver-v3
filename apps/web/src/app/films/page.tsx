import { REVIEW_FILMS } from "@/content/films";

export default function FilmsPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-xl space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-400">
            Internal review
          </p>
          <h1 className="mt-2 text-3xl font-bold">Films</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            OWNER / SUPPORT only. Not indexed. Watch on your phone — sign in first.
          </p>
        </header>
        <ol className="space-y-8">
          {REVIEW_FILMS.map((film) => (
            <li key={film.slug} id={film.slug} className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold">{film.title}</h2>
                <p className="text-sm text-slate-400">{film.note}</p>
              </div>
              <video
                className="w-full rounded-xl bg-black"
                controls
                playsInline
                preload="metadata"
                src={film.src}
              >
                <a href={film.src} className="text-teal-400 underline">
                  Download {film.title}
                </a>
              </video>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
