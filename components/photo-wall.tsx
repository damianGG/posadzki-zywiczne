import Image from "next/image";
import Link from "next/link";
import { portfolioShots } from "@/lib/visual-offers";

export default function PhotoWall() {
  return (
    <section aria-labelledby="photo-wall-heading" className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Prawdziwe zdjęcia</p>
            <h2 id="photo-wall-heading" className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Tak wyglądają wykonane posadzki.
            </h2>
            <p className="mt-3 text-zinc-600">Garaże, tarasy, balkony i schody. Bez wizualizacji z katalogu.</p>
          </div>
          <Link href="/galeria" className="text-sm font-semibold text-zinc-950 underline underline-offset-4">
            Cała galeria
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {portfolioShots.map((shot, index) => (
            <Link
              key={shot.src}
              href={shot.href}
              className={
                "group relative block overflow-hidden rounded-2xl bg-zinc-100 " +
                (index === 0 ? "col-span-2 aspect-[16/10] lg:row-span-2 lg:aspect-auto lg:min-h-[420px]" : "aspect-[4/3]")
              }
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes={index === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-sm font-medium text-white">
                {shot.caption}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
