import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EnrollmentModel } from '../infra/models/enrollment.model';
import { UserModel } from '../../auth/infra/models/user.model';
import { CourseModel } from '../../courses/infra/models/course.model';
import { CreateEnrollmentDto } from '../dtos/create-enrollment.dto';

@Injectable()
export class CreateEnrollmentUseCase {
  constructor(
    @InjectModel(EnrollmentModel)
    private readonly enrollmentModel: typeof EnrollmentModel,
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    @InjectModel(CourseModel)
    private readonly courseModel: typeof CourseModel,
  ) {}

  async execute(data: CreateEnrollmentDto): Promise<EnrollmentModel> {
    const user = await this.userModel.findByPk(data.userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const course = await this.courseModel.findByPk(data.courseId);
    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    const enrollmentExists = await this.enrollmentModel.findOne({
      where: { userId: data.userId, courseId: data.courseId },
    });

    if (enrollmentExists) {
      throw new ConflictException('User is already enrolled in this course.');
    }

    const enrolledAt = new Date();
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year duration

    return this.enrollmentModel.create({
      userId: data.userId,
      courseId: data.courseId,
      status: 'active',
      enrolledAt,
      expiresAt,
    } as any);
  }
}
