import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CourseModuleModel } from '../infra/models/course-module.model';
import { ReorderDto } from '../dtos/reorder.dto';

describe('ModulesService', () => {
  let service: ModulesService;
  let model: typeof CourseModuleModel;

  const mockModule = {
    id: 'module-uuid',
    courseId: 'course-uuid',
    title: 'Introduction',
    orderIndex: 0,
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  const mockModuleModel = {
    max: jest.fn(),
    create: jest.fn().mockResolvedValue(mockModule),
    findAll: jest.fn().mockResolvedValue([mockModule]),
    findByPk: jest.fn().mockResolvedValue(mockModule),
    update: jest.fn(),
    sequelize: {
      transaction: jest.fn().mockResolvedValue(mockTransaction),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModulesService,
        {
          provide: getModelToken(CourseModuleModel),
          useValue: mockModuleModel,
        },
      ],
    }).compile();

    service = module.get<ModulesService>(ModulesService);
    model = module.get<typeof CourseModuleModel>(getModelToken(CourseModuleModel));

    jest.clearAllMocks();
  });

  describe('Auto-Ordering Creation', () => {
    it('should create the first module with orderIndex 0', async () => {
      // Mock max to return null (first item)
      mockModuleModel.max.mockResolvedValueOnce(NaN);

      const dto = { title: 'First Module' };
      await service.create('course-uuid', dto);

      expect(model.create).toHaveBeenCalledWith({
        ...dto,
        courseId: 'course-uuid',
        orderIndex: 0,
      });
    });

    it('should create a module with incremented orderIndex (MAX + 1)', async () => {
      // Mock max to return 2
      mockModuleModel.max.mockResolvedValueOnce(2);

      const dto = { title: 'New Module' };
      await service.create('course-uuid', dto);

      expect(model.create).toHaveBeenCalledWith({
        ...dto,
        courseId: 'course-uuid',
        orderIndex: 3,
      });
    });
  });

  describe('Reorder (Transactions)', () => {
    const reorderDto: ReorderDto = {
      orders: [
        { id: 'id-1', newOrderIndex: 0 },
        { id: 'id-2', newOrderIndex: 1 },
      ],
    };

    it('Success: should commit transaction after successful updates', async () => {
      await service.reorder('course-uuid', reorderDto);

      expect(model.sequelize.transaction).toHaveBeenCalled();
      expect(model.update).toHaveBeenCalledTimes(2);
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(mockTransaction.rollback).not.toHaveBeenCalled();
    });

    it('Failure: should rollback transaction if an update fails', async () => {
      // Force error on second update
      mockModuleModel.update
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Update failed'));

      await expect(service.reorder('course-uuid', reorderDto)).rejects.toThrow('Update failed');

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
    });
  });

  describe('Standard CRUD', () => {
    it('should findAll modules for a course ordered by orderIndex', async () => {
      const result = await service.findAll('course-uuid');
      expect(model.findAll).toHaveBeenCalledWith({
        where: { courseId: 'course-uuid' },
        order: [['orderIndex', 'ASC']],
      });
      expect(result).toEqual([mockModule]);
    });

    it('should findOne module by id', async () => {
      const result = await service.findOne('id');
      expect(model.findByPk).toHaveBeenCalledWith('id');
      expect(result).toEqual(mockModule);
    });

    it('should throw NotFoundException if module not found', async () => {
      mockModuleModel.findByPk.mockResolvedValueOnce(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });

    it('should update a module', async () => {
      await service.update('id', { title: 'New Title' });
      expect(mockModule.update).toHaveBeenCalledWith({ title: 'New Title' });
    });

    it('should remove a module', async () => {
      await service.remove('id');
      expect(mockModule.destroy).toHaveBeenCalled();
    });
  });
});
