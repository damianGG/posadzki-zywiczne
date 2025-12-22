import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing kits
  await prisma.orderItem.deleteMany({})
  await prisma.productKit.deleteMany({})
  
  console.log('📦 Creating product kits...')

  // Create example kits for garages
  const kits = [
    {
      sku: 'GAR-EP-30',
      name: 'System epoksydowy 30m²',
      type: 'EP',
      bucketSize: 30,
      hasR10: false,
      color: null,
      basePrice: 2500,
      description: 'Kompletny zestaw żywicy epoksydowej do garażu do 30m². Zawiera: żywicę epoksydową, utwardzacz, instrukcję, narzędzia.',
    },
    {
      sku: 'GAR-PU-30-R10',
      name: 'System poliuretanowy 30m² z antypoślizgiem R10',
      type: 'PU',
      bucketSize: 30,
      hasR10: true,
      color: null,
      basePrice: 3200,
      description: 'Kompletny zestaw żywicy poliuretanowej do garażu z ogrzewaniem podłogowym do 30m². Zawiera dodatek antypoślizgowy R10.',
    },
    {
      sku: 'GAR-EP-50',
      name: 'System epoksydowy 50m²',
      type: 'EP',
      bucketSize: 50,
      hasR10: false,
      color: null,
      basePrice: 3800,
      description: 'Kompletny zestaw żywicy epoksydowej do garażu do 50m². Zawiera: żywicę epoksydową, utwardzacz, instrukcję, narzędzia.',
    },
  ]

  for (const kit of kits) {
    await prisma.productKit.create({
      data: kit,
    })
    console.log(`✅ Created kit: ${kit.name}`)
  }

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
