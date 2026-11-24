"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { Maximize2, X } from "lucide-react";

/** Show the original frame on demand; never recolour or simulate a finish. */
export default function ProjectPhoto({ src, alt, caption, sizes = "(max-width: 768px) 100vw, 50vw" }: {
  src: string;
  alt: string;
  caption: string;
  sizes?: string;
}) {
  return (
    <figure>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button type="button" aria-label={`Powiększ zdjęcie: ${caption}`} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900">
            <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-bottom transition-transform motion-safe:group-hover:scale-105" />
            <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-zinc-950 shadow-sm" aria-hidden="true"><Maximize2 className="h-4 w-4" />Powiększ</span>
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/85" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%_-_2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6 max-h-[94dvh]">
            <Dialog.Title className="pr-12 text-lg font-semibold text-zinc-950">{caption}</Dialog.Title>
            <Dialog.Description className="mt-2 pr-10 text-sm text-zinc-600">Pełny kadr zdjęcia. Kolor na ekranie może różnić się od rzeczywistej próbki.</Dialog.Description>
            <div className="relative mt-4 h-[65dvh]">
              <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 95vw, 1000px" quality={85} className="object-contain" />
            </div>
            <Dialog.Close className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-900" aria-label="Zamknij zdjęcie"><X aria-hidden="true" className="h-5 w-5" /></Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <figcaption className="mt-3 text-sm leading-relaxed text-zinc-600">{caption}</figcaption>
    </figure>
  );
}
