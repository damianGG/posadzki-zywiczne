"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";

/** Native modal: no dialog library or large image request until the user opens a photo. */
export default function ProjectPhoto({ src, alt, caption, sizes = "(max-width: 768px) 100vw, 50vw" }: {
  src: string;
  alt: string;
  caption: string;
  sizes?: string;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [opened, setOpened] = useState(false);

  function openPhoto() {
    if (!dialog.current || dialog.current.open) return;
    dialog.current.showModal();
    setOpened(true);
  }

  return (
    <figure>
      <button ref={trigger} type="button" aria-haspopup="dialog" aria-label={`Powiększ zdjęcie: ${caption}`} onClick={openPhoto} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-bottom transition-transform motion-safe:group-hover:scale-105" />
        <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-zinc-950 shadow-sm" aria-hidden="true"><Maximize2 className="h-4 w-4" />Powiększ</span>
      </button>
      <dialog ref={dialog} aria-labelledby={titleId} aria-describedby={descriptionId} onClose={() => {
        setOpened(false);
        trigger.current?.focus({ preventScroll: true });
      }} onClick={event => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }} className="fixed inset-0 m-auto w-[calc(100%_-_2rem)] max-w-5xl max-h-[94dvh] overflow-y-auto rounded-2xl bg-white p-0 text-zinc-950 shadow-xl backdrop:bg-black/85">
        <div className="relative p-4 sm:p-6">
          <h2 id={titleId} className="pr-12 text-lg font-semibold text-zinc-950">{caption}</h2>
          <p id={descriptionId} className="mt-2 pr-10 text-sm text-zinc-600">Pełny kadr zdjęcia. Kolor na ekranie może różnić się od rzeczywistej próbki.</p>
          <button type="button" onClick={() => dialog.current?.close()} className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-900" aria-label="Zamknij zdjęcie"><X aria-hidden="true" className="h-5 w-5" /></button>
          <div className="relative mt-4 h-[65dvh]">
            {opened && <Image src={src} alt={alt} fill loading="eager" sizes="(max-width: 1024px) 95vw, 1000px" quality={90} className="object-contain" />}
          </div>
          <a href={src} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4">Otwórz zdjęcie w pełnym rozmiarze (nowa karta)</a>
        </div>
      </dialog>
      <figcaption className="mt-3 text-sm leading-relaxed text-zinc-600">{caption}</figcaption>
    </figure>
  );
}
