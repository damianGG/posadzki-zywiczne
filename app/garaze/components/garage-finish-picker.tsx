"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { findPlace } from "@/lib/visual-offers";

const garage = findPlace("garaz");
const finishes = garage?.looks ?? [];

const colors = [
  { name: "Jasny szary", ral: "RAL 7035", hex: "#d7d9d3" },
  { name: "Szary", ral: "RAL 7040", hex: "#9da3a6" },
  { name: "Antracyt", ral: "RAL 7016", hex: "#383e43" },
  { name: "Beżowoszary", ral: "RAL 1019", hex: "#a89b86" },
] as const;

export default function GarageFinishPicker() {
  const [finishId, setFinishId] = useState(finishes[0]?.id ?? "platki");
  const [colorId, setColorId] = useState<(typeof colors)[number]["ral"]>("RAL 7035");
  const selectedFinish = finishes.find((item) => item.id === finishId) ?? finishes[0];
  const selectedColor = colors.find((item) => item.ral === colorId) ?? colors[0];

  if (!selectedFinish) return null;

  return (
    <section id="wykonczenia" aria-labelledby="wykonczenia-heading" className="bg-zinc-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Zaprojektuj wygląd</p>
          <h2 id="wykonczenia-heading" className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Wybierz wygląd na prawdziwym zdjęciu
          </h2>
          <p className="mt-4 leading-relaxed text-zinc-600">
            To wykonane garaże, nie próbka narysowana na ekranie. Kolor RAL tylko naprowadza — odcień potwierdzamy na miejscu.
          </p>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {finishes.map((finish, index) => {
            const active = finish.id === finishId;
            return (
              <button
                key={finish.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFinishId(finish.id)}
                className={"group overflow-hidden rounded-2xl border text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900 " +
                  (active ? "border-zinc-900 bg-white shadow-sm" : "border-zinc-200 bg-white/70 hover:border-zinc-400")}
              >
                <span className="relative block aspect-[4/3] bg-zinc-200">
                  {finish.image && (
                    <Image src={finish.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  )}
                </span>
                <span className="block p-5">
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">0{index + 1}</span>
                    <span className={"flex h-7 w-7 items-center justify-center rounded-full border " + (active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-transparent")}>
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="mt-3 block text-xl font-semibold tracking-tight text-zinc-900">{finish.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-zinc-600">{finish.description}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid overflow-hidden rounded-2xl border border-zinc-200 bg-white lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[280px] sm:min-h-[420px]">
            {selectedFinish.image && (
              <Image src={selectedFinish.image} alt={selectedFinish.alt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
            )}
            <div className="absolute bottom-4 left-4 right-4 max-w-sm rounded-xl bg-white/92 p-4 shadow-sm backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Zdjęcie realizacji</p>
              <p className="mt-1 text-lg font-semibold text-zinc-950">{selectedFinish.title}</p>
              <p className="mt-1 text-sm text-zinc-700">{selectedFinish.caption}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-6 sm:p-10">
            <div>
              <h3 className="text-xl font-semibold text-zinc-950">Kolor tylko jako kierunek</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                {selectedFinish.detail} Wstępny odcień możesz zaznaczyć poniżej. Ekran nie zastąpi próbki.
              </p>
              <div className="mt-7 grid grid-cols-4 gap-3" role="group" aria-label="Wybór koloru posadzki">
                {colors.map((color) => (
                  <button key={color.ral} type="button" onClick={() => setColorId(color.ral)} aria-pressed={colorId === color.ral}
                    className="min-w-0 rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                    title={color.name + " " + color.ral}>
                    <span className={"block h-14 w-full rounded-lg border-2 " + (colorId === color.ral ? "border-zinc-950 ring-2 ring-zinc-300 ring-offset-2" : "border-zinc-200")}
                      style={{ backgroundColor: color.hex }} />
                    <span className="mt-2 block text-center text-xs font-medium text-zinc-700">{color.ral}</span>
                  </button>
                ))}
              </div>
              <p className="mt-6 text-sm text-zinc-600">Wybrany kierunek: {selectedColor.name} · {selectedColor.ral}</p>
            </div>
            <Link href={"/zamow?miejsce=garaz&wyglad=" + selectedFinish.id} className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-zinc-950 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-700">
              Wyceń ten wygląd <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
