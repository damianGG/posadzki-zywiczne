'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculateRecommendedKit, ConfiguratorInput } from '@/lib/configurator'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

export default function KonfiguratorPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<ConfiguratorInput>({
    area: 30,
    underfloorHeating: false,
    antiSlip: 'none',
    color: 'szary'
  })
  const [result, setResult] = useState<ReturnType<typeof calculateRecommendedKit> | null>(null)

  const totalSteps = 4

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Calculate result
      const recommendation = calculateRecommendedKit(formData)
      setResult(recommendation)
      setStep(5) // Show result
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleAddToCart = async () => {
    if (!result) return

    // Fetch matching product from database
    const response = await fetch(`/api/products/sku/${result.sku}`)
    
    if (response.ok) {
      const product = await response.json()
      
      // Add to cart
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productKitId: product.id,
          sku: product.sku,
          name: product.name,
          price: product.basePrice,
          quantity: 1
        })
      })

      router.push('/koszyk')
    } else {
      alert('Przepraszamy, ten zestaw nie jest obecnie dostępny. Skontaktuj się z nami.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Konfigurator Posadzki do Garażu</h1>
          
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Krok {Math.min(step, totalSteps)} z {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.min(Math.round((step / totalSteps) * 100), 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((step / totalSteps) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Step 1: Area */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Powierzchnia garażu</h2>
              <p className="text-gray-600">Podaj powierzchnię garażu w metrach kwadratowych.</p>
              
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                  Powierzchnia (m²)
                </label>
                <input
                  type="number"
                  id="area"
                  min="1"
                  max="100"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Zaokrąglimy do najbliższego rozmiaru zestawu: 10, 20, 30, 40, 50, 60, 80, 100m²
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Underfloor heating */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Ogrzewanie podłogowe</h2>
              <p className="text-gray-600">Czy garaż ma ogrzewanie podłogowe?</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, underfloorHeating: false })}
                  className={`p-6 border-2 rounded-lg transition ${
                    !formData.underfloorHeating
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">NIE</span>
                    {!formData.underfloorHeating && <Check className="text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-600">Standardowy garaż (żywica EP)</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, underfloorHeating: true })}
                  className={`p-6 border-2 rounded-lg transition ${
                    formData.underfloorHeating
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">TAK</span>
                    {formData.underfloorHeating && <Check className="text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-600">Z ogrzewaniem (żywica PU)</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Anti-slip */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Powłoka antypoślizgowa</h2>
              <p className="text-gray-600">Czy chcesz dodać powłokę antypoślizgową R10?</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, antiSlip: 'none' })}
                  className={`p-6 border-2 rounded-lg transition ${
                    formData.antiSlip === 'none'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">Bez R10</span>
                    {formData.antiSlip === 'none' && <Check className="text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-600">Standardowa powierzchnia</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, antiSlip: 'R10' })}
                  className={`p-6 border-2 rounded-lg transition ${
                    formData.antiSlip === 'R10'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">Z R10</span>
                    {formData.antiSlip === 'R10' && <Check className="text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-600">Zwiększone bezpieczeństwo (+200 PLN)</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Color */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Kolor posadzki</h2>
              <p className="text-gray-600">Wybierz kolor posadzki żywicznej.</p>
              
              <div className="grid grid-cols-3 gap-4">
                {['szary', 'grafitowy', 'beżowy'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`p-6 border-2 rounded-lg transition ${
                      formData.color === color
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold capitalize">{color}</span>
                      {formData.color === color && <Check className="text-blue-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Result */}
          {step === 5 && result && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-green-900 mb-4">
                  ✓ Rekomendowany zestaw
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">SKU</p>
                    <p className="text-xl font-bold text-gray-900">{result.sku}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Opis</p>
                    <p className="text-gray-900">{result.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Typ</p>
                      <p className="font-semibold">{result.type === 'PU' ? 'Poliuretan' : 'Epoksyd'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rozmiar</p>
                      <p className="font-semibold">{result.bucketSize}m²</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">R10</p>
                      <p className="font-semibold">{result.hasR10 ? 'Tak' : 'Nie'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kolor</p>
                      <p className="font-semibold capitalize">{result.color}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Dodaj do koszyka
                </button>
                <button
                  onClick={() => {
                    setStep(1)
                    setResult(null)
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Skonfiguruj ponownie
                </button>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          {step < 5 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Wstecz
              </button>
              
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {step < totalSteps ? (
                  <>
                    Dalej
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  'Zobacz rekomendację'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
