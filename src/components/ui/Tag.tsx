export function TagRow({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
      {tags.map((t) => (
        <li
          key={t}
          className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink2"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
