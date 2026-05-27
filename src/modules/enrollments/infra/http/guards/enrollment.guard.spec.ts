import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { EnrollmentGuard } from './enrollment.guard';
import { EnrollmentsService } from '../../../usecases/enrollments.service';
import { CourseModel } from '../../../../courses/infra/models/course.model';
import { CourseModuleModel } from '../../../../courses/infra/models/course-module.model';
import { LessonModel } from '../../../../courses/infra/models/lesson.model';
import { EnrollmentModel } from '../../models/enrollment.model';

describe('EnrollmentGuard', () => {
  let guard: EnrollmentGuard;
  let enrollmentsService: EnrollmentsService;
  let courseModel: typeof CourseModel;

  const mockEnrollmentsService = {
    validateAccess: jest.fn(),
  };

  const mockCourseModel = {
    findByPk: jest.fn(),
  };

  const mockModuleModel = {
    findByPk: jest.fn(),
  };

  const mockLessonModel = {
    findByPk: jest.fn(),
  };

  const mockEnrollmentModel = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentGuard,
        {
          provide: EnrollmentsService,
          useValue: mockEnrollmentsService,
        },
        {
          provide: getModelToken(CourseModel),
          useValue: mockCourseModel,
        },
        {
          provide: getModelToken(CourseModuleModel),
          useValue: mockModuleModel,
        },
        {
          provide: getModelToken(LessonModel),
          useValue: mockLessonModel,
        },
        {
          provide: getModelToken(EnrollmentModel),
          useValue: mockEnrollmentModel,
        },
      ],
    }).compile();

    guard = module.get<EnrollmentGuard>(EnrollmentGuard);
    enrollmentsService = module.get<EnrollmentsService>(EnrollmentsService);
    courseModel = module.get<typeof CourseModel>(getModelToken(CourseModel));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockContext = (user: any, params: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          params,
          route: { path: '/courses/:id' }
        }),
      }),
    } as any;
  };

  it('should allow access for ADMIN', async () => {
    const context = createMockContext({ id: 'admin-id', roles: ['admin'] }, { id: 'course-id' });
    
    const result = await guard.canActivate(context);
    
    expect(result).toBe(true);
  });

  it('should allow access for course INSTRUCTOR', async () => {
    const user = { id: 'instructor-user-id', roles: ['instructor'] };
    const context = createMockContext(user, { id: 'course-id' });
    
    mockCourseModel.findByPk.mockResolvedValue({
      id: 'course-id',
      instructor: { userId: 'instructor-user-id' }
    });

    const result = await guard.canActivate(context);
    
    expect(result).toBe(true);
  });

  it('should allow access for STUDENT with active enrollment', async () => {
    const user = { id: 'student-id', roles: ['student'] };
    const context = createMockContext(user, { id: 'course-id' });
    
    mockCourseModel.findByPk.mockResolvedValue({
      id: 'course-id',
      instructor: { userId: 'other-id' }
    });
    mockEnrollmentsService.validateAccess.mockResolvedValue(true);

    const result = await guard.canActivate(context);
    
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException for STUDENT without active enrollment', async () => {
    const user = { id: 'student-id', roles: ['student'] };
    const context = createMockContext(user, { id: 'course-id' });
    
    mockCourseModel.findByPk.mockResolvedValue({
      id: 'course-id',
      instructor: { userId: 'other-id' }
    });
    mockEnrollmentsService.validateAccess.mockResolvedValue(false);

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException if course is not found', async () => {
    const user = { id: 'student-id', roles: ['student'] };
    const context = createMockContext(user, { id: 'non-existent-id' });
    
    mockCourseModel.findByPk.mockResolvedValue(null);

    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
  });

  it('should return true if no course context is resolved', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'user-id', roles: ['student'] },
          params: {},
          route: { path: '/other' }
        }),
      }),
    } as any;
    
    const result = await guard.canActivate(context);
    
    expect(result).toBe(true);
  });
});
