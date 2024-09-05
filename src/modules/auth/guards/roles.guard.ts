import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../common/enums/rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.debug(`Roles from decorator: ${JSON.stringify(roles)}`);

    if (!roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.Role) {
      this.logger.error('User or Role not defined');
      return false;
    }

    // Convertir el rol a minúsculas para comparación
    const userRole = user.Role.toLowerCase();
    this.logger.debug(`User role: ${userRole}`);

    if (userRole === Role.SUPERUSUARIO.toLowerCase()) {
      return true;
    }

    const rolesArray = Array.isArray(roles) ? roles : [roles];
    this.logger.debug(`Roles array: ${JSON.stringify(rolesArray)}`);

    return rolesArray.some((role) => role.toLowerCase() === userRole);
  }
}
