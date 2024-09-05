import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SAuthService } from '../services/auth.service';
import { DLoginDto } from '../dtos/login.dto';
import { AuthGuard } from '../guards/auth.guard';
import { EUser } from 'src/modules/users/entities/user.entity';
import { GetUser } from 'src/modules/decorators/getUser';
import { Auth } from '../decorators/auth.decorator';
import { Role } from '../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';

/**
 * Controlador de autenticación del sistema de FlowChem
 * @author Santiago Ruiz - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Controller('auth')
export class CAuthController {
  /** Variable para mostrar logs */
  private readonly log: Logger;
  constructor(private readonly authService: SAuthService) {
    this.log = new Logger(CAuthController.name);
  }

  /**
   * @method: Método post para loguearse después de verificar correctamente el registro.
   * @returns Consumo de servicio y dto (loginDto)
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  getLoginRequest(
    @Body()
    loginDto: DLoginDto,
  ) {
    try {
      this.log.log('Iniciando el proceso de Login');
      const result = this.authService.getLoginRequestService(loginDto);
      this.log.log('Proceso de Login finalizado exitosamente');
      return result;
    } catch (error) {
      this.log.error(
        'Ha ocurrido un error durante el proceso de login',
        error.stack,
      );
      throw error;
    }
  }

  /**
   * @method: Método GET para obtener el perfil del usuario.
   * TODO:Ejemplo de guard en caso de que falle el frontend.
   * @returns Perfil del usuario autenticado.
   */
  @Get('profile')
  @Auth(Role.SUPERUSUARIO)
  @HttpCode(HttpStatus.OK)
  profile(@ActiveUser() user: UserActiveInterface) {
    console.log(user);
    return this.authService.profile(user);
  }

  /**
   * @method: Método GET para traer info del usuario.
   * @returns Información del usuario autenticado.
   */
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  getMeUserRequest(@GetUser() user: EUser): EUser {
    try {
      this.log.log('Obteniendo toda la información del Usuario');
      this.log.debug(`Usuario completo: ${JSON.stringify(user)}`);

      if (user && Array.isArray(user.Role)) {
        this.log.log(`Los roles del usuario son: ${user.Role.join(', ')}`);
      } else if (user && user.Role) {
        this.log.log(`El rol del usuario es: ${user.Role}`);
      } else {
        this.log.log('El usuario no tiene roles asignados');
      }

      this.log.log('Proceso de traída de datos exitoso');
      return user;
    } catch (error) {
      this.log.error('Error durante la traída de datos', error);
      throw error;
    }
  }
}
