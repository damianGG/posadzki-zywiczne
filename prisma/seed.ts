import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create example garage kits
  const kits = [
    {
      sku: 'GAR-EP-30',
      name: 'Zestaw Posadzkowy EP-30 Garaż',
      description: 'Zestaw epoksydowy do garażu na powierzchnię do 30m². Idealny dla standardowych garaży bez ogrzewania podłogowego.',
      type: 'EP',
      bucketSize: 30,
      hasR10: false,
      color: 'szary',
      basePrice: 899.99,
      r10Surcharge: 0,
      stock: 10,
      active: true
    },
    {
      sku: 'GAR-PU-30-R10-GR',
      name: 'Zestaw Posadzkowy PU-30 R10 Szary Garaż',
      description: 'Zestaw poliuretanowy do garażu z ogrzewaniem podłogowym, powierzchnia do 30m², z powłoką antypoślizgową R10 w kolorze szarym.',
      type: 'PU',
      bucketSize: 30,
      hasR10: true,
      color: 'szary',
      basePrice: 1299.99,
      r10Surcharge: 200,
      stock: 8,
      active: true
    },
    {
      sku: 'GAR-EP-50-R10',
      name: 'Zestaw Posadzkowy EP-50 R10 Garaż',
      description: 'Zestaw epoksydowy do garażu na powierzchnię do 50m² z powłoką antypoślizgową R10. Bez ogrzewania podłogowego.',
      type: 'EP',
      bucketSize: 50,
      hasR10: true,
      color: 'szary',
      basePrice: 1499.99,
      r10Surcharge: 250,
      stock: 5,
      active: true
    },
    {
      sku: 'GAR-PU-50',
      name: 'Zestaw Posadzkowy PU-50 Garaż',
      description: 'Zestaw poliuretanowy do garażu z ogrzewaniem podłogowym na powierzchnię do 50m².',
      type: 'PU',
      bucketSize: 50,
      hasR10: false,
      color: 'szary',
      basePrice: 1699.99,
      r10Surcharge: 0,
      stock: 6,
      active: true
    }
  ]

  for (const kit of kits) {
    await prisma.productKit.upsert({
      where: { sku: kit.sku },
      update: kit,
      create: kit
    })
    console.log(`Created/Updated kit: ${kit.sku}`)
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
