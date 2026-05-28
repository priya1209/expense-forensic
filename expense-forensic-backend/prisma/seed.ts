#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log('--- Starting Seed ---');

    // 1. Create a Test User
    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
        },
    });

    // 2. Add some "Forensic" Data
    const expenses = [
        { amount: 12.99, merchant: 'Netflix', category: 'Subscription', userId: user.id },
        { amount: 45.50, merchant: 'Shell Gas', category: 'Transport', userId: user.id },
        { amount: 120.00, merchant: 'Apple Store', category: 'Electronics', userId: user.id },
        { amount: 15.00, merchant: 'Starbucks', category: 'Food', userId: user.id },
        { amount: 12.99, merchant: 'Netflix', category: 'Subscription', userId: user.id }, // Duplicate for leak testing!
    ];

    for (const exp of expenses) {
        await prisma.expense.create({ data: exp });
    }

    console.log('--- Seed Complete: 5 Expenses Added ---');
}

main()
    .catch((e) => console.error(e))
    .finally(() => process.exit(0));