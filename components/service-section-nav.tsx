import Link from "next/link";

type SectionLink = { href: string; label: string };

/** Mobile: visible links in an in-page index rather than a second sticky header. */
export default function ServiceSectionNav({ items, quoteHref }: { items: SectionLink[]; quoteHref: string }) {
  return (
    <nav aria-label="Na tej stronie" className="border-y bg-white lg:sticky lg:top-[83px] lg:z-30 lg:bg-white/95 lg:backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <p className="mb-1 text-sm font-semibold lg:sr-only">Na tej stronie</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {items.map(item => <a key={item.href} href={item.href} className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium hover:bg-muted focus-visible:outline focus-visible:outline-2">{item.label}</a>)}
          <Link href={quoteHref} className="brand-button inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold lg:ml-auto">Poproś o wycenę</Link>
        </div>
      </div>
    </nav>
  );
}
