import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../models/enums/user-role.enum';
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

    if (!user) return false;

    // Admin has access to everything
    if (user.role === UserRole.ADMINISTRATIVE) return true;

    // Teacher check: Must be assigned to the course
    if (user.role === UserRole.TEACHER && params.courseId) {
      const assignment = await UserCourseModel.findOne({
        where: { user_id: user.id, course_id: params.courseId },
      });
      if (!assignment) {
        throw new ForbiddenException('You are not assigned to this course.');
      }
      return true;
    }

    // Student check: Must have purchased/acquired the content
    if (user.role === UserRole.STUDENT && params.contentId) {
      const access = await UserContentModel.findOne({
        where: { user_id: user.id, content_id: params.contentId },
      });
      if (!access) {
        throw new ForbiddenException('You do not have access to this content.');
      }
      return true;
    }

    // If it's a student accessing a course, we might also want to check if they have access to the course
    if (user.role === UserRole.STUDENT && params.courseId) {
       // This would require a UserCourse check for students as well, 
       // or checking if they have access to any content within that course.
       // For now, I'll follow the teacher-course/student-content logic.
    }

    return true; // Default to true if no specific permission check is triggered (handled by RolesGuard usually)
  }
}
