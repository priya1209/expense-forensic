import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ForensicService } from 'src/forensic.service';
import { PrismaService } from 'src/prisma.service';


@Controller('expenses')
export class ExpensesController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly forensic: ForensicService
    ) { }

    @Get()
    async getAllExpenses() {
        return this.prisma.expense.findMany({ orderBy: { date: 'desc' } });
    }

    @Get('analysis')
    @UseGuards(AuthGuard('jwt'))
    async getAnalysis(@Request() req) {
        console.log('🔍 Analysis endpoint accessed by user:', req.user);
        return this.forensic.analyzeSpending();
    }

    // --- 1. POST for SMS ---
    @Post('ingest/sms')
    @UseGuards(AuthGuard('jwt'))
    async handleSms(@Body() body: { rawText: string; userId: string }) {
        const parsed = this.forensic.parseSms(body.rawText);
        return this.prisma.expense.create({
            data: { ...parsed, userId: body.userId }
        });
    }

    // --- 2. POST for CSV ---
    @Post('ingest/csv')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file'))
    async handleCsv(
        @UploadedFile() file: Express.Multer.File,
        @Query('userId') userId: string
    ) {
        return this.forensic.parseCsv(file.buffer, userId);
    }
}