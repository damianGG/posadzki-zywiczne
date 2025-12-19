import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create example product kits
  const kits = [
    {
      sku: 'GAR-EP-30',
      name: 'Zestaw Epoksydowy 30m²',
      description: 'Kompletny zestaw do wykonania posadzki epoksydowej w garażu do 30m². Zawiera żywicę epoksydową, utwardzacz, podkład i wszystkie niezbędne materiały.',
      type: 'EP',
      bucket: 30,
      hasR10: false,
      color: 'SZARY',
      basePrice: 2499.00,
      r10Surcharge: 0,
    },
    {
      sku: 'GAR-PU-50-R10-GR',
      name: 'Zestaw Poliuretanowy 50m² z antypoślizgiem R10 - Grafitowy',
      description: 'Kompletny zestaw do wykonania posadzki poliuretanowej w garażu do 50m² z ogrzewaniem podłogowym. Zawiera żywicę poliuretanową, utwardzacz, podkład, granulat antypoślizgowy R10 i wszystkie niezbędne materiały. Kolor grafitowy.',
      type: 'PU',
      bucket: 50,
      hasR10: true,
      color: 'GRAFITOWY',
      basePrice: 4299.00,
      r10Surcharge: 350.00,
    },
    {
      sku: 'GAR-EP-80-R10-BEZ',
      name: 'Zestaw Epoksydowy 80m² z antypoślizgiem R10 - Beżowy',
      description: 'Kompletny zestaw do wykonania posadzki epoksydowej w garażu do 80m². Zawiera żywicę epoksydową, utwardzacz, podkład, granulat antypoślizgowy R10 i wszystkie niezbędne materiały. Kolor beżowy.',
      type: 'EP',
      bucket: 80,
      hasR10: true,
      color: 'BEŻOWY',
      basePrice: 6899.00,
      r10Surcharge: 450.00,
    },
  ]

  for (const kit of kits) {
    const created = await prisma.productKit.upsert({
      where: { sku: kit.sku },
      update: kit,
      create: kit,
    })
    console.log(`Created/Updated kit: ${created.name}`)
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
