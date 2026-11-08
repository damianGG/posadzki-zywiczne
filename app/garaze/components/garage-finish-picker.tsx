"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

const finishes = [
  {
    id: "platki",
    title: "Płatki dekoracyjne",
    eyebrow: "Dekoracyjna",
    description: "Delikatna mozaika na powierzchni. Dobry wybór, gdy chcesz połączyć estetykę z codziennym użytkowaniem garażu.",
    detail: "Wielkość i gęstość płatków ustalamy przy doborze próbki.",
  },
  {
    id: "gladka",
    title: "Jednolita i gładka",
    eyebrow: "Minimalistyczna",
    description: "Spokojna, jednolita powierzchnia, która podkreśla prostą architekturę garażu.",
    detail: "Gładkie wykończenie wymaga świadomego doboru przyczepności do sposobu użytkowania.",
  },
  {
    id: "kwarc",
    title: "Z posypką kwarcową",
    eyebrow: "Strukturalna",
    description: "Wyrazista faktura powierzchni. Rozważ ją, jeśli ważniejsza jest przyczepność pod butem niż idealna gładkość.",
    detail: "Strukturę i poziom antypoślizgowości dobieramy do warunków w garażu.",
  },
] as const;

const colors = [
  { name: "Jasny szary", ral: "RAL 7035", hex: "#d7d9d3" },
  { name: "Szary", ral: "RAL 7040", hex: "#9da3a6" },
  { name: "Antracyt", ral: "RAL 7016", hex: "#383e43" },
  { name: "Beżowoszary", ral: "RAL 1019", hex: "#a89b86" },
] as const;

export default function GarageFinishPicker() {
  const [finishId, setFinishId] = useState<(typeof finishes)[number]["id"]>("platki");
  const [colorId, setColorId] = useState<(typeof colors)[number]["ral"]>("RAL 7035");
  const selectedFinish = finishes.find((item) => item.id === finishId) ?? finishes[0];
  const selectedColor = colors.find((item) => item.ral === colorId) ?? colors[0];

  const texture = finishId === "platki"
    ? "radial-gradient(circle at 21% 25%, #ffffffb3 0 2px, transparent 3px), radial-gradient(circle at 68% 60%, #29292965 0 2px, transparent 3px), radial-gradient(circle at 42% 80%, #fafafac9 0 1px, transparent 3px)"
    : finishId === "kwarc"
      ? "radial-gradient(circle at 25% 35%, #fff7 0 1px, transparent 2px), radial-gradient(circle at 70% 55%, #0004 0 1px, transparent 2px)"
      : "none";

  return (
    <section id="wykonczenia" aria-labelledby="wykonczenia-heading" className="bg-zinc-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Zaprojektuj wygląd</p>
          <h2 id="wykonczenia-heading" className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Wybierz wykończenie do swojego garażu
          </h2>
          <p className="mt-4 leading-relaxed text-zinc-600">
            Nie musisz znać nazw systemów. Zacznij od efektu, jaki chcesz uzyskać. Technologię dobierzemy później do Twojego betonu i sposobu użytkowania.
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
                className={"group relative rounded-2xl border p-6 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900 " +
                  (active ? "border-zinc-900 bg-white shadow-sm" : "border-zinc-200 bg-white/70 hover:border-zinc-400")}
              >
                <span className="flex items-start justify-between">
                  <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">0{index + 1} / {finish.eyebrow}</span>
                  <span className={"flex h-7 w-7 items-center justify-center rounded-full border " + (active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 text-transparent")}>
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                </span>
                <span className="mt-8 block text-xl font-semibold tracking-tight text-zinc-900">{finish.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-zinc-600">{finish.description}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid overflow-hidden rounded-2xl border border-zinc-200 bg-white lg:grid-cols-[1fr_0.9fr]">
          <div className="relative flex min-h-[250px] flex-col justify-end overflow-hidden p-6 sm:min-h-[360px] sm:p-10"
            style={{ backgroundColor: selectedColor.hex, backgroundImage: texture, backgroundSize: finishId === "platki" ? "38px 38px" : "12px 12px" }}>
            <div className="relative max-w-sm rounded-xl bg-white/90 p-4 shadow-sm backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Schematyczna próbka</p>
              <p className="mt-1 text-lg font-semibold text-zinc-950">{selectedColor.name} · {selectedColor.ral}</p>
              <p className="mt-1 text-sm text-zinc-700">{selectedFinish.title}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-6 sm:p-10">
            <div>
              <h3 className="text-xl font-semibold text-zinc-950">Kolor ma znaczenie</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                Wybierz wstępny kierunek kolorystyczny. Ekran nie zastąpi rzeczywistej próbki, a dostępność odcieni i mieszanek zależy od wybranego systemu.
              </p>
              <div className="mt-7 grid grid-cols-4 gap-3" role="group" aria-label="Wybór koloru posadzki">
                {colors.map((color) => (
                  <button key={color.ral} type="button" onClick={() => setColorId(color.ral)} aria-pressed={colorId === color.ral}
                    className="min-w-0 rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                    title={color.name + " " + color.ral}>
                    <span className={"block h-14 w-full rounded-lg border-2 " + (colorId === color.ral ? "border-zinc-950 ring-2 ring-zinc-300 ring-offset-2" : "border-zinc-200")}
                      style={{backgroundColor: color.hex}} />
                    <span className="mt-2 block text-center text-xs font-medium text-zinc-700">{color.ral}</span>
                  </button>
                ))}
              </div>
              <p className="mt-6 text-sm text-zinc-600">{selectedFinish.detail}</p>
            </div>
            <Link href="/kalkulator?typ=garaz" className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-zinc-950 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-700">
              Wyceń garaż <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Próbka powyżej jest poglądową grafiką kolorystyczną, nie zdjęciem realizacji ani gwarancją identycznej faktury.
          Zdjęcia rzeczywistych posadzek znajdziesz poniżej.
        </p>
      </div>
    </section>
  );
}
