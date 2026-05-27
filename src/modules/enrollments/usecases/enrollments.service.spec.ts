import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentModel } from '../infra/models/enrollment.model';
import { UserModel } from '../../auth/infra/models/user.model';
import { CourseModel } from '../../courses/infra/models/course.model';
import { EnrollmentStatus } from '../dtos/create-enrollment.dto';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let enrollmentModel: typeof EnrollmentModel;
  let userModel: typeof UserModel;
  let courseModel: typeof CourseModel;

  const mockEnrollmentModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockUserModel = {
    findByPk: jest.fn(),
  };

  const mockCourseModel = {
    findByPk: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        {
          provide: getModelToken(EnrollmentModel),
          useValue: mockEnrollmentModel,
        },
        {
          provide: getModelToken(UserModel),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(CourseModel),
          useValue: mockCourseModel,
        },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
    enrollmentModel = module.get<typeof EnrollmentModel>(getModelToken(EnrollmentModel));
    userModel = module.get<typeof UserModel>(getModelToken(UserModel));
    courseModel = module.get<typeof CourseModel>(getModelToken(CourseModel));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEnrollment', () => {
    const dto = {
      userId: 'user-id',
      courseId: 'course-id',
    };

    it('should create an enrollment successfully', async () => {
      mockUserModel.findByPk.mockResolvedValue({ id: 'user-id' });
      mockCourseModel.findByPk.mockResolvedValue({ id: 'course-id' });
      mockEnrollmentModel.findOne.mockResolvedValue(null);
      mockEnrollmentModel.create.mockResolvedValue({ ...dto, id: 'enrollment-id' });

      const result = await service.createEnrollment(dto);

      expect(result).toBeDefined();
      expect(mockEnrollmentModel.create).toHaveBeenCalledWith(dto);
    });

    it('should throw ConflictException if an active enrollment already exists', async () => {
      mockUserModel.findByPk.mockResolvedValue({ id: 'user-id' });
      mockCourseModel.findByPk.mockResolvedValue({ id: 'course-id' });
      mockEnrollmentModel.findOne.mockResolvedValue({ id: 'existing-id' });

      await expect(service.createEnrollment(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserModel.findByPk.mockResolvedValue(null);

      await expect(service.createEnrollment(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if course does not exist', async () => {
      mockUserModel.findByPk.mockResolvedValue({ id: 'user-id' });
      mockCourseModel.findByPk.mockResolvedValue(null);

      await expect(service.createEnrollment(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('validateAccess', () => {
    it('should return true if active enrollment exists', async () => {
      mockEnrollmentModel.findOne.mockResolvedValue({ id: 'enrollment-id' });

      const result = await service.validateAccess('user-id', 'course-id');

      expect(result).toBe(true);
      expect(mockEnrollmentModel.findOne).toHaveBeenCalledWith({
        where: {
          userId: 'user-id',
          courseId: 'course-id',
          status: EnrollmentStatus.ACTIVE,
        },
      });
    });

    it('should return false if no active enrollment exists', async () => {
      mockEnrollmentModel.findOne.mockResolvedValue(null);

      const result = await service.validateAccess('user-id', 'course-id');

      expect(result).toBe(false);
    });
  });
});
