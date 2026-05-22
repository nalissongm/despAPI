import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LessonModel } from '../infra/models/lesson.model';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { ReorderDto } from '../dtos/reorder.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(LessonModel)
    private lessonModel: typeof LessonModel,
  ) {}

  async create(moduleId: string, createLessonDto: CreateLessonDto): Promise<LessonModel> {
    const maxOrder = await this.lessonModel.max('orderIndex', {
      where: { moduleId },
    });

    const nextOrder = isNaN(maxOrder as number) ? 0 : (maxOrder as number) + 1;

    return this.lessonModel.create({
      ...createLessonDto,
      moduleId,
      orderIndex: nextOrder,
    } as any);
  }

  async findAll(moduleId: string): Promise<LessonModel[]> {
    return this.lessonModel.findAll({
      where: { moduleId },
      order: [['orderIndex', 'ASC']],
    });
  }

  async findOne(id: string): Promise<LessonModel> {
    const lesson = await this.lessonModel.findByPk(id);

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: any): Promise<LessonModel> {
    const lesson = await this.findOne(id);
    await lesson.update(updateLessonDto);
    return lesson;
  }

  async remove(id: string): Promise<void> {
    const lesson = await this.findOne(id);
    await lesson.destroy();
  }

  async reorder(moduleId: string, reorderDto: ReorderDto): Promise<void> {
    const transaction = await this.lessonModel.sequelize.transaction();
    try {
      for (const item of reorderDto.orders) {
        await this.lessonModel.update(
          { orderIndex: item.newOrderIndex },
          {
            where: { id: item.id, moduleId },
            transaction,
          },
        );
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
