import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class OrganizationManagerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (
      !user ||
      (user.userType !== 'ORGANIZATION' && user.userType !== 'MANAGER')
    ) {
      throw new ForbiddenException(
        'Access denied. Organization or Manager access required.',
      );
    }

    return true;
  }
}
