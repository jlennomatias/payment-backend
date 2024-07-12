import { Logger, Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // JwtModule.register({
    //   secret: 'your_secret_key', // Chave secreta para assinar o token (deve ser armazenada de forma segura)
    //   signOptions: { expiresIn: '1h' }, // Opções de assinatura (por exemplo, tempo de expiração do token)
    // }),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importe o ConfigModule no contexto async
      inject: [ConfigService], // Injete o ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY_JWT'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [Logger, AuthService, JwtStrategy],
})
export class AuthModule {}
