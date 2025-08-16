import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function BlogArticle() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Nowoczesne Posadzki Żywiczne - Kompletny Przewodnik 2024",
    description:
      "Odkryj wszystko o nowoczesnych posadzkach żywicznych. Poznaj rodzaje, zalety, proces aplikacji i koszty. Przewodnik eksperta po najlepszych rozwiązaniach dla Twojego domu i firmy.",
    image: "/placeholder.svg?height=600&width=1200",
    author: {
      "@type": "Person",
      name: "Jan Kowalski",
      url: "https://posadzkizywiczne.pl/autor/jan-kowalski",
    },
    publisher: {
      "@type": "Organization",
      name: "Posadzki Żywiczne",
      logo: {
        "@type": "ImageObject",
        url: "https://posadzkizywiczne.pl/logo.png",
      },
    },
    datePublished: "2024-01-15",
    dateModified: "2024-01-15",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://posadzkizywiczne.pl/blog/nowoczesne-posadzki-zywiczne-przewodnik-2024",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Strona główna
              </Link>
            </li>
            <li className="before:content-['/'] before:mx-2">
              <Link href="/blog" className="hover:text-primary">
                Blog
              </Link>
            </li>
            <li className="before:content-['/'] before:mx-2 text-foreground">Nowoczesne Posadzki Żywiczne</li>
          </ol>
        </nav>

        {/* Back to blog */}
        <Button variant="ghost" asChild className="mb-8 pl-0">
          <Link href="/blog" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do bloga
          </Link>
        </Button>

        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <Badge>Poradniki</Badge>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Nowoczesne Posadzki Żywiczne - Kompletny Przewodnik 2024
          </h1>

          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
            Odkryj wszystko o nowoczesnych posadzkach żywicznych. Poznaj rodzaje, zalety, proces aplikacji i koszty.
            Przewodnik eksperta po najlepszych rozwiązaniach dla Twojego domu i firmy.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Jan Kowalski" />
                  <AvatarFallback>JK</AvatarFallback>
                </Avatar>
                <span>Jan Kowalski</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <time dateTime="2024-01-15">15 stycznia 2024</time>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>8 min czytania</span>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="flex items-center">
              <Share2 className="w-4 h-4 mr-2" />
              Udostępnij
            </Button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Nowoczesna posadzka żywiczna w eleganckim wnętrzu - błyszcząca powierzchnia odbijająca światło"
            width={1200}
            height={600}
            className="w-full h-auto rounded-lg"
            priority
          />
          <figcaption className="text-sm text-muted-foreground mt-2 text-center">
            Przykład nowoczesnej posadzki żywicznej w przestrzeni mieszkalnej
          </figcaption>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <h2 id="co-to-sa-posadzki-zywiczne">Czym są posadzki żywiczne?</h2>

          <p>
            <strong>Posadzki żywiczne</strong> to nowoczesne rozwiązanie podłogowe, które zyskuje coraz większą
            popularność zarówno w zastosowaniach przemysłowych, jak i mieszkalnych. Składają się z żywic syntetycznych,
            które po utwardzeniu tworzą jednolitą, bezspoinową powierzchnię o wyjątkowych właściwościach.
          </p>

          <p>
            Te innowacyjne posadzki charakteryzują się nie tylko estetyką, ale przede wszystkim
            <em>wyjątkową wytrzymałością</em> i odpornością na różnego rodzaju uszkodzenia mechaniczne i chemiczne.
          </p>

          <h2 id="rodzaje-posadzek-zywicznych">Rodzaje posadzek żywicznych</h2>

          <h3>1. Posadzki epoksydowe</h3>
          <p>
            Najczęściej wybierane ze względu na doskonałą adhezję do podłoża i wysoką odporność chemiczną. Idealne do
            garaży, warsztatów i pomieszczeń przemysłowych.
          </p>

          <h3>2. Posadzki poliuretanowe</h3>
          <p>
            Charakteryzują się większą elastycznością niż epoksydowe, co czyni je odpornymi na pęknięcia. Doskonale
            sprawdzają się w pomieszczeniach narażonych na wahania temperatur.
          </p>

          <h3>3. Posadzki metakrylanowe</h3>
          <p>
            Najszybciej twardniejące posadzki żywiczne, które można użytkować już po kilku godzinach. Idealne tam, gdzie
            liczy się czas realizacji.
          </p>

          <h2 id="zalety-posadzek-zywicznych">Kluczowe zalety posadzek żywicznych</h2>

          <ul>
            <li>
              <strong>Bezspoinowa powierzchnia</strong> - łatwa w utrzymaniu czystości
            </li>
            <li>
              <strong>Wysoka wytrzymałość</strong> - odporna na ścieranie i uderzenia
            </li>
            <li>
              <strong>Odporność chemiczna</strong> - nie reaguje z większością substancji
            </li>
            <li>
              <strong>Możliwość personalizacji</strong> - szeroka gama kolorów i wykończeń
            </li>
            <li>
              <strong>Szybka aplikacja</strong> - krótki czas realizacji projektu
            </li>
            <li>
              <strong>Długotrwałość</strong> - żywotność nawet do 20 lat
            </li>
          </ul>

          <h2 id="proces-aplikacji">Proces aplikacji posadzki żywicznej</h2>

          <p>
            Profesjonalna aplikacja posadzki żywicznej to proces wieloetapowy, który wymaga odpowiedniego przygotowania
            podłoża i precyzyjnego wykonania każdego kroku:
          </p>

          <ol>
            <li>
              <strong>Przygotowanie podłoża</strong> - szlifowanie, odkurzanie, naprawa ubytków
            </li>
            <li>
              <strong>Aplikacja primera</strong> - zwiększenie adhezji żywicy do podłoża
            </li>
            <li>
              <strong>Nakładanie warstwy bazowej</strong> - główna warstwa nośna
            </li>
            <li>
              <strong>Aplikacja warstwy wykończeniowej</strong> - nadanie ostatecznego wyglądu
            </li>
            <li>
              <strong>Utwardzanie</strong> - proces chemiczny trwający 24-48 godzin
            </li>
          </ol>

          <h2 id="koszty-i-inwestycja">Koszty i zwrot z inwestycji</h2>

          <p>
            Koszt posadzki żywicznej zależy od wielu czynników, w tym rodzaju żywicy, powierzchni, stanu podłoża i
            wybranego wykończenia. Średnie ceny wahają się od <strong>80 do 200 zł za m²</strong>.
          </p>

          <p>
            Mimo wyższych kosztów początkowych w porównaniu do tradycyjnych rozwiązań, posadzki żywiczne oferują
            doskonały zwrot z inwestycji dzięki długotrwałości i minimalnym kosztom utrzymania.
          </p>

          <h2 id="podsumowanie">Podsumowanie</h2>

          <p>
            Posadzki żywiczne to przyszłość nowoczesnych podłóg. Łączą w sobie funkcjonalność, estetykę i trwałość,
            oferując rozwiązanie idealne zarówno dla zastosowań przemysłowych, jak i mieszkalnych. Inwestycja w
            profesjonalnie wykonaną posadzkę żywiczną to gwarancja satysfakcji na lata.
          </p>
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t">
          <Card>
            <CardHeader>
              <CardTitle>Potrzebujesz profesjonalnej posadzki żywicznej?</CardTitle>
              <CardDescription>
                Skontaktuj się z naszymi ekspertami i otrzymaj bezpłatną wycenę dla swojego projektu.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/kontakt">Skontaktuj się z nami</Link>
              </Button>
            </CardFooter>
          </Card>
        </footer>
      </article>
    </>
  )
}
