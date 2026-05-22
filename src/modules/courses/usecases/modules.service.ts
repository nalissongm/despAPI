import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CourseModuleModel } from '../infra/models/course-module.model';
import { CreateModuleDto } from '../dtos/create-module.dto';
import { ReorderDto } from '../dtos/reorder.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(CourseModuleModel)
    private moduleModel: typeof CourseModuleModel,
  ) {}

  async create(courseId: string, createModuleDto: CreateModuleDto): Promise<CourseModuleModel> {
    const maxOrder = await this.moduleModel.max('orderIndex', {
      where: { courseId },
    });

    const nextOrder = isNaN(maxOrder as number) ? 0 : (maxOrder as number) + 1;

    return this.moduleModel.create({
      ...createModuleDto,
      courseId,
      orderIndex: nextOrder,
    } as any);
  }

  async findAll(courseId: string): Promise<CourseModuleModel[]> {
    return this.moduleModel.findAll({
      where: { courseId },
      order: [['orderIndex', 'ASC']],
    });
  }

  async findOne(id: string): Promise<CourseModuleModel> {
    const module = await this.moduleModel.findByPk(id);

    if (!module) {
      throw new NotFoundException(`CourseModule with ID ${id} not found`);
    }

    return module;
  }

  async update(id: string, updateModuleDto: any): Promise<CourseModuleModel> {
    const module = await this.findOne(id);
    await module.update(updateModuleDto);
    return module;
  }

  async remove(id: string): Promise<void> {
    const module = await this.findOne(id);
    await module.destroy();
  }

  async reorder(courseId: string, reorderDto: ReorderDto): Promise<void> {
    const transaction = await this.moduleModel.sequelize.transaction();
    try {
      for (const item of reorderDto.orders) {
        await this.moduleModel.update(
          { orderIndex: item.newOrderIndex },
          {
            where: { id: item.id, courseId },
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
