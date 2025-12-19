'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { getConfiguratorResult, AVAILABLE_COLORS } from '@/lib/configurator'
import { prisma } from '@/lib/prisma'
import { useRouter } from 'next/navigation'

export default function KonfiguratorPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [area, setArea] = useState('')
  const [underfloorHeating, setUnderfloorHeating] = useState<boolean | null>(null)
  const [antiSlip, setAntiSlip] = useState<'none' | 'R10' | null>(null)
  const [color, setColor] = useState<string>('SZARY')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Generate result
      const areaNum = parseFloat(area)
      if (!areaNum || underfloorHeating === null || antiSlip === null) {
        return
      }

      const configResult = getConfiguratorResult({
        area: areaNum,
        underfloorHeating,
        antiSlip,
        color,
      })

      setResult(configResult)
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return area && parseFloat(area) > 0
      case 2:
        return underfloorHeating !== null
      case 3:
        return antiSlip !== null
      case 4:
        return color !== null
      default:
        return false
    }
  }

  const handleAddToCart = async () => {
    if (!result) return

    setLoading(true)

    try {
      // Find product by SKU
      const response = await fetch(`/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          item: {
            sku: result.sku,
            name: result.recommendedKit,
            quantity: 1,
          },
        }),
      })

      if (response.ok) {
        router.push('/koszyk')
      } else {
        alert('Nie znaleziono produktu o tym SKU. Spróbuj wybrać produkt ze sklepu.')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Wystąpił błąd. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold">Konfigurator Posadzki</h1>
            <p className="text-xl text-muted-foreground">
              Odpowiedz na kilka pytań, a dobierzemy dla Ciebie idealny zestaw
            </p>
          </div>

          {/* Progress Bar */}
          {step <= totalSteps && (
            <div className="mb-8">
              <Progress value={progress} className="h-3" />
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Krok {step} z {totalSteps}
              </p>
            </div>
          )}

          {/* Step 1: Area */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Powierzchnia garażu</CardTitle>
                <CardDescription>Podaj powierzchnię w metrach kwadratowych</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="area">Powierzchnia (m²)</Label>
                    <Input
                      id="area"
                      type="number"
                      min="1"
                      step="0.1"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="np. 35"
                      className="text-lg"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    💡 Zaokrąglimy w górę do najbliższego rozmiaru zestawu
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push('/sklep')}>
                  Anuluj
                </Button>
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Dalej
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Underfloor Heating */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Ogrzewanie podłogowe</CardTitle>
                <CardDescription>Czy w garażu jest zainstalowane ogrzewanie podłogowe?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={underfloorHeating === true ? 'default' : 'outline'}
                    className="h-24 text-lg"
                    onClick={() => setUnderfloorHeating(true)}
                  >
                    ✓ Tak
                  </Button>
                  <Button
                    variant={underfloorHeating === false ? 'default' : 'outline'}
                    className="h-24 text-lg"
                    onClick={() => setUnderfloorHeating(false)}
                  >
                    ✗ Nie
                  </Button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  💡 Ogrzewanie podłogowe wymaga żywicy poliuretanowej (PU)
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Wstecz
                </Button>
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Dalej
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Anti-slip */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Powłoka antypoślizgowa</CardTitle>
                <CardDescription>Czy chcesz dodać strukturę antypoślizgową R10?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={antiSlip === 'none' ? 'default' : 'outline'}
                    className="h-24 text-lg"
                    onClick={() => setAntiSlip('none')}
                  >
                    Gładka powierzchnia
                  </Button>
                  <Button
                    variant={antiSlip === 'R10' ? 'default' : 'outline'}
                    className="h-24 text-lg"
                    onClick={() => setAntiSlip('R10')}
                  >
                    R10 Antypoślizg
                  </Button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  💡 R10 zwiększa bezpieczeństwo i dodaje estetyczny efekt
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Wstecz
                </Button>
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Dalej
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 4: Color */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Wybierz kolor</CardTitle>
                <CardDescription>Wybierz kolor posadzki</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {AVAILABLE_COLORS.map((c) => (
                    <Button
                      key={c.value}
                      variant={color === c.value ? 'default' : 'outline'}
                      className="h-16 text-lg"
                      onClick={() => setColor(c.value)}
                    >
                      {c.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Wstecz
                </Button>
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Zobacz rekomendację
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Result */}
          {step > totalSteps && result && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">🎉 Rekomendowany zestaw</CardTitle>
                <CardDescription>Dopasowany do Twoich potrzeb</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{result.recommendedKit}</h3>
                    <p className="text-muted-foreground">SKU: {result.sku}</p>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="mb-2 font-semibold">Specyfikacja:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Typ: {result.type === 'EP' ? 'Epoksydowa' : 'Poliuretanowa'}</li>
                      <li>• Powierzchnia: do {result.bucket}m²</li>
                      <li>• Antypoślizg: {result.hasR10 ? 'R10 ✓' : 'Brak'}</li>
                      <li>• Kolor: {result.color}</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
                    <p className="text-sm">
                      💡 <strong>Dlaczego ten zestaw?</strong>
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {underfloorHeating
                        ? 'Żywica poliuretanowa (PU) jest elastyczna i odporna na wysokie temperatury, idealna do ogrzewania podłogowego.'
                        : 'Żywica epoksydowa (EP) to doskonały wybór dla garaży bez ogrzewania podłogowego - jest twarda, trwała i odporna na ścieranie.'}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button onClick={handleAddToCart} disabled={loading} className="w-full" size="lg">
                  {loading ? 'Dodawanie...' : 'Dodaj do koszyka i przejdź do realizacji'}
                </Button>
                <div className="flex w-full gap-2">
                  <Button variant="outline" onClick={() => router.push('/sklep')} className="flex-1">
                    Zobacz wszystkie zestawy
                  </Button>
                  <Button variant="outline" onClick={() => { setStep(1); setResult(null) }} className="flex-1">
                    Zacznij od nowa
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
