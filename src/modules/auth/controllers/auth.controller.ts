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
import { Request } from '@nestjs/common';
import { EUser } from 'src/modules/users/entities/user.entity';
import { GetUser } from 'src/modules/decorators/getUser';

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
   * @method: Método GET para el dashboard del usuario.
   * @returns Información del usuario autenticado.
   */
  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  dashboard(@Request() req) {
    return req.user;
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
      this.log.log('Proceso de traida de datos exitoso');
      return user;
    } catch (error) {
      this.log.error('Error durante la traida de datos', error);
      throw error;
    }
  }
}
