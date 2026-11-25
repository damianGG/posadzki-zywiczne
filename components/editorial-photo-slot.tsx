import Image from "next/image";


/**
 * Missing photographs stay in the editorial brief, never in the customer UI.
 */
type EditorialPhotoSlotProps = {
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
  label,
  src,
  alt,
  caption,
  aspect = "landscape",
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
}: EditorialPhotoSlotProps) {
  if (!src?.trim() || !alt?.trim()) return null;

  return (
    <figure className={`overflow-hidden rounded-2xl border border-zinc-200 bg-white ${className}`}>
      <div className={`relative overflow-hidden ${aspectClasses[aspect]}`}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
      <figcaption className="p-4">
        <p className="text-sm font-semibold text-zinc-950">{label}</p>
        {caption && <p className="mt-1 text-sm leading-relaxed text-zinc-600">{caption}</p>}
      </figcaption>
    </figure>
  );
}
