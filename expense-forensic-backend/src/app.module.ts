// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExpensesModule } from './expenses/expenses.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes SUPABASE_JWT_SECRET available everywhere
    }),
    AuthModule,
    ExpensesModule,
  ],
})
export class AppModule { }