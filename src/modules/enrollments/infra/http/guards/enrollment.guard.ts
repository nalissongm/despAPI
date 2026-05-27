import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EnrollmentModel } from '../../models/enrollment.model';
import { EnrollmentStatus } from '../../../dtos/create-enrollment.dto';
import { CourseModuleModel } from '../../../../courses/infra/models/course-module.model';
import { LessonModel } from '../../../../courses/infra/models/lesson.model';
import { CourseModel } from '../../../../courses/infra/models/course.model';
import { InstructorProfileModel } from '../../../../instructors/infra/models/instructor-profile.model';
import { EnrollmentsService } from '../../../usecases/enrollments.service';

@Injectable()
export class EnrollmentGuard implements CanActivate {
  constructor(
    private enrollmentsService: EnrollmentsService,
    @InjectModel(CourseModel)
    private courseModel: typeof CourseModel,
    @InjectModel(CourseModuleModel)
    private moduleModel: typeof CourseModuleModel,
    @InjectModel(LessonModel)
    private lessonModel: typeof LessonModel,
    @InjectModel(EnrollmentModel)
    private enrollmentModel: typeof EnrollmentModel,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;

    if (!user) {
      return false;
    }

    // 1. ADMIN check
    const roles = user.roles || [];
    const isAdmin = roles.some((role: any) => {
      const roleName = typeof role === 'string' ? role : role.name;
      return roleName.toLowerCase() === 'admin';
    });

    if (isAdmin) {
      return true;
    }

    // 2. Resolve courseId from parameters
    let courseId = params.courseId;

    if (!courseId) {
      if (params.moduleId) {
        const module = await this.moduleModel.findByPk(params.moduleId);
        if (!module) throw new NotFoundException('Module not found');
        courseId = module.courseId;
      } else if (params.lessonId || (request.route.path.includes('lessons') && params.id)) {
        const lessonId = params.lessonId || params.id;
        const lesson = await this.lessonModel.findByPk(lessonId, {
          include: [{ model: CourseModuleModel }],
        });
        if (!lesson) throw new NotFoundException('Lesson not found');
        courseId = lesson.module.courseId;
      } else if (params.id && (request.route.path.includes('courses') || request.route.path === '/courses/:id')) {
        courseId = params.id;
      } else if (params.id && request.route.path.includes('modules')) {
        const module = await this.moduleModel.findByPk(params.id);
        if (!module) throw new NotFoundException('Module not found');
        courseId = module.courseId;
      }
    }

    if (!courseId) {
      return true; // No course context found, allow through (other guards may catch it)
    }

    // 3. INSTRUCTOR check (must be the instructor of THIS course)
    const course = await this.courseModel.findByPk(courseId, {
      include: [{ model: InstructorProfileModel }],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    if (course.instructor && course.instructor.userId === user.id) {
      return true;
    }

    // 4. STUDENT check (enrollment check)
    const hasAccess = await this.enrollmentsService.validateAccess(user.id, courseId);

    if (!hasAccess) {
      throw new ForbiddenException(
        'Access denied. You do not have an active enrollment for this course.',
      );
    }

    return true;
  }
}
