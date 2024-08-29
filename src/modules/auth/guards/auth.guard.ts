import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Guard de autenticación del sistema de FlowChem
 * @author Santiago Ruiz - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Injectable()
export class AuthGuard implements CanActivate {
  /** Variable para mostrar logs */
  private readonly log: Logger;
  constructor(private readonly jwtService: JwtService) {
    this.log = new Logger(AuthGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    this.log.log('Extrayendo token del encabezado de la solicitud');
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      this.log.error('Token no encontrado en el encabezado de la solicitud');
      throw new UnauthorizedException();
    }

    try {
      this.log.log('Verificando token');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // request['user'] = payload;

      request.user = payload;
      this.log.log('Token verificado correctamente');
    } catch {
      this.log.error('Error al verificar el token');
      throw new UnauthorizedException();
    }

    this.log.log(`Authorization Header: ${request.headers.authorization}`);
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
