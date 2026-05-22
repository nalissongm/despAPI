import { Test, TestingModule } from '@nestjs/testing';
import { ModulesController } from './modules.controller';
import { ModulesService } from '../../usecases/modules.service';
import { CreateModuleDto } from '../../dtos/create-module.dto';
import { UpdateModuleDto } from '../../dtos/update-module.dto';
import { ReorderDto } from '../../dtos/reorder.dto';

describe('ModulesController', () => {
  let controller: ModulesController;
  let service: ModulesService;

  const mockModule = {
    id: 'module-uuid',
    courseId: 'course-uuid',
    title: 'Introduction',
    orderIndex: 0,
  };

  const mockModulesService = {
    create: jest.fn().mockResolvedValue(mockModule),
    findAll: jest.fn().mockResolvedValue([mockModule]),
    findOne: jest.fn().mockResolvedValue(mockModule),
    update: jest.fn().mockResolvedValue(mockModule),
    remove: jest.fn().mockResolvedValue(undefined),
    reorder: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulesController],
      providers: [
        {
          provide: ModulesService,
          useValue: mockModulesService,
        },
      ],
    }).compile();

    controller = module.get<ModulesController>(ModulesController);
    service = module.get<ModulesService>(ModulesService);

    jest.clearAllMocks();
  });

  describe('Endpoints Delegation', () => {
    it('POST /courses/:courseId/modules: should call service.create with courseId and DTO', async () => {
      const dto: CreateModuleDto = { title: 'New Module' };
      const courseId = 'course-uuid';

      const result = await controller.create(courseId, dto);

      expect(service.create).toHaveBeenCalledWith(courseId, dto);
      expect(result).toEqual(mockModule);
    });

    it('GET /courses/:courseId/modules: should call service.findAll with courseId', async () => {
      const courseId = 'course-uuid';

      const result = await controller.findAll(courseId);

      expect(service.findAll).toHaveBeenCalledWith(courseId);
      expect(result).toEqual([mockModule]);
    });

    it('PATCH /modules/:id: should call service.update with id and DTO', async () => {
      const dto: UpdateModuleDto = { title: 'Updated Title' };
      const id = 'module-uuid';

      const result = await controller.update(id, dto);

      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(mockModule);
    });

    it('DELETE /modules/:id: should call service.remove with id', async () => {
      const id = 'module-uuid';

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('PATCH /courses/:courseId/modules/reorder: should call service.reorder with courseId and DTO', async () => {
      const courseId = 'course-uuid';
      const dto: ReorderDto = {
        orders: [{ id: 'id-1', newOrderIndex: 0 }],
      };

      await controller.reorder(courseId, dto);

      expect(service.reorder).toHaveBeenCalledWith(courseId, dto);
    });
  });
});
