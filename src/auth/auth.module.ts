import { Logger, Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your_secret_key', // Chave secreta para assinar o token (deve ser armazenada de forma segura)
      signOptions: { expiresIn: '1h' }, // Opções de assinatura (por exemplo, tempo de expiração do token)
    }),
  ],
  controllers: [AuthController],
  providers: [Logger, AuthService, JwtStrategy],
})
export class AuthModule {}
