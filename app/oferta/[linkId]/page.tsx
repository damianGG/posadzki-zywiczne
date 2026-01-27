'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Calculator, 
  Home, 
  Palette, 
  Layers,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Loader2
} from "lucide-react"

interface OfferData {
  rodzajPomieszczenia: string
  stanBetonu?: string
  powierzchnia: number
  obwod?: number
  wybranyRodzajPowierzchni: string
  wybranyKolor: string
  wybraneDodatki: string[]
  kosztCalkowity: number
  wymiary?: { dlugosc: string; szerokosc: string }
  powierzchniaBezposrednia?: string
  trybWymiarow?: string
  // Additional metadata
  rodzajPowierzchniNazwa?: string
  kolorNazwa?: string
  dodatki?: any[]
}

interface OfferLink {
  id: string
  link_id: string
  offer_data: OfferData
  created_at: string
  customer_email?: string
  customer_name?: string
}

export default function OfferPage() {
  const params = useParams()
  const router = useRouter()
  const linkId = params.linkId as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offerLink, setOfferLink] = useState<OfferLink | null>(null)

  useEffect(() => {
    if (!linkId) return

    const fetchOffer = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/offer-link?linkId=${linkId}`)
        const data = await response.json()

        if (!data.success) {
          setError(data.message || 'Nie znaleziono oferty')
          return
        }

        setOfferLink(data.offerLink)
      } catch (err) {
        console.error('Error fetching offer:', err)
        setError('Błąd podczas pobierania oferty')
      } finally {
        setLoading(false)
      }
    }

    fetchOffer()
  }, [linkId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <p className="text-lg font-medium text-gray-700">Ładowanie oferty...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !offerLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              <CardTitle>Błąd</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              {error || 'Nie znaleziono oferty'}
            </p>
            <Button 
              onClick={() => router.push('/kalkulator')}
              className="w-full"
            >
              Stwórz nową ofertę
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const offerData = offerLink.offer_data
  const createdDate = new Date(offerLink.created_at).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Oferta Posadzki Żywicznej
          </h1>
          <p className="text-gray-600">
            Wygenerowana: {createdDate}
          </p>
        </div>

        {/* Main Content */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              Szczegóły Oferty
            </CardTitle>
            <CardDescription className="text-blue-50">
              Pełne zestawienie wybranej konfiguracji
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Room Type */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Rodzaj Pomieszczenia</h3>
              </div>
              <p className="text-gray-700 ml-7">{offerData.rodzajPomieszczenia}</p>
              {offerData.stanBetonu && (
                <p className="text-gray-600 ml-7 text-sm mt-1">
                  Stan podłoża: {offerData.stanBetonu}
                </p>
              )}
            </div>

            <Separator className="my-6" />

            {/* Dimensions */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Wymiary</h3>
              </div>
              <div className="ml-7 space-y-1">
                <p className="text-gray-700">
                  <span className="font-medium">Powierzchnia:</span> {offerData.powierzchnia.toFixed(2)} m²
                </p>
                {offerData.wymiary && offerData.wymiary.dlugosc && offerData.wymiary.szerokosc && (
                  <p className="text-gray-600 text-sm">
                    Wymiary: {offerData.wymiary.dlugosc}m × {offerData.wymiary.szerokosc}m
                  </p>
                )}
                {offerData.obwod && offerData.obwod > 0 && (
                  <p className="text-gray-600 text-sm">
                    Obwód: {offerData.obwod} mb
                  </p>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Surface Type */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Wykończenie</h3>
              </div>
              <div className="ml-7 space-y-1">
                <p className="text-gray-700">
                  <span className="font-medium">Rodzaj powierzchni:</span> {offerData.rodzajPowierzchniNazwa || offerData.wybranyRodzajPowierzchni}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Kolor:</span> {offerData.kolorNazwa || offerData.wybranyKolor}
                </p>
              </div>
            </div>

            {/* Additional Services */}
            {offerData.wybraneDodatki && offerData.wybraneDodatki.length > 0 && (
              <>
                <Separator className="my-6" />
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Usługi Dodatkowe</h3>
                  </div>
                  <ul className="ml-7 space-y-1">
                    {offerData.dodatki && offerData.dodatki.length > 0 ? (
                      offerData.dodatki.map((dodatek, index) => (
                        <li key={index} className="text-gray-700 flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{dodatek.nazwa || dodatek}</span>
                        </li>
                      ))
                    ) : (
                      offerData.wybraneDodatki.map((dodatek, index) => (
                        <li key={index} className="text-gray-700 flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{dodatek}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </>
            )}

            <Separator className="my-6" />

            {/* Total Cost */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">Koszt Całkowity</p>
                  <p className="text-sm text-gray-600">
                    {offerData.powierzchnia > 0 ? (
                      <>Cena za m²: {(offerData.kosztCalkowity / offerData.powierzchnia).toFixed(2)} zł</>
                    ) : (
                      <>Cena za m²: N/A</>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">
                    {offerData.kosztCalkowity.toFixed(2)} zł
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push('/kalkulator')}
            variant="outline"
            className="flex-1"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Stwórz swoją ofertę
          </Button>
          <Button
            onClick={() => window.print()}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Drukuj ofertę
          </Button>
        </div>

        {/* Contact Section */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Zainteresowany?</h3>
            <p className="text-gray-700 mb-4">
              Skontaktuj się z nami, aby omówić szczegóły i umówić się na realizację.
            </p>
            <div className="space-y-2 text-gray-600">
              <p>📧 Email: biuro@posadzkizywiczne.com</p>
              <p>📞 Telefon: +48 507 384 619</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
