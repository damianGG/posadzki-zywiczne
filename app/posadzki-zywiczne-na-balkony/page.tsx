import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, Droplets, Sun, Layers3 } from "lucide-react";
import ProjectPhoto from "@/components/project-photo";
import ServiceSectionNav from "@/components/service-section-nav";
import RelatedSystems from "@/components/related-systems";
import RelatedRealizations from "@/components/related-realizations";
import SocialProofSection from "@/blocks/socialproofsection/SocialProofSection";
import { stoneCarpetGallery } from "@/lib/stone-carpet-gallery";

export const revalidate = 300;

const looks = [
  { id: "balkon-platki", title: "Żywica z płatkami", src: "/realizacje/krakow-rydlowka-balkon/IMG_1315.JPG", alt: "Jasna posadzka z płatkami na balkonie z żółtą balustradą", caption: "Balkon · zdjęcie z naszej galerii", advantage: "Dekoracyjny wzór bez klasycznych fug, który ogranicza widoczność drobnych zabrudzeń.", limitation: "Płatki nie gwarantują antypoślizgowości. Fakturę i odporność na UV potwierdzamy dla wybranego systemu." },
  { id: "taras-gladki", title: "Jednolita powłoka żywiczna", src: "/realizacje/rzeszow-glogow-malopolski-taras/IMG_9538.JPG", alt: "Jednolita jasna posadzka na zadaszonym tarasie", caption: "Taras · Głogów Małopolski", advantage: "Spójny wygląd i wygodne usuwanie zabrudzeń z odpowiednio dobranej powierzchni.", limitation: "Na mokro gładka powierzchnia może być śliska. Połysk i kolor zależą od systemu, warunków oraz oświetlenia." },
  { id: "dywan", title: "Kamienny dywan", src: stoneCarpetGallery[6].src, alt: stoneCarpetGallery[6].alt, caption: stoneCarpetGallery[6].caption, advantage: "Naturalna faktura kruszywa, różne odcienie i możliwość wykończenia stopni.", limitation: "Otwarta struktura wymaga pielęgnacji; warstwa kruszywa nie zastępuje hydroizolacji." },
];
const faqs = [
  ["Ile kosztuje remont balkonu lub tarasu?", "Cena zależy od stanu podłoża, powierzchni, izolacji, spadków i detali. Nie podajemy jednej stawki bez wiedzy o zakresie; przesłanie zdjęć pozwala określić, co będzie konieczne."],
  ["Czy można położyć żywicę na stare płytki?", "Tylko jeżeli ocena potwierdzi stabilność podłoża i kompatybilność systemu. Odspojone płytki lub mokra wylewka mogą wymagać usunięcia i osuszenia."],
  ["Czy posadzka zabezpiecza przed przeciekaniem?", "Nie każda powłoka dekoracyjna jest hydroizolacją. Szczelność zależy od całego układu warstw, spadków, dylatacji i obróbek przy ścianach oraz balustradach."],
  ["Czy żywica jest śliska na mokro?", "Gładkie wykończenie może być śliskie. Dobieramy fakturę do ekspozycji, wody i sposobu czyszczenia, a klasę antypoślizgowości potwierdzamy dokumentacją konkretnego systemu."],
  ["Czy żywica żółknie na słońcu?", "Niektóre żywice zmieniają kolor pod UV. Na zewnątrz trzeba zastosować system przeznaczony do ekspozycji na słońce i warunki atmosferyczne."],
  ["Jak długo trwa remont?", "Czas zależy od zakresu napraw, wilgotności, pogody i warunków utwardzania. Przy mokrej wylewce prace mogą wymagać przerwy na osuszenie."],
  ["Czy dajecie gwarancję na balkony?", "Na wykonane przez nas systemy balkonowe oferujemy 10 lat gwarancji. Zakres i warunki gwarancji określamy w ofercie oraz umowie."],
  ["Żywica czy płytki?", "Żywica daje bezspoinowy wygląd, ale wymaga prawidłowego przygotowania i ochrony podłoża. Płytki mają inny sposób napraw i pielęgnacji. W obu rozwiązaniach kluczowa jest hydroizolacja."],
];
const steps = [
  ["01", "Ocena stanu balkonu", "Sprawdzamy płytki, rysy, wilgotność, spadki, progi i obróbki."],
  ["02", "Szlifowanie planetarne", "Usuwamy niestabilne warstwy, szlifujemy beton maszynami planetarnymi, odpylamy i wykonujemy niezbędne naprawy."],
  ["03", "Grunt i warstwa żywiczna", "Dobieramy kompatybilny grunt penetrujący, kontrolujemy pory, wykonujemy detale izolacji i rozlewamy warstwę zasadniczą żywicy."],
  ["04", "Detale i odbiór", "Ustalamy wykończenie krawędzi, połączeń i dylatacji oraz termin bezpiecznego użytkowania."],
];

export default function BalconyPage() {
  return (
    <main className="min-w-0">
      <section className="brand-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-14">
          <div>
            <nav aria-label="Ścieżka nawigacji" className="mb-4 flex items-center gap-2 text-xs text-zinc-600"><Link href="/">Strona główna</Link><ChevronRight className="h-3 w-3" aria-hidden="true"/><span aria-current="page">Balkony i tarasy</span></nav>
            <p className="brand-eyebrow">Nawierzchnie zewnętrzne</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Posadzki żywiczne na balkony i tarasy</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">Chroń beton przed wodą i ciesz się estetyczną nawierzchnią bez klasycznych fug. Wykonujemy żywicę na balkonach żelbetowych, prefabrykowanych i z łącznikami Isokorb. Dobieramy system do konstrukcji, podłoża i warunków użytkowania.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="#wykonczenia" className="brand-button rounded-full px-6 py-3.5 text-center font-semibold">Porównaj wykończenia</Link>
              <Link href="#cena" className="rounded-full border border-zinc-400 px-6 py-3.5 text-center font-semibold hover:bg-white">Sprawdź koszt</Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-600">
              <span className="flex items-center gap-2"><Droplets className="h-4 w-4 text-[#007A3D]"/> Hydroizolacja</span>
              <span className="flex items-center gap-2"><Sun className="h-4 w-4 text-[#007A3D]"/> Dobór do UV</span>
              <span className="flex items-center gap-2"><Layers3 className="h-4 w-4 text-[#007A3D]"/> Ocena podłoża</span>
              <span className="flex items-center gap-2 font-semibold text-zinc-900"><Check className="h-4 w-4 text-[#007A3D]"/> 10 lat gwarancji na systemy balkonowe</span>
            </div>
          </div>
          <figure className="order-first lg:order-none">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-200 lg:aspect-[4/3]">
              <Image src={looks[1].src} alt={looks[1].alt} fill priority fetchPriority="high" quality={75} sizes="(min-width: 1280px) 588px, (min-width: 1024px) calc((100vw - 104px) / 2), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)" className="object-cover object-bottom"/>
            </div>
            <figcaption className="mt-3 text-sm text-zinc-600">Nasza realizacja · taras w Głogowie Małopolskim</figcaption>
          </figure>
        </div>
      </section>
      <ServiceSectionNav items={[{"href":"#cena","label":"Cena"},{"href":"#wykonczenia","label":"Wykończenia"},{"href":"#realizacje","label":"Zdjęcia"},{"href":"#problemy","label":"Problemy"},{"href":"#przebieg","label":"Przebieg"},{"href":"#faq","label":"Pytania"},{"href":"#opinie","label":"Opinie"}]} quoteHref="/zamow?miejsce=taras" />
      <section id="cena" className="mx-auto grid max-w-7xl scroll-mt-44 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
        <div>
          <p className="brand-eyebrow">Cena i zakres</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Ile kosztuje posadzka na balkonie lub tarasie?</h2>
          <p className="mt-4 leading-relaxed text-zinc-600">Odnowienie stabilnego betonu i generalny remont z usunięciem płytek oraz naprawą izolacji to różne zakresy prac. Dlatego koszt ustalamy na podstawie stanu powierzchni i potrzebnych warstw, a nie samego metrażu.</p>
          <Link href="/zamow?miejsce=taras" className="brand-button mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold">Wyślij zdjęcia do wyceny <ArrowRight className="h-4 w-4"/></Link>
        </div>
        <div className="brand-surface rounded-2xl p-6 sm:p-8">
          <h3 className="text-xl font-semibold">Co wpływa na koszt?</h3>
          <ul className="mt-5 space-y-3 text-zinc-700">{["Metraż i geometria, w tym schody i cokoły","Usunięcie płytek lub starej powłoki","Naprawa betonu i ewentualne osuszanie","Hydroizolacja i spadki","Wykończenie, progi, balustrady i obróbki"].map(item => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-[#007A3D]"/>{item}</li>)}</ul>
        </div>
      </section>
      <section id="wykonczenia" className="scroll-mt-44 bg-muted/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="brand-eyebrow">Porównaj wygląd</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Które wykończenie pasuje do Ciebie?</h2>
          <p className="mt-3 max-w-2xl text-zinc-600">Obejrzyj rzeczywiste zdjęcia i powiększ detale. Technologię dobierzemy do stanu balkonu oraz warunków użytkowania.</p>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {looks.map(look => <article key={look.id} className="flex min-w-0 flex-col rounded-2xl border bg-white p-4 sm:p-5">
              <ProjectPhoto src={look.src} alt={look.alt} caption={look.caption} sizes="(max-width: 768px) 100vw, 33vw"/>
              <h3 className="mt-4 text-xl font-semibold">{look.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">{look.advantage}</p>
              <p className="mt-3 border-l-2 border-[#00D664] pl-3 text-sm leading-relaxed text-zinc-600"><strong className="text-zinc-900">Warto wiedzieć: </strong>{look.limitation}</p>
              <div className="mt-auto pt-5"><Link href={`/zamow?miejsce=taras&wyglad=${look.id}`} className="brand-button inline-block rounded-full px-5 py-3 text-sm font-semibold">Wybieram to wykończenie</Link>
              {look.id === "dywan" && <Link href="/kamienny-dywan" className="mt-3 block text-sm font-semibold underline underline-offset-4">Więcej o kamiennym dywanie</Link>}</div>
            </article>)}
          </div>
          <p className="mt-5 text-sm text-zinc-600">Nie wiesz, co wybrać? <Link href="/zamow?miejsce=taras&wyglad=doradztwo" className="font-semibold underline">Pomożemy Ci dobrać rozwiązanie.</Link></p>
        </div>
      </section>
      <section id="realizacje" className="mx-auto max-w-7xl scroll-mt-44 px-4 py-12 sm:px-6 sm:py-16">
        <p className="brand-eyebrow">Realne zdjęcia</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Zobacz balkony i tarasy z bliska</h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <ProjectPhoto src="/realizacje/krakow-rydlowka-balkon/IMG_1320.JPG" alt="Kolejny kadr posadzki żywicznej na balkonie" caption="Balkon · dodatkowy kadr z galerii"/>
          <ProjectPhoto src="/realizacje/rzeszow-glogow-malopolski-taras/IMG_9540.JPG" alt="Kolejny kadr posadzki żywicznej na tarasie" caption="Taras · Głogów Małopolski"/>
        </div>
        <div className="mt-5"><RelatedRealizations category="balkony-tarasy" title="Więcej naszych realizacji balkonów i tarasów"/></div>
      </section>
      <section id="problemy" className="brand-surface scroll-mt-44 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="brand-eyebrow">Wady i ograniczenia</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Kiedy nie wystarczy nałożyć nowej żywicy?</h2>
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border bg-white p-5">
              <ProjectPhoto src="/odpadajace_plytki.webp" alt="Przykład uszkodzonej powierzchni z płytek" caption="Przykład problemu podłoża · zdjęcie poglądowe"/>
              <h3 className="mt-4 text-xl font-semibold">Odspojone płytki i mokra wylewka</h3>
              <p className="mt-3 leading-relaxed text-zinc-600">Przykrycie niestabilnej albo wilgotnej powierzchni może doprowadzić do odspojenia nowej powłoki. Najpierw trzeba rozpoznać przyczynę i ocenić stan podłoża.</p>
            </article>
            <article className="rounded-2xl border bg-white p-5">
              <ProjectPhoto src="/remont-balkon.webp" alt="Przykład balkonu wymagającego remontu" caption="Przykład stanu wymagającego oceny · zdjęcie poglądowe"/>
              <h3 className="mt-4 text-xl font-semibold">Przeciekanie, spadki i obróbki</h3>
              <p className="mt-3 leading-relaxed text-zinc-600">Sama dekoracyjna nawierzchnia nie rozwiąże problemu wody. Sprawdzamy izolację, odpływ, progi, balustrady i krawędzie. Zakres zależy od konkretnego balkonu.</p>
            </article>
          </div>
          <p className="mt-4 text-sm text-zinc-600">Zdjęcia problemów nie są zestawem „przed i po” pokazanych wyżej realizacji.</p>
        </div>
      </section>
      <section id="przebieg" className="mx-auto max-w-7xl scroll-mt-44 px-4 py-12 sm:px-6 sm:py-16">
        <p className="brand-eyebrow">Przebieg prac</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Od oceny podłoża do gotowej nawierzchni</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{steps.map(([n,title,body]) => <article key={n} className="border-t-2 border-[#00D664] pt-4"><p className="text-sm font-bold text-[#007A3D]">{n}</p><h3 className="mt-3 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-zinc-600">{body}</p></article>)}</div>
        <div className="mt-9"><RelatedSystems application="balkony" title="Systemy na balkony i tarasy"/></div>
        <p className="mt-5 text-sm text-zinc-600">Więcej o doborze technologii: <Link href="/blog/czy-posadzka-zywiczna-nadaje-sie-na-taras" className="font-semibold underline underline-offset-4">Czy posadzka żywiczna nadaje się na taras?</Link></p>
      </section>
      <section id="poradniki-balkonowe" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="brand-eyebrow">Wiedza techniczna i lokalna obsługa</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Żywica na balkonach – technologia i wykonawstwo w Twoim mieście</h2>
        <p className="mt-3 max-w-3xl text-zinc-600">Sprawdź, jak zabezpieczamy beton, dobieramy żywicę i ograniczamy ryzyko pęcherzy. Przy prostych, odpowiednio przygotowanych płytach rozważamy elastyczną powłokę Sikafloor®-400 N Elastic; bardziej złożone detale wymagają doboru pełnego systemu. Na wykonane przez nas systemy balkonowe oferujemy 10 lat gwarancji na warunkach określonych w umowie.</p>
        <div className="mt-7 grid gap-8 md:grid-cols-2">
          <div><h3 className="text-xl font-semibold">Poradniki techniczne</h3><ul className="mt-4 space-y-3 text-sm text-zinc-700">{[
            ["zywica-na-balkony-zelbetowe", "Żywica na balkony żelbetowe"],
            ["zywica-na-balkony-prefabrykowane", "Żywica na balkony prefabrykowane"],
            ["zywica-na-balkony-izokorb", "Balkony z łącznikami Isokorb"],
            ["jaka-zywica-na-balkon-sikafloor-400-n-elastic", "Jaka żywica na balkon? Sikafloor 400 N Elastic"],
            ["babelki-pecherze-na-zywicy-balkonowej", "Bąbelki i pęcherze na żywicy balkonowej"],
          ].map(([slug, label]) => <li key={slug}><Link href={`/blog/${slug}`} className="font-semibold underline underline-offset-4">{label}</Link></li>)}</ul></div>
          <div><h3 className="text-xl font-semibold">Żywica na balkony – miasta i regiony</h3><ul className="mt-4 grid gap-3 text-sm text-zinc-700 sm:grid-cols-2">{[
            ["krakow", "Kraków"], ["rzeszow", "Rzeszów"], ["warszawa", "Warszawa"], ["lublin", "Lublin"],
            ["mielec-stalowa-wola", "Mielec i Stalowa Wola"], ["tarnow-nowy-sacz", "Tarnów i Nowy Sącz"],
            ["radom-plock", "Radom i Płock"], ["zamosc-chelm", "Zamość i Chełm"],
          ].map(([slug, label]) => <li key={slug}><Link href={`/blog/zywica-na-balkony-${slug}`} className="font-semibold underline underline-offset-4">{label}</Link></li>)}</ul></div>
        </div>
      </section>
      <section id="faq" className="scroll-mt-44 bg-muted/50 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="brand-eyebrow">Pytania klientów</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Co warto wiedzieć przed remontem?</h2></div>
          <div className="divide-y border-t">{faqs.map(([q,a]) => <details key={q} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold marker:hidden">{q}<span className="text-xl font-normal group-open:rotate-45" aria-hidden="true">+</span></summary><p className="mt-3 text-sm leading-relaxed text-zinc-600">{a}</p></details>)}</div>
        </div>
      </section>
      <div id="opinie" className="scroll-mt-44"><SocialProofSection/></div>
      <section className="brand-surface px-4 py-14 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Pokaż nam swój balkon lub taras</h2>
        <p className="mx-auto mt-3 max-w-xl text-zinc-600">Podaj metraż, miejscowość i dołącz zdjęcia całej powierzchni oraz uszkodzeń. Pomożemy Ci dobrać rozwiązanie.</p>
        <Link href="/zamow?miejsce=taras" className="brand-button mt-6 inline-block rounded-full px-7 py-3.5 font-semibold">Poproś o indywidualną wycenę</Link>
      </section>
    </main>
  );
}
