import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { EUser } from 'src/modules/users/entities/user.entity';

/**
 * Repositorio de Autenticación del sistema de FlowChemical
 * @author Santiago Ruiz - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Injectable()
export class RAuthRepository {
  private readonly log: Logger;

  constructor(
    @InjectRepository(EUser)
    public readonly dbInstanceAllData: Repository<EUser>,
  ) {
    this.log = new Logger(RAuthRepository.name);
  }

  /**
   * @method: Método para buscar un usuario por username y obtener su contraseña.
   * @param Username: El username del usuario.
   * @returns ILogin: Devuelve un objeto de usuario si se encuentra uno, de lo contrario devuelve null.
   */
  async findByUsernameWithPassword(Username: string) {
    this.log.log(`RAuthRepository > Buscando usuario por username...`);
    const user = await this.dbInstanceAllData.findOne({
      where: { Username },
      select: [
        'IdUsuario',
        'CardName',
        'CardCode',
        'Username',
        'E_Mail',
        'Password',
        'Role',
        'Active',
      ],
    });
    if (user) {
      this.log.log(`RAuthRepository > Usuario encontrado: ${user.CardName}`);
      this.log.log(
        `RAuthRepository > Estado del usuario: ${user.Active ? 'Activo' : 'Inactivo'}`,
      );
    } else {
      this.log.log(
        `RAuthRepository > No se encontró usuario con el username: ${Username}`,
      );
    }
    return user;
  }
}
