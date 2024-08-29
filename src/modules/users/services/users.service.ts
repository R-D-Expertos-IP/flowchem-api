import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { RUserRepository } from '../repositories/user.repo';
import { DCreateUserDto } from '../dtos/create-user.dto';
import { IUser } from '../interfaces/user.interface';

/**
 * Servicio de Usuarios del sistema de FlowChemical
 * @author Santiago Ruiz  - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Injectable()
export class SUsersService {
  private readonly log: Logger;
  constructor(private userRepository: RUserRepository) {
    this.log = new Logger(SUsersService.name);
  }

  /**
   * @method: Método para acceder al repo y traer todos los usuarios.
   * @returns userRepository.getAllUsers()
   */
  async getAllUsersRequestService(): Promise<IUser[]> {
    try {
      this.log.log(`Obteniendo todos los usuarios...`);
      const users = await this.userRepository.getAllUsersRequestRepo();
      this.log.log(`Se obtuvo un total de ${users.length} usuarios.`);
      return users;
    } catch (error) {
      this.log.error(`Error al obtener todos los usuarios: ${error.message}`);
      throw error;
    }
  }

  /**
   * @method: Método para acceder al repo y crear un usuario.
   * @returns userRepository.createUser(user)
   */
  async createUserRequestService(user: DCreateUserDto): Promise<IUser> {
    try {
      this.log.log(`Creando nuevo usuario...`);
      const newUser = await this.userRepository.createUserRequestRepo(user);
      this.log.log(`¡Se creo exitosamente el nuevo usuario!`);
      return newUser;
    } catch (error) {
      this.log.error(`Error al crear usuario: ${error.message}`);
      throw new HttpException(
        'Internal server errror',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
