import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { DLoginDto } from '../dtos/login.dto';
import { BcryptService } from 'src/modules/bcrypt/services/bcrypt.service';
import { RAuthRepository } from '../repositories/auth.repo';
import { JwtService } from '@nestjs/jwt';

/**
 * Servicio de Autentitación del sistema de FlowChemical
 * @author Santiago Ruiz  - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Injectable()
export class SAuthService {
  private readonly log: Logger;
  constructor(
    private readonly authRepository: RAuthRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {
    this.log = new Logger(SAuthService.name);
  }

  /**
   * @method Método para autenticar a un usuario.
   * @param loginDto: Un objeto que contiene las credenciales de inicio de sesión del usuario (username y contraseña).
   * @returns {Username: string}: Devuelve un objeto que contiene el correo electrónico del usuario si la autenticación es exitosa.
   * @throws UnauthorizedException: Lanza una excepción si el correo electrónico no se encuentra o si la contraseña no coincide.
   */
  async getLoginRequestService(loginDto: DLoginDto) {
    const user = await this.authRepository.findByUsernameWithPassword(
      loginDto.Username,
    );

    if (!user) {
      throw new UnauthorizedException('El nombre de usuario es incorrecto.');
    }

    if (!user.Active) {
      this.log.log(`El usuario ${user.CardName} está inactivo.`);
      throw new UnauthorizedException('Este usuario no está activo.');
    }

    // this.log.debug('loginDto.Password:', loginDto.Password);
    // this.log.debug('user.Password:', user.Password);

    const passwordMatches = await this.bcryptService.comparePassword(
      loginDto.Password,
      user.Password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('La contraseña es incorrecta.');
    }

    const payload = {
      email: user.E_Mail,
      username: user.Username,
      Role: user.Role,
      cardName: user.CardName,
      cardCode: user.CardCode,
      lastLogin: user.LastLogin,
    };

    this.log.log(`Creando token de logueo para ${user.CardName}`);
    const token = await this.jwtService.signAsync(payload);

    if (token) {
      this.log.log(
        `Se ha creado correctamente el token para ${user.CardName}...!`,
      );
    } else {
      this.log.log(`No se pudo crear el token para ${user.CardName}...!`);
    }

    return {
      token,
      E_Mail: user.E_Mail,
      Username: user.Username,
      Role: user.Role,
    };
  }

  async profile({ Username, role }: { Username: string; role: string }) {
    return this.log.debug('Acceso aprobado');
  }
}
