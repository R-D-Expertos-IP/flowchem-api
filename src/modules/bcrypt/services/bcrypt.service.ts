import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

/**
 * Servicio de Encriptación del sistema de FlowChemical
 * Este servicio proporciona métodos para hashear contraseñas y comparar contraseñas con su versión hasheada.
 * @author Santiago Ruiz  - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Injectable()
export class BcryptService {
  /**
   * @method Método para hashear una contraseña.
   * @param password: La contraseña en texto plano.
   * @returns Promise<string>: Devuelve una promesa que se resuelve con la contraseña hasheada.
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt();
    return bcryptjs.hash(password, salt);
  }

  /**
   * @method Método para comparar una contraseña en texto plano con una contraseña hasheada.
   * @param password: La contraseña en texto plano.
   * @param hashedPassword: La contraseña hasheada.
   * @returns Promise<boolean>: Devuelve una promesa que se resuelve con true si las contraseñas coinciden, false en caso contrario.
   */
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcryptjs.compare(password, hashedPassword);
  }
}
