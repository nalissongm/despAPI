import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonModel } from '../infra/models/lesson.model';
import { ReorderDto } from '../dtos/reorder.dto';
import { LessonContentType } from '../dtos/create-lesson.dto';

describe('LessonsService', () => {
  let service: LessonsService;
  let model: typeof LessonModel;

  const mockLesson = {
    id: 'lesson-uuid',
    moduleId: 'module-uuid',
    title: 'Lesson 1',
    description: 'Desc',
    contentType: LessonContentType.VIDEO,
    orderIndex: 0,
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  const mockLessonModel = {
    max: jest.fn(),
    create: jest.fn().mockResolvedValue(mockLesson),
    findAll: jest.fn().mockResolvedValue([mockLesson]),
    findByPk: jest.fn().mockResolvedValue(mockLesson),
    update: jest.fn(),
    sequelize: {
      transaction: jest.fn().mockResolvedValue(mockTransaction),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        {
          provide: getModelToken(LessonModel),
          useValue: mockLessonModel,
        },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
    model = module.get<typeof LessonModel>(getModelToken(LessonModel));

    jest.clearAllMocks();
  });

  describe('Auto-Ordering Creation (Scoped to Module)', () => {
    it('should create the first lesson in a module with orderIndex 0', async () => {
      mockLessonModel.max.mockResolvedValueOnce(NaN);

      const dto = { 
        title: 'New Lesson', 
        contentType: LessonContentType.VIDEO 
      };
      
      await service.create('module-uuid', dto);

      expect(model.create).toHaveBeenCalledWith({
        ...dto,
        moduleId: 'module-uuid',
        orderIndex: 0,
      });
    });

    it('should create a lesson with orderIndex MAX + 1', async () => {
      mockLessonModel.max.mockResolvedValueOnce(5);

      const dto = { 
        title: 'Another Lesson', 
        contentType: LessonContentType.TEXT 
      };
      
      await service.create('module-uuid', dto);

      expect(model.create).toHaveBeenCalledWith({
        ...dto,
        moduleId: 'module-uuid',
        orderIndex: 6,
      });
    });
  });

  describe('Reorder Transactions', () => {
    const reorderDto: ReorderDto = {
      orders: [{ id: 'lesson-1', newOrderIndex: 0 }],
    };

    it('should commit transaction on successful bulk reorder', async () => {
      await service.reorder('module-uuid', reorderDto);

      expect(model.sequelize.transaction).toHaveBeenCalled();
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should rollback transaction if an update fails', async () => {
      mockLessonModel.update.mockRejectedValueOnce(new Error('DB Fail'));

      await expect(service.reorder('module-uuid', reorderDto)).rejects.toThrow('DB Fail');

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });

  describe('Standard CRUD', () => {
    it('should findAll lessons for a module ordered by orderIndex', async () => {
      const result = await service.findAll('module-uuid');
      expect(model.findAll).toHaveBeenCalledWith({
        where: { moduleId: 'module-uuid' },
        order: [['orderIndex', 'ASC']],
      });
      expect(result).toEqual([mockLesson]);
    });

    it('should findOne lesson by id', async () => {
      const result = await service.findOne('lesson-id');
      expect(model.findByPk).toHaveBeenCalledWith('lesson-id');
      expect(result).toEqual(mockLesson);
    });

    it('should throw NotFoundException if lesson not found', async () => {
      mockLessonModel.findByPk.mockResolvedValueOnce(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });

    it('should update a lesson', async () => {
      await service.update('id', { title: 'New Title' });
      expect(mockLesson.update).toHaveBeenCalledWith({ title: 'New Title' });
    });

    it('should remove a lesson', async () => {
      await service.remove('id');
      expect(mockLesson.destroy).toHaveBeenCalled();
    });
  });
});
