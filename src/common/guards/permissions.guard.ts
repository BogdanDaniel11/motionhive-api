import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from '../../modules/role/role.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { apiError } from '../i18n';

/**
 * PermissionsGuard
 *
 * Checks if user has ALL required permissions
 * Use AFTER JwtAuthGuard
 *
 * Usage:
 * @UseGuards(JwtAuthGuard, PermissionsGuard)
 * @Permissions('user.create', 'user.update')
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(apiError('common.unauthorized'));
    }

    const hasAllPermissions = await this.roleService.userHasAllPermissions(
      user.id,
      requiredPermissions,
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(apiError('common.forbidden'));
    }

    return true;
  }
}
