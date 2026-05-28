import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // This is the specific format Prisma 7 wants:
    seed: 'ts-node ./prisma/seed.ts',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});