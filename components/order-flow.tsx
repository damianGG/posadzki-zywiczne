"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Phone } from "lucide-react";
import { findLook, findPlace, floorPlaces, type PlaceId } from "@/lib/visual-offers";

const steps = ["Miejsce", "Wygląd", "Wycena"];

function isPlaceId(value: string | null): value is PlaceId {
  return floorPlaces.some((place) => place.id === value);
}

export default function OrderFlow({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const params = useSearchParams();
  const requestedPlace = params.get("miejsce");
  const requestedLook = params.get("wyglad");
  const startingPlace = isPlaceId(requestedPlace) ? requestedPlace : null;
  const startingLook = findLook(findPlace(startingPlace), requestedLook)?.id ?? null;

  const [step, setStep] = useState(startingPlace && startingLook ? 3 : startingPlace ? 2 : 1);
  const [placeId, setPlaceId] = useState<PlaceId | null>(startingPlace);
  const [lookId, setLookId] = useState<string | null>(startingLook);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [note, setNote] = useState("");
  const [honey, setHoney] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [mailto, setMailto] = useState("");

  const place = findPlace(placeId);
  const look = findLook(place, lookId);
  const Title = heading;

  const mailBody = useMemo(() => {
    return [
      `Miejsce: ${place?.title ?? ""}`,
      `Wygląd: ${look?.title ?? ""}`,
      `Imię: ${name}`,
      `Telefon: ${phone}`,
      `E-mail: ${email}`,
      `Miejscowość: ${city}`,
      `Metraż: ${area} m²`,
      `Uwagi: ${note}`,
    ].join("\n");
  }, [place, look, name, phone, email, city, area, note]);

  function choosePlace(next: PlaceId) {
    setPlaceId(next);
    setLookId(null);
    setError("");
    setStep(2);
  }

  function chooseLook(next: string) {
    setLookId(next);
    setError("");
    setStep(3);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!place || !look) {
      setError("Wybierz miejsce i wygląd.");
      setStep(place ? 2 : 1);
      return;
    }
    const digits = phone.replace(/\D/g, "");
    if (name.trim().length < 2) {
      setError("Podaj imię.");
      return;
    }
    if (digits.length < 9) {
      setError("Podaj numer telefonu, oddzwonimy.");
      return;
    }
    if (city.trim().length < 2) {
      setError("Podaj miejscowość.");
      return;
    }
    const meters = Number(area.replace(",", "."));
    if (!Number.isFinite(meters) || meters < 1 || meters > 20000) {
      setError("Podaj orientacyjny metraż w m².");
      return;
    }

    const payload = {
      placeId: place.id,
      lookId: look.id,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim(),
      area: meters,
      note: note.trim(),
      companyWebsite: honey,
    };

    setSending(true);
    try {
      const response = await fetch("/api/wycena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string; mailto?: boolean };
      if (!response.ok) {
        if (response.status === 503) {
          const href = `mailto:biuro@posadzkizywiczne.com?subject=${encodeURIComponent("Wycena posadzki: " + place.title)}&body=${encodeURIComponent(mailBody)}`;
          setMailto(href);
          setError(data.message || "Nie udało się wysłać z tej strony. Użyj przycisku e-mail.");
          return;
        }
        setError(data.message || "Nie udało się wysłać. Zadzwoń: 507 384 619.");
        return;
      }
      setSent(true);
    } catch {
      setError("Brak połączenia. Zadzwoń: 507 384 619.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="zamow" aria-labelledby="order-flow-heading" className="bg-zinc-50 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Wycena w 3 krokach</p>
        <Title id="order-flow-heading" className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Wybierz miejsce, zobacz wygląd, zostaw numer.
        </Title>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
          Bez nazw systemów i kart technicznych. Zdjęcia są z wykonanych prac. Kolor na ekranie tylko naprowadza — odcień potwierdzamy próbką.
        </p>

        <ol className="mt-8 grid grid-cols-3 gap-2" aria-label="Postęp">
          {steps.map((label, index) => {
            const number = index + 1;
            const active = step === number;
            const done = step > number;
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => {
                    if (number === 1 || (number === 2 && place) || (number === 3 && place && look)) setStep(number);
                  }}
                  className={
                    "flex w-full items-center gap-2 rounded-full border px-3 py-2 text-left text-sm font-medium " +
                    (active ? "border-zinc-950 bg-zinc-950 text-white" : done ? "border-zinc-300 bg-white text-zinc-900" : "border-zinc-200 bg-white text-zinc-400")
                  }
                  aria-current={active ? "step" : undefined}
                >
                  <span className={"flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs " + (active ? "bg-white text-zinc-950" : "bg-zinc-100 text-zinc-700")}>
                    {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : number}
                  </span>
                  <span className="truncate">{label}</span>
                </button>
              </li>
            );
          })}
        </ol>

        {step === 1 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2" role="list">
            {floorPlaces.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => choosePlace(item.id)}
                className={
                  "group overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:border-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 " +
                  (item.id === "garaz" ? "sm:col-span-2 sm:grid sm:grid-cols-[1.3fr_1fr]" : "")
                }
              >
                <span className={"relative block bg-zinc-900 " + (item.id === "garaz" ? "aspect-[16/10] sm:aspect-auto sm:min-h-[320px]" : "aspect-[16/10]")}>
                  {item.image ? (
                    <Image src={item.image} alt={item.alt} fill sizes={item.id === "garaz" ? "(min-width: 640px) 60vw, 100vw" : "(min-width: 640px) 50vw, 100vw"} className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                  ) : (
                    <span className="absolute inset-0 flex items-end p-5 text-2xl font-semibold tracking-tight text-white">Hala, parking, gastronomia</span>
                  )}
                </span>
                <span className="flex flex-col justify-end p-5">
                  <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{item.eyebrow}</span>
                  <span className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">{item.title}</span>
                  <span className="mt-2 text-sm leading-relaxed text-zinc-600">{item.summary}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950">
                    Wybieram <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && place && (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-zinc-600">
                Miejsce: <span className="font-semibold text-zinc-950">{place.title}</span>
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-950 underline-offset-4 hover:underline">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Zmień miejsce
                </button>
                <Link href={place.href} className="text-sm font-semibold text-zinc-950 underline underline-offset-4">
                  Więcej o: {place.title}
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {place.looks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseLook(item.id)}
                  aria-pressed={lookId === item.id}
                  className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition hover:border-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                >
                  <span className="relative block aspect-[4/3] bg-zinc-200">
                    {item.image ? (
                      <Image src={item.image} alt={item.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center bg-zinc-950 p-6 text-center text-lg font-semibold text-white">{item.title}</span>
                    )}
                  </span>
                  <span className="block p-4">
                    <span className="block text-lg font-semibold text-zinc-950">{item.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-zinc-600">{item.description}</span>
                    <span className="mt-3 block text-xs text-zinc-500">{item.caption}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && place && look && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              <div className="relative aspect-[4/3] bg-zinc-200">
                {look.image ? (
                  <Image src={look.image} alt={look.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 p-8 text-center text-2xl font-semibold text-white">{look.title}</div>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{place.title}</p>
                <h3 className="mt-1 text-xl font-semibold text-zinc-950">{look.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{look.detail}</p>
                <button type="button" onClick={() => setStep(2)} className="mt-4 text-sm font-semibold underline underline-offset-4">
                  Zmień wygląd
                </button>
              </div>
            </div>

            {sent ? (
              <div className="rounded-2xl bg-zinc-950 p-6 text-white sm:p-8" role="status">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Wysłane</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight">Dziękujemy. Oddzwonimy.</h3>
                <p className="mt-4 leading-relaxed text-zinc-300">
                  Zapytanie o {place.title.toLowerCase()} ({look.title.toLowerCase()}, {area.replace(",", ".")} m², {city}) jest u nas.
                  Zadzwonimy na {phone}. Jeśli beton jest pęknięty albo tłusty, dosłać zdjęcie całej podłogi i zbliżenie uszkodzeń na biuro@posadzkizywiczne.com.
                </p>
                <a href="tel:+48507384619" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950">
                  <Phone className="h-4 w-4" aria-hidden="true" /> 507 384 619
                </a>
              </div>
            ) : (
              <form onSubmit={submit} className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7" noValidate>
                <h3 className="text-xl font-semibold text-zinc-950">Dane do oddzwonienia</h3>
                <p className="mt-1 text-sm text-zinc-600">Trzy pola wystarczą. Reszta jest opcjonalna.</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-zinc-800">
                    Imię
                    <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-3 text-base outline-none ring-zinc-950 focus:ring-2" />
                  </label>
                  <label className="block text-sm font-medium text-zinc-800">
                    Telefon
                    <input value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" inputMode="tel" required className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-3 text-base outline-none ring-zinc-950 focus:ring-2" />
                  </label>
                  <label className="block text-sm font-medium text-zinc-800">
                    Miejscowość
                    <input value={city} onChange={(event) => setCity(event.target.value)} autoComplete="address-level2" required className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-3 text-base outline-none ring-zinc-950 focus:ring-2" />
                  </label>
                  <label className="block text-sm font-medium text-zinc-800">
                    Metraż, m²
                    <input value={area} onChange={(event) => setArea(event.target.value)} inputMode="decimal" required className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-3 text-base outline-none ring-zinc-950 focus:ring-2" />
                  </label>
                  <label className="block text-sm font-medium text-zinc-800 sm:col-span-2">
                    E-mail, jeśli wolisz pismo
                    <input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" inputMode="email" className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-3 text-base outline-none ring-zinc-950 focus:ring-2" />
                  </label>
                  <label className="block text-sm font-medium text-zinc-800 sm:col-span-2">
                    Co jeszcze mamy wiedzieć
                    <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} maxLength={1000} className="mt-1 w-full resize-y rounded-xl border border-zinc-300 px-3 py-3 text-base outline-none ring-zinc-950 focus:ring-2" placeholder="Stan betonu, termin, czy wpada słońce." />
                  </label>
                </div>
                <label className="hidden" aria-hidden="true">
                  Strona firmowa
                  <input value={honey} onChange={(event) => setHoney(event.target.value)} tabIndex={-1} autoComplete="off" />
                </label>
                {error && (
                  <p className="mt-4 text-sm font-medium text-red-700" role="alert">
                    {error}
                  </p>
                )}
                {mailto && (
                  <a href={mailto} className="mt-3 inline-flex text-sm font-semibold underline">
                    Otwórz wiadomość e-mail z tymi danymi
                  </a>
                )}
                <button type="submit" disabled={sending} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 sm:w-auto">
                  {sending ? "Wysyłam…" : "Poproś o wycenę"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                {place.id === "garaz" && (
                  <p className="mt-4 text-sm text-zinc-600">
                    Wolisz najpierw widełki?{" "}
                    <Link href="/kalkulator?typ=garaz" className="font-semibold text-zinc-950 underline underline-offset-4">
                      Kalkulator garażu
                    </Link>
                  </p>
                )}
                <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                  Numer służy tylko do oddzwonienia w sprawie tej wyceny. Ostateczna cena zależy od stanu betonu.
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
