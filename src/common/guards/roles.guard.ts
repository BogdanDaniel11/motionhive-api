import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from '../../modules/role/role.service';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { apiError } from '../i18n';

/**
 * RolesGuard
 *
 * Checks if user has any of the required roles
 * Use AFTER JwtAuthGuard
 *
 * Usage:
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('ADMIN', 'INSTRUCTOR')
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: { id: string; roles?: unknown } }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(apiError('common.unauthorized'));
    }

    // JwtStrategy already attaches the user's global role names, so the
    // common case needs no query. Principals from other strategies (the
    // SSE token strategy returns only `{ id }`) fall back to the DB.
    const attachedRoles = Array.isArray(user.roles)
      ? user.roles.filter((role): role is string => typeof role === 'string')
      : null;
    const hasRole = attachedRoles
      ? requiredRoles.some((role) => attachedRoles.includes(role))
      : await this.roleService.userHasAnyRole(user.id, requiredRoles);

    if (!hasRole) {
      // Say "coaches only" when that is what the route needs; any other
      // role list (admin, support, writer) gets the plain refusal.
      throw new ForbiddenException(
        apiError(
          requiredRoles.includes('INSTRUCTOR')
            ? 'common.coachesOnly'
            : 'common.forbidden',
        ),
      );
    }

    return true;
  }
}
