import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as fs from 'fs';
import * as path from 'path';
import { CourseModel } from '../infra/models/course.model';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';
import { IStorageProvider } from '../../../shared/containers/storage/istorage.provider';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(CourseModel)
    private courseModel: typeof CourseModel,
    @Inject(IStorageProvider)
    private storageProvider: IStorageProvider,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<CourseModel> {
    return this.courseModel.create(createCourseDto as any);
  }

  async findAll(limit: number = 10, offset: number = 0): Promise<CourseModel[]> {
    return this.courseModel.findAll({
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
    await course.update(updateCourseDto);
    return course;
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await course.destroy(); // Hard delete as requested
  }

  async uploadCover(id: string, filename: string): Promise<CourseModel> {
    const course = await this.courseModel.findByPk(id);

    const tempPath = path.resolve(__dirname, '..', '..', '..', '..', '..', 'tmp', 'uploads', filename);

    if (!course) {
      // GARBAGE COLLECTION: Delete temp file if course not found
      if (fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath);
      }
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

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
}
