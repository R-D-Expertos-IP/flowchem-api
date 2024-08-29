import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  HttpCode,
} from '@nestjs/common';
import { DCreateUserDto } from '../dtos/create-user.dto';
import { SUsersService } from '../services/users.service';
import { IUser } from '../interfaces/user.interface';

/**
 * Controlador de Usuarios del sistema de FlowChemical
 * @author Santiago Ruiz - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Controller('users')
export class CUsersController {
  constructor(private usersService: SUsersService) {}

  /**
   * @method: Método get para traer todos los usuarios existentes.
   * @returns usersService.getAllUsers()
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsersRequest(): Promise<IUser[]> {
    try {
      return await this.usersService.getAllUsersRequestService();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @method: Método post para crear un nuevo usuario.
   * @returns usersService.createUser(newUser)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async postCreateCollaboratorRequest(
    @Body() newUser: DCreateUserDto,
  ): Promise<IUser> {
    try {
      return await this.usersService.createUserRequestService(newUser);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }
}
