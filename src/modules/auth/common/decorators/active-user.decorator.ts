import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * Decorador personalizado para obtener el usuario activo en el contexto de ejecución actual.
 * Este decorador se puede utilizar en los controladores para acceder al usuario activo
 * que está asociado con la solicitud actual.
 * @author Santiago Ruiz - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

export const ActiveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
