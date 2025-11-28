"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Gift, Snowflake, Calendar, CheckCircle2, Loader2 } from "lucide-react"
import SnowfallAnimation from "@/components/snowfall-animation"

export default function KonkursPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
    code?: string
  }>({ type: null, message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus({
          type: "success",
          message: data.message,
          code: data.code,
        })
        setName("")
        setEmail("")
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message,
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Wystąpił błąd. Spróbuj ponownie później.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <SnowfallAnimation />
      {/* Header Section */}
      <div className="w-full py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 opacity-10"></div>
        <div className="container max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-3">
              <Snowflake className="w-12 h-12 text-blue-600 animate-pulse" />
              <Gift className="w-16 h-16 text-purple-600" />
              <Snowflake className="w-12 h-12 text-blue-600 animate-pulse" />
            </div>
            <Badge className="text-lg px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
              Świąteczny Konkurs 2025
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Wygraj Posadzkę Żywiczną
              </span>
              <br />
              <span className="text-gray-900">o wartości 5000 zł!</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl">
              🎄 Spraw sobie najlepszy prezent pod choinkę 🎁
            </p>
          </div>
        </div>
      </div>

      {/* Prize Section */}
      <div className="w-full py-12 lg:py-20">
        <div className="container max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border-2 border-purple-100">
            <div className="text-center mb-8">
              <Gift className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                🎁 Nagroda Główna
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">5000 zł</div>
                <p className="text-gray-700">Wartość posadzki żywicznej</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">Dowolne pomieszczenie</div>
                <p className="text-gray-700">Garaż, kotłownia lub pomieszczenie mieszkalne</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">6 miesięcy</div>
                <p className="text-gray-700">Ważność nagrody</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Participate Section */}
      <div className="w-full py-12 lg:py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            ⏳ Jak wziąć udział?
          </h2>
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <p className="text-gray-700 font-medium">Wpisz imię i email</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <p className="text-gray-700 font-medium">Generator tworzy unikalny kod</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <p className="text-gray-700 font-medium">Kod wysyłany jest na email</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <p className="text-gray-700 font-medium">Uczestniczysz w losowaniu</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border-2 border-purple-200">
              <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
                Weź udział w konkursie
              </h3>

              {submitStatus.type === "success" ? (
                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-green-700 mb-3">Gratulacje!</h4>
                  <p className="text-green-700 mb-4">{submitStatus.message}</p>
                  {submitStatus.code && (
                    <div className="bg-white rounded-lg p-6 mt-4">
                      <p className="text-gray-600 text-sm mb-2">Twój kod konkursowy:</p>
                      <p className="text-4xl font-bold text-purple-600 font-mono tracking-wider">
                        {submitStatus.code}
                      </p>
                    </div>
                  )}
                  <Button
                    onClick={() => setSubmitStatus({ type: null, message: "" })}
                    className="mt-6 bg-purple-600 hover:bg-purple-700"
                  >
                    Zamknij
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg">
                      Imię
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Wpisz swoje imię"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      minLength={2}
                      className="text-lg p-6"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-lg">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="twoj@email.pl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-lg p-6"
                      disabled={isSubmitting}
                    />
                  </div>

                  {submitStatus.type === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                      {submitStatus.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generowanie kodu...
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5 mr-2" />
                        Weź udział w konkursie
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Draw Information Section */}
      <div className="w-full py-12 lg:py-20">
        <div className="container max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 lg:p-12 text-white">
            <div className="text-center">
              <Snowflake className="w-16 h-16 mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">❄️ Informacja o losowaniu</h2>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                Losowanie wygranej odbędzie się poprzez fizyczne losowanie wydrukowanych kodów.
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
                <Calendar className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">Data zakończenia konkursu:</p>
                <p className="text-3xl font-bold">20 grudnia 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RODO & Regulations Section */}
      <div className="w-full py-12 lg:py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              ⚠️ RODO i Regulamin
            </h2>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <h3 className="text-xl font-semibold">Ochrona danych osobowych (RODO)</h3>
              <p>
                Administratorem Twoich danych osobowych jest [Nazwa firmy]. Twoje dane będą przetwarzane
                wyłącznie w celu przeprowadzenia konkursu i powiadomienia o wynikach. Masz prawo dostępu
                do swoich danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania.
              </p>

              <h3 className="text-xl font-semibold mt-6">Regulamin konkursu</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Konkurs trwa do 20 grudnia 2025 roku.</li>
                <li>W konkursie może wziąć udział każda osoba pełnoletnia.</li>
                <li>Jeden adres email = jeden kod konkursowy.</li>
                <li>Nagroda główna: posadzka żywiczna o wartości 5000 zł.</li>
                <li>Ważność nagrody wynosi 6 miesięcy od daty losowania.</li>
                <li>Nagroda może być zrealizowana w garażu, kotłowni lub pomieszczeniu mieszkalnym.</li>
                <li>Losowanie odbędzie się poprzez fizyczne losowanie wydrukowanych kodów.</li>
                <li>Zwycięzca zostanie powiadomiony emailem i telefonicznie.</li>
                <li>Nagroda nie podlega wymianie na ekwiwalent pieniężny.</li>
                <li>Organizator zastrzega sobie prawo do zmiany regulaminu.</li>
              </ul>

              <p className="mt-6 text-sm text-gray-500">
                Wypełniając formularz, wyrażasz zgodę na przetwarzanie danych osobowych zgodnie z RODO
                oraz akceptujesz regulamin konkursu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
