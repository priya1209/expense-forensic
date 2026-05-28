import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { PrismaService } from '../prisma.service';
import { ForensicService } from '../forensic.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ExpensesService, PrismaService, ForensicService],
  controllers: [ExpensesController],
})
export class ExpensesModule { }
