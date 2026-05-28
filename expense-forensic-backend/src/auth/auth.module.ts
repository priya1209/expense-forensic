// auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SupabaseStrategy } from './supabase.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.SUPABASE_JWT_SECRET || 'fallback-secret-key',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [SupabaseStrategy],
    exports: [SupabaseStrategy],
})
export class AuthModule { }