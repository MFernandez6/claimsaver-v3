export function ProductVideo({
  src,
  title,
  caption,
}: {
  src: string;
  title: string;
  caption: string;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-lg dark:border-slate-700">
      <video
        className="aspect-video w-full bg-black"
        controls
        playsInline
        preload="metadata"
        title={title}
      >
        <source src={src} type="video/mp4" />
        <a href={src} className="text-teal-400 underline">
          {title}
        </a>
      </video>
      <figcaption className="bg-white px-4 py-3 text-sm leading-relaxed text-slate-600 dark:bg-slate-900 dark:text-slate-300">
        {caption}
      </figcaption>
    </figure>
  );
}
