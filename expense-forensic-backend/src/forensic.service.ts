import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as Papa from 'papaparse';

@Injectable()
export class ForensicService {
    constructor(private prisma: PrismaService) { }

    // --- NEW: SMS Parser (Regex) ---
    parseSms(text: string) {
        const amountMatch = text.match(/(?:[\$]|INR|Rs\.?)\s?(\d+(?:\.\d{1,2})?)/i);
        const merchantMatch = text.match(/(?:at|to|spent on)\s+([A-Za-z0-9\s*\-]+?)(?:\s+on|via|using|$)/i);

        const merchant = merchantMatch ? merchantMatch[1].trim() : 'Unknown Merchant';

        return {
            amount: amountMatch ? parseFloat(amountMatch[1]) : 0,
            merchant: merchant,
            category: this.autoCategorize(merchant),
        };
    }

    // --- NEW: CSV Parser ---
    async parseCsv(fileBuffer: Buffer, userId: string) {
        const csvString = fileBuffer.toString();
        const parsed = Papa.parse(csvString, { header: true, skipEmptyLines: true });

        const results = parsed.data.map((row: any) => {
            const merchant = row.Description || row.Merchant || row.Details || 'Unknown';
            return {
                amount: parseFloat(row.Amount || row.Price || 0),
                merchant: merchant,
                category: this.autoCategorize(merchant),
                userId: userId,
            };
        });

        return this.prisma.expense.createMany({ data: results });
    }

    // --- NEW: Forensic Intelligence (Categorization) ---
    private autoCategorize(merchant: string): string {
        const m = merchant.toLowerCase();
        if (m.includes('uber') || m.includes('ola') || m.includes('shell')) return 'Transport';
        if (m.includes('zomato') || m.includes('swiggy') || m.includes('starbucks')) return 'Food';
        if (m.includes('netflix') || m.includes('spotify') || m.includes('amazon prime')) return 'Subscription';
        return 'General';
    }

    async analyzeSpending() {
        const expenses = await this.prisma.expense.findMany();

        // 1. Detect "Subscription Leaks" (Same merchant, same amount, multiple times)
        const leaks = expenses.filter((expense, index, self) =>
            self.findIndex(e => e.merchant === expense.merchant && e.amount === expense.amount) !== index
        );

        // 2. Calculate Category Totals
        const breakdown = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalSpent: expenses.reduce((sum, e) => sum + e.amount, 0),
            breakdown,
            potentialLeaks: leaks.map(l => `${l.merchant} ($${l.amount})`),
            status: leaks.length > 0 ? '⚠️ High Risk' : '✅ Clear'
        };
    }
}