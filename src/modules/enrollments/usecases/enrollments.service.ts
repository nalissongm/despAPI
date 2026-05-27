import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EnrollmentModel } from '../infra/models/enrollment.model';
import { CreateEnrollmentDto, EnrollmentStatus } from '../dtos/create-enrollment.dto';
import { UserModel } from '../../auth/infra/models/user.model';
import { CourseModel } from '../../courses/infra/models/course.model';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel(EnrollmentModel)
    private enrollmentModel: typeof EnrollmentModel,
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
    @InjectModel(CourseModel)
    private courseModel: typeof CourseModel,
  ) {}

  async createEnrollment(dto: CreateEnrollmentDto): Promise<EnrollmentModel> {
    const { userId, courseId } = dto;

    // Validate if user exists
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Validate if course exists
    const course = await this.courseModel.findByPk(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Check if user already has an ACTIVE enrollment for this course
    const existingEnrollment = await this.enrollmentModel.findOne({
      where: {
        userId,
        courseId,
        status: EnrollmentStatus.ACTIVE,
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('User already has an active enrollment for this course');
    }

    return this.enrollmentModel.create(dto as any);
  }

  async validateAccess(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await this.enrollmentModel.findOne({
      where: {
        userId,
        courseId,
        status: EnrollmentStatus.ACTIVE,
      },
    });

    return !!enrollment;
  }

  async findByUser(userId: string): Promise<EnrollmentModel[]> {
    return this.enrollmentModel.findAll({
      where: { userId },
      include: [{ model: CourseModel }],
    });
  }
}
