import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExpensesService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        amount: number;
        merchant: string;
        category: string;
        userId: string;
    }) {
        return this.prisma.expense.create({
            data,
        });
    }

    async findAll(userId: string) {
        return this.prisma.expense.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        });
    }
}