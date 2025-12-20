import { getProductKits } from '@/lib/db';
import { calculatePrice } from '@/lib/configurator';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sklep - Zestawy posadzek żywicznych | Posadzki Żywiczne',
  description: 'Kup gotowe zestawy posadzek żywicznych do garażu. Systemy epoksydowe i poliuretanowe z opcją antypoślizgu R10.',
};

export default async function SklepPage() {
  const kits = await getProductKits();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sklep - Zestawy posadzek żywicznych
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Wybierz gotowy zestaw posadzki żywicznej do swojego garażu lub skorzystaj z konfiguratora
          </p>
          <Link
            href="/konfigurator"
            className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Skorzystaj z konfiguratora
          </Link>
        </div>

        {kits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Brak dostępnych zestawów. Skorzystaj z konfiguratora, aby stworzyć własny zestaw.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kits.map((kit) => {
              const finalPrice = calculatePrice(kit.basePrice, kit.hasR10);
              
              return (
                <div
                  key={kit.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="mb-4">
                      <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                        {kit.type === 'EP' ? 'Epoksydowa' : 'Poliuretanowa'}
                      </span>
                      {kit.hasR10 && (
                        <span className="ml-2 text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                          R10
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {kit.name}
                    </h3>
                    
                    <p className="text-sm text-gray-500 mb-4">SKU: {kit.sku}</p>
                    
                    {kit.description && (
                      <p className="text-gray-600 mb-4">{kit.description}</p>
                    )}
                    
                    <div className="mb-4">
                      <span className="text-sm text-gray-600">Powierzchnia:</span>
                      <span className="ml-2 text-lg font-semibold text-gray-900">
                        do {kit.bucketSize} m²
                      </span>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-3xl font-bold text-gray-900">
                        {finalPrice.toFixed(2)} zł
                      </div>
                      {kit.hasR10 && (
                        <div className="text-sm text-gray-500">
                          (zawiera dodatek antypoślizgowy +500 zł)
                        </div>
                      )}
                    </div>
                    
                    <AddToCartButton
                      kitId={kit.id}
                      sku={kit.sku}
                      name={kit.name}
                      price={finalPrice}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Client component for add to cart button
function AddToCartButton({
  kitId,
  sku,
  name,
  price,
}: {
  kitId: string;
  sku: string;
  name: string;
  price: number;
}) {
  return (
    <button
      onClick={async () => {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add',
            item: {
              productKitId: kitId,
              sku,
              name,
              quantity: 1,
              price,
            },
          }),
        });
        
        if (response.ok) {
          window.location.href = '/koszyk';
        }
      }}
      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
    >
      Dodaj do koszyka
    </button>
  );
}
