import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        const secret = configService.get<string>('SUPABASE_JWT_SECRET');

        // 1. Check if secret exists; if not, throw an error immediately
        if (!secret) {
            throw new Error('SUPABASE_JWT_SECRET is missing from .env');
        }

        console.log('🔐 JWT Strategy initialized with secret length:', secret.length);

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // 2. We now pass 'secret', which TypeScript knows is definitely a string
            secretOrKey: secret,
        });
    }

    async validate(payload: any) {
        // If the token signature is valid, this runs
        console.log('✅ Token validated for user:', payload.sub);
        return { userId: payload.sub, email: payload.email };
    }

    // Add this method to catch authentication errors
    handleRequest(err, user, info) {
        console.log('🔍 JWT Auth - Error:', err);
        console.log('🔍 JWT Auth - User:', user);
        console.log('🔍 JWT Auth - Info:', info);

        if (err || !user) {
            throw err || new UnauthorizedException('Unauthorized');
        }
        return user;
    }
}