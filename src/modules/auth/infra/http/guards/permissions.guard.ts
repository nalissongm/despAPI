import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUserRepository } from '../../../repositories/iuser.repository';
// Assuming these models exist and are imported correctly
import { UserCourseModel } from '../../../../courses/infra/models/user-course.model';
import { UserContentModel } from '../../../../content/infra/models/user-content.model';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;

    if (!user || !user.roles) return false;

    const userRoles = user.roles.map((r: any) => typeof r === 'string' ? r : r.name);

    // Admin has access to everything
    if (userRoles.includes('ADMINISTRATIVE')) return true;

    // Teacher check: Must be assigned to the course
    if (userRoles.includes('TEACHER') && params.courseId) {
      const assignment = await UserCourseModel.findOne({
        where: { user_id: user.id, course_id: params.courseId },
      });
      if (!assignment) {
        throw new ForbiddenException('You are not assigned to this course.');
      }
      return true;
    }

    // Student check: Must have purchased/acquired the content
    if (userRoles.includes('STUDENT') && params.contentId) {
      const access = await UserContentModel.findOne({
        where: { user_id: user.id, content_id: params.contentId },
      });
      if (!access) {
        throw new ForbiddenException('You do not have access to this content.');
      }
      return true;
    }

    return true; // Default to true if no specific permission check is triggered (handled by RolesGuard usually)
  }
}
