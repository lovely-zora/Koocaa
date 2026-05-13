import 'dotenv/config' // <-- THIS FIXES THE ERROR
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

// 1. Initialize the PostgreSQL adapter for Prisma 7
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 2. Create the Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'koocaa-hq' },
    update: {},
    create: {
      name: 'Koocaa Headquarters',
      slug: 'koocaa-hq',
      currency: 'USD',
    },
  })

  // 3. Hash the password
  const hashedPassword = await bcrypt.hash('password123', 10)

  // 4. Create the Admin User
  const user = await prisma.user.upsert({
    where: { email: 'admin@koocaa.com' },
    update: {},
    create: {
      email: 'admin@koocaa.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      organizationId: org.id,
    },
  })

  console.log('✅ Seed successful! You can now log in with:')
  console.log('👉 Email: admin@koocaa.com')
  console.log('👉 Password: password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // 5. Cleanly disconnect both Prisma and the PG Pool
    await prisma.$disconnect()
    await pool.end()
  })
