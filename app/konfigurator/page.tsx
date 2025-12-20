'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculateRecommendedKit, generateKitName, calculatePrice, R10_SURCHARGE } from '@/lib/configurator';

const COLORS = ['Szary', 'Grafitowy', 'Beżowy', 'Czerwony', 'Niebieski', 'Zielony'];

export default function KonfiguratorPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [area, setArea] = useState<string>('');
  const [underfloorHeating, setUnderfloorHeating] = useState<boolean>(false);
  const [antiSlip, setAntiSlip] = useState<'none' | 'R10'>('none');
  const [color, setColor] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!area || parseFloat(area) <= 0) {
      alert('Proszę podać prawidłową powierzchnię');
      return;
    }

    setLoading(true);

    try {
      const result = calculateRecommendedKit({
        area: parseFloat(area),
        underfloorHeating,
        antiSlip,
        color: color || undefined,
      });

      // Try to find existing kit or create recommendation
      const response = await fetch('/api/kits');
      const data = await response.json();
      
      // Find matching kit
      const matchingKit = data.kits?.find((kit: any) => kit.sku === result.sku);
      
      if (matchingKit) {
        // Add to cart
        const finalPrice = calculatePrice(matchingKit.basePrice, matchingKit.hasR10);
        
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add',
            item: {
              productKitId: matchingKit.id,
              sku: matchingKit.sku,
              name: matchingKit.name,
              quantity: 1,
              price: finalPrice,
            },
          }),
        });
        
        router.push('/koszyk');
      } else {
        // Show recommendation
        alert(`Rekomendowany zestaw: ${result.sku}\nNazwa: ${generateKitName(result.type, result.bucketSize, result.hasR10, result.color)}\n\nZestaw zostanie wkrótce dostępny w sklepie.`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Wystąpił błąd podczas przetwarzania. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Konfigurator posadzki żywicznej
          </h1>
          <p className="text-gray-600 mb-8">
            Odpowiedz na kilka pytań, a dobierzemy dla Ciebie idealny zestaw
          </p>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Krok {step} z 4
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round((step / 4) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Area */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-4">
                  Jaka jest powierzchnia Twojego garażu?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="np. 25"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    min="1"
                    step="0.1"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 text-lg">
                    m²
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Podaj powierzchnię w metrach kwadratowych
                </p>
              </div>
              <button
                onClick={() => area && parseFloat(area) > 0 && setStep(2)}
                disabled={!area || parseFloat(area) <= 0}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Dalej
              </button>
            </div>
          )}

          {/* Step 2: Underfloor heating */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-4">
                  Czy masz ogrzewanie podłogowe?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setUnderfloorHeating(false);
                      setStep(3);
                    }}
                    className="px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-lg font-medium"
                  >
                    Nie
                  </button>
                  <button
                    onClick={() => {
                      setUnderfloorHeating(true);
                      setStep(3);
                    }}
                    className="px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-lg font-medium"
                  >
                    Tak
                  </button>
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Wstecz
              </button>
            </div>
          )}

          {/* Step 3: Anti-slip */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-4">
                  Czy chcesz dodać antypoślizg?
                </label>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setAntiSlip('none');
                      setStep(4);
                    }}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-medium text-lg">Bez antypoślizgu</div>
                    <div className="text-sm text-gray-500">Standardowa posadzka</div>
                  </button>
                  <button
                    onClick={() => {
                      setAntiSlip('R10');
                      setStep(4);
                    }}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="font-medium text-lg">Antypoślizg R10</div>
                    <div className="text-sm text-gray-500">
                      Zwiększone bezpieczeństwo (+{R10_SURCHARGE} zł)
                    </div>
                  </button>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Wstecz
              </button>
            </div>
          )}

          {/* Step 4: Color */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-4">
                  Wybierz kolor (opcjonalnie)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`px-4 py-3 border-2 rounded-lg transition-colors ${
                        color === c
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Przetwarzanie...' : 'Zobacz rekomendację'}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Wstecz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
