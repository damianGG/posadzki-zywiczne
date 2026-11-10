import Image from "next/image";
import { Camera } from "lucide-react";

/**
 * A documented photo placement. Until a verified photo is supplied, we show an
 * explicit editorial brief rather than an unrelated stock photo or fabricated
 * before/after evidence.
 */
type EditorialPhotoSlotProps = {
  shot: string;
  label: string;
  src?: string | null;
  alt?: string;
  caption?: string;
  aspect?: "wide" | "landscape" | "square";
  sizes?: string;
  className?: string;
};

const aspectClasses = {
  wide: "aspect-[16/9]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
} as const;

export default function EditorialPhotoSlot({
  shot,
  label,
  src,
  alt,
  caption,
  aspect = "landscape",
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
}: EditorialPhotoSlotProps) {
  const hasVerifiedPhoto = Boolean(src && alt);

  return (
    <figure className={`overflow-hidden rounded-2xl border border-zinc-200 bg-white ${className}`}>
      <div className={`relative overflow-hidden ${aspectClasses[aspect]}`}>
        {hasVerifiedPhoto ? (
          <Image
            src={src!}
            alt={alt!}
            fill
            sizes={sizes}
            className="object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label={`Miejsce na zdjęcie: ${shot}`}
            className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-100 via-zinc-200/70 to-zinc-100 px-6 text-center text-zinc-700"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full border-[28px] border-white/30" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full border-[28px] border-white/30" aria-hidden="true" />
            <Camera className="relative h-7 w-7 text-zinc-500" strokeWidth={1.5} aria-hidden="true" />
            <span className="relative mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-600">Miejsce na autentyczne zdjęcie</span>
            <span className="relative mt-2 max-w-xs text-sm font-medium leading-relaxed sm:text-base">{shot}</span>
          </div>
        )}
      </div>
      <figcaption className="p-4">
        <p className="text-sm font-semibold text-zinc-950">{label}</p>
        {caption && <p className="mt-1 text-xs leading-relaxed text-zinc-600">{caption}</p>}
      </figcaption>
    </figure>
  );
}
