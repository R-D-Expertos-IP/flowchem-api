import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      message: 'API FLOW-CHEM - ¡CONEXIÓN EXITOSA!',
      author: 'Santiago Ruiz',
      email: 'desarrollo3@expertosip.com',
      year: 2024,
    };
  }
}
