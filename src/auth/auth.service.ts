import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    private jwtService: JwtService,
    config: ConfigService,
  ) {
    this.clientId = config.get('CLIENT_ID_SERVICE');
    this.clientSecret = config.get('CLIENT_SECRET_SERVICE');
  }

  async validateUser(authDto: any): Promise<any> {
    if (
      this.clientId == authDto.client_id &&
      this.clientSecret == authDto.client_secret
    ) {
      return true;
    }

    throw new UnauthorizedException('Access token is missing or invalid');
  }

  async login(authDto: AuthDto) {
    if (
      this.clientId == authDto.client_id &&
      this.clientSecret == authDto.client_secret
    ) {
      const payload = {
        client_id: authDto.client_id,
        client_secret: authDto.client_secret,
      };

      return {
        access_token: this.jwtService.sign(payload),
        expires_in: '1h',
      };
    }

    throw new UnauthorizedException('Access token is missing or invalid');
  }
}
