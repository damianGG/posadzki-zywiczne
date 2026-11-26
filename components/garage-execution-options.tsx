import { ArrowRight, Check, Hammer, HardHat, Phone } from "lucide-react";
import Link from "next/link";
import { SITE_PHONE } from "@/lib/site-config";
import { estimateGarageDiy, GARAGE_DIY_KG_PER_M2, GARAGE_DIY_PLN_PER_M2 } from "@/lib/garage-calculator-flow";

const formatPrice = (n: number) => new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 2 }).format(n);
export default function GarageExecutionOptions({ estimate, area, pending }: {
  estimate?: { area: number; total: number; finish: string; color: string };
  area?: number;
  pending?: { message: string; partialTotal?: number };
}) {
  const diy = estimateGarageDiy(estimate?.area ?? area);
  return (
    <section id="garaz-dwie-opcje" aria-labelledby="garage-options-title" className="scroll-mt-28 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-7">
      <p className="brand-eyebrow">Dwie drogi do nowej posadzki</p>
      <h2 id="garage-options-title" className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Zleć nam wykonanie lub zrób to sam</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600 sm:text-base">Ty wybierasz, ile pracy chcesz wykonać samodzielnie. W obu przypadkach pomożemy dobrać odpowiedni system do Twojego garażu.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="flex min-w-0 flex-col rounded-xl border-2 border-zinc-900 p-5 sm:p-6">
          <HardHat className="h-7 w-7 text-[#007A3D]" aria-hidden="true" />
          <h3 className="mt-3 text-xl font-semibold">Zleć posadzkę nam</h3>
          {estimate ? <div className="mt-4 rounded-lg bg-zinc-50 p-4">
            <p className="text-sm text-zinc-600">Orientacyjny koszt wykonania · {formatPrice(estimate.area)} m²</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">{formatPrice(estimate.total)} zł</p>
            <p className="mt-1 text-sm text-zinc-600">{estimate.finish} · {estimate.color}</p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600">Szacunek z aktualnego kalkulatora. Ostateczna cena, dojazd, zakres i VAT do potwierdzenia.</p>
          </div> : pending ? <div className="mt-4 rounded-lg bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-600">{pending.partialTotal !== undefined && <p className="mb-2 text-xl font-semibold text-zinc-950">Suma częściowa: {formatPrice(pending.partialTotal)} zł</p>}{pending.message}</div> : <p className="mt-3 text-sm leading-relaxed text-zinc-600">Poznaj orientacyjny koszt materiału i wykonania bez podawania danych kontaktowych.</p>}
          <ul className="mt-4 space-y-2 text-sm text-zinc-700">
            {["Ocena i przygotowanie podłoża","Materiały oraz wykonanie przez ekipę","Ustalenie terminu i odbiór posadzki"].map(item => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#007A3D]" aria-hidden="true"/>{item}</li>)}
          </ul>
          <div className="mt-auto pt-5">
            {estimate ? <a href={"tel:" + SITE_PHONE} className="brand-accent-button flex min-h-12 items-center justify-center gap-2 rounded-full px-4 py-3 text-center font-semibold"><Phone className="h-4 w-4" aria-hidden="true"/> Zadzwoń i ustal wykonanie</a> : pending ? <a href={"tel:" + SITE_PHONE} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-zinc-900 px-4 py-3 text-center font-semibold"><Phone className="h-4 w-4" aria-hidden="true"/> Porozmawiaj o wykonaniu</a> : <Link href="/kalkulator?typ=garaz" className="brand-accent-button flex min-h-12 items-center justify-center gap-2 rounded-full px-4 py-3 text-center font-semibold">Oblicz koszt wykonania <ArrowRight className="h-4 w-4" aria-hidden="true"/></Link>}
          </div>
        </article>
        <article className="flex min-w-0 flex-col rounded-xl border border-zinc-300 p-5 sm:p-6">
          <Hammer className="h-7 w-7 text-[#007A3D]" aria-hidden="true"/>
          <h3 className="mt-3 text-xl font-semibold">Kup materiał i wykonaj sam</h3>
          <div className="mt-4 rounded-lg bg-zinc-50 p-4">
            <p className="text-sm text-zinc-600">{diy ? "Orientacyjna cena zestawu · " + formatPrice(diy.area) + " m²" : "Orientacyjna cena materiałów"}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">{diy ? formatPrice(diy.totalPln) + " zł" : "ok. " + formatPrice(GARAGE_DIY_PLN_PER_M2) + " zł/m²"}</p>
            <p className="mt-2 text-sm font-medium text-zinc-700">{diy ? "Potrzebna ilość: ok. " + formatPrice(diy.materialKg) + " kg materiału łącznie" : "Zużycie: ok. " + formatPrice(GARAGE_DIY_KG_PER_M2) + " kg/m² łącznie"}</p>
            {diy && <p className="mt-1 text-xs text-zinc-600">Przyjęto {formatPrice(GARAGE_DIY_PLN_PER_M2)} zł/m² i {formatPrice(GARAGE_DIY_KG_PER_M2)} kg/m². To orientacyjna kalkulacja, nie gotowa oferta.</p>}
          </div>
          <p className="mt-3 text-base font-medium">Będziemy z Tobą na każdym etapie.</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">Dobierzemy materiały do metrażu i stanu betonu. Pomożemy Ci zaplanować pracę i odpowiemy na pytania dotyczące aplikacji.</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-700">
            {["Dobór systemu i ilości materiału","Instrukcje przygotowania betonu i nakładania kolejnych warstw","Wsparcie techniczne przed rozpoczęciem i w trakcie prac"].map(item => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#007A3D]" aria-hidden="true"/>{item}</li>)}
          </ul>
          <p className="mt-4 rounded-lg bg-zinc-50 p-3 text-sm leading-relaxed text-zinc-600">Cena dotyczy materiałów na posadzkę, bez robocizny, narzędzi i dostawy. Rzeczywiste zużycie, zapas, opakowania, ewentualne naprawy podłoża oraz ostateczną cenę brutto potwierdzimy telefonicznie.</p>
          <div className="mt-auto pt-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-800"><span className="h-2 w-2 shrink-0 rounded-full bg-[#00D664]" aria-hidden="true"/> Dostępny w sprzedaży telefonicznej</p>
            <a href={"tel:" + SITE_PHONE} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-zinc-900 px-4 py-3 text-center font-semibold text-zinc-950 hover:bg-zinc-50"><Phone className="h-4 w-4" aria-hidden="true"/> Zamów zestaw telefonicznie</a>
            <p className="mt-2 text-center text-sm text-zinc-600">Wkrótce możliwość zakupu w sklepie online.</p>
          </div>
        </article>
      </div>
      <p className="mt-4 text-center text-sm text-zinc-600">Bez formularza i bez podawania e-maila. Kontakt telefoniczny: <a href={"tel:" + SITE_PHONE} className="font-semibold underline underline-offset-4">507 384 619</a>.</p>
    </section>
  );
}
