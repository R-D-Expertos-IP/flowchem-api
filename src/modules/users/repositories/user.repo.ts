import { Repository } from 'typeorm';
import { IUser } from '../interfaces/user.interface';
import { EUser } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BcryptService } from 'src/modules/bcrypt/services/bcrypt.service';
import { DCreateUserDto } from '../dtos/create-user.dto';

/**
 * Repositorio de Usuarios del sistema de FlowChemical
 * @author Santiago Ruiz - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Injectable()
export class RUserRepository {
  private readonly log: Logger;

  constructor(
    @InjectRepository(EUser)
    public readonly dbInstanceAllData: Repository<EUser>,
    private readonly bcryptService: BcryptService,
  ) {
    this.log = new Logger(RUserRepository.name);
  }

  /**
   * @method: Método para acceder a la DB y traer todos los usuarios.
   * @returns dbInstance.find()
   */
  async getAllUsersRequestRepo(): Promise<IUser[]> {
    try {
      return await this.dbInstanceAllData.find();
    } catch (error) {
      this.log.error(`Error al obtener todos los usuarios: ${error.message}`);
      throw error;
    }
  }

  /**
   * @method: Método para verificar si ya existe un usuario con el mismo emailCompany.
   * @param emailCompany: El emailCompany del usuario.
   * @returns boolean
   */
  async emailCompanyExists(E_Mail: string): Promise<boolean> {
    try {
      const user = await this.dbInstanceAllData.findOne({
        where: { E_Mail },
      });
      return !!user;
    } catch (error) {
      this.log.error(`Error al verificar el emailCompany: ${error.message}`);
      throw error;
    }
  }

  /**
   * @method: Método para acceder a la DB y crear un usuario.
   * @returns dbInstance.save(newUser)
   */
  async createUserRequestRepo(user: DCreateUserDto): Promise<IUser> {
    try {
      if (await this.emailCompanyExists(user.E_Mail)) {
        throw new BadRequestException(
          'Ya existe un usuario con el mismo emailCompany',
        );
      }

      const hashedPassword = await this.bcryptService.hashPassword(
        user.Password,
      );

      const newUser = this.dbInstanceAllData.create({
        ...user,
        Password: hashedPassword,
      });
      await this.dbInstanceAllData.save(newUser);
      return newUser;
    } catch (error) {
      this.log.error(`Error al crear usuario: ${error.message}`);
      throw error;
    }
  }
}
