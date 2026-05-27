import { Injectable, NotFoundException, Inject, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as fs from 'fs';
import * as path from 'path';
import { CourseModel } from '../infra/models/course.model';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';
import { IStorageProvider } from '../../../shared/containers/storage/istorage.provider';
import { InstructorProfileModel } from '../../instructors/infra/models/instructor-profile.model';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(CourseModel)
    private courseModel: typeof CourseModel,
    @InjectModel(InstructorProfileModel)
    private instructorProfileModel: typeof InstructorProfileModel,
    @Inject(IStorageProvider)
    private storageProvider: IStorageProvider,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<CourseModel> {
    const instructor = await this.instructorProfileModel.findByPk(createCourseDto.instructorId);

    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${createCourseDto.instructorId} not found`);
    }

    return this.courseModel.create(createCourseDto as any);
  }

  async findAll(limit: number = 10, offset: number = 0, user?: any): Promise<CourseModel[]> {
    const where: any = {};

    if (user) {
      const roles = user.roles || [];
      const isAdmin = roles.some((role: any) => {
        const roleName = typeof role === 'string' ? role : role.name;
        return roleName.toUpperCase() === 'ADMIN';
      });

      const isInstructor = roles.some((role: any) => {
        const roleName = typeof role === 'string' ? role : role.name;
        return roleName.toUpperCase() === 'INSTRUCTOR';
      });

      if (isInstructor && !isAdmin) {
        const instructorProfile = await this.instructorProfileModel.findOne({
          where: { userId: user.id },
        });
        if (instructorProfile) {
          where.instructorId = instructorProfile.id;
        } else {
          // If user is instructor but has no profile, they shouldn't see anything they teach
          where.instructorId = 'none';
        }
      }
    }

    return this.courseModel.findAll({
      limit,
      offset,
      where,
      include: [{ model: InstructorProfileModel, as: 'instructor' }],
    });
  }

  async findOne(id: string): Promise<CourseModel> {
    const course = await this.courseModel.findByPk(id, {
      include: [{ model: InstructorProfileModel, as: 'instructor' }],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, user: any): Promise<CourseModel> {
    const course = await this.findOne(id);

    await this.checkOwnership(course, user);

    await course.update(updateCourseDto);
    return course;
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await course.destroy(); // Hard delete as requested
  }

  async uploadCover(id: string, filename: string, user: any): Promise<CourseModel> {
    const course = await this.courseModel.findByPk(id);

    // FIX: Path was going up 5 levels, should go up 4 to reach root from src/modules/courses/usecases
    const tempPath = path.resolve(__dirname, '..', '..', '..', '..', 'tmp', 'uploads', filename);

    if (!course) {
      // GARBAGE COLLECTION: Delete temp file if course not found
      if (fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath);
      }
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    await this.checkOwnership(course, user);

    try {
      if (course.imageCourseUrl) {
        await this.storageProvider.deleteFile(course.imageCourseUrl, 'courses/covers');
      }

      const savedFilename = await this.storageProvider.saveFile(filename, 'courses/covers');

      course.imageCourseUrl = savedFilename;
      await course.save();

      return course;
    } catch (err) {
      // GARBAGE COLLECTION: Ensure temp file is removed if moving failed
      if (fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath);
      }
      throw err;
    } finally {
      // GARBAGE COLLECTION: Ensure temp file is removed after processing (if it still exists)
      if (fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath);
      }
    }
  }

  private async checkOwnership(course: CourseModel, user: any): Promise<void> {
    const roles = user.roles || [];
    const isAdmin = roles.some((role: any) => {
      const roleName = typeof role === 'string' ? role : role.name;
      return roleName.toUpperCase() === 'ADMIN';
    });

    if (isAdmin) {
      return;
    }

    const isInstructor = roles.some((role: any) => {
      const roleName = typeof role === 'string' ? role : role.name;
      return roleName.toUpperCase() === 'INSTRUCTOR';
    });

    if (isInstructor) {
      const instructorProfile = await this.instructorProfileModel.findOne({
        where: { userId: user.id },
      });

      if (!instructorProfile || course.instructorId !== instructorProfile.id) {
        throw new ForbiddenException('You can only edit your own courses');
      }
    }
  }
}
