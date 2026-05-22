import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CourseModel } from './infra/models/course.model';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { IStorageProvider } from '../../shared/containers/storage/istorage.provider';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(CourseModel)
    private readonly courseModel: typeof CourseModel,
    @Inject(IStorageProvider)
    private readonly storageProvider: IStorageProvider,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<CourseModel> {
    return this.courseModel.create(createCourseDto as any);
  }

  async findAll(limit: number = 10, offset: number = 0): Promise<{ rows: CourseModel[]; count: number }> {
    return this.courseModel.findAndCountAll({
      limit,
      offset,
    });
  }

  async findOne(id: string): Promise<CourseModel> {
    const course = await this.courseModel.findByPk(id);

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<CourseModel> {
    const course = await this.findOne(id);
    return course.update(updateCourseDto);
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await course.destroy();
  }

  async updateCover(id: string, file: Express.Multer.File): Promise<CourseModel> {
    const course = await this.findOne(id);
    const tempFilePath = path.resolve('tmp', 'uploads', file.filename);

    try {
      const fileName = await this.storageProvider.saveFile(file.filename, 'courses/covers');

      if (course.imageCourseUrl) {
        await this.storageProvider.deleteFile(course.imageCourseUrl, 'courses/covers');
      }

      return await course.update({ imageCourseUrl: fileName });
    } catch (error) {
      throw error;
    } finally {
      try {
        if (fs.existsSync(tempFilePath)) {
          await fs.promises.unlink(tempFilePath);
        }
      } catch (err) {
        // Fail silently on unlink error to avoid disrupting the response
      }
    }
  }
}
