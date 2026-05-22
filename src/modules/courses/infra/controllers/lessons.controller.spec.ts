import { Test, TestingModule } from '@nestjs/testing';
import { LessonsController } from './lessons.controller';
import { LessonsService } from '../../usecases/lessons.service';
import { MuxService } from '../../../mux/mux.service';
import { CreateLessonDto, LessonContentType } from '../../dtos/create-lesson.dto';
import { UpdateLessonDto } from '../../dtos/update-lesson.dto';
import { ReorderDto } from '../../dtos/reorder.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('LessonsController', () => {
  let controller: LessonsController;
  let service: LessonsService;
  let muxService: MuxService;

  const mockLesson = {
    id: 'lesson-uuid',
    moduleId: 'module-uuid',
    title: 'Lesson 1',
    description: 'Desc',
    contentType: LessonContentType.VIDEO,
    orderIndex: 0,
  };

  const mockLessonsService = {
    create: jest.fn().mockResolvedValue(mockLesson),
    findAll: jest.fn().mockResolvedValue([mockLesson]),
    findOne: jest.fn().mockResolvedValue(mockLesson),
    update: jest.fn().mockResolvedValue(mockLesson),
    remove: jest.fn().mockResolvedValue(undefined),
    reorder: jest.fn().mockResolvedValue(undefined),
  };

  const mockMuxService = {
    createDirectUploadUrl: jest.fn().mockResolvedValue({ uploadId: 'up-123', uploadUrl: 'http://mux.url' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsController],
      providers: [
        {
          provide: LessonsService,
          useValue: mockLessonsService,
        },
        {
          provide: MuxService,
          useValue: mockMuxService,
        },
      ],
    }).compile();

    controller = module.get<LessonsController>(LessonsController);
    service = module.get<LessonsService>(LessonsService);
    muxService = module.get<MuxService>(MuxService);

    jest.clearAllMocks();
  });

  describe('Standard CRUD Endpoints', () => {
    it('POST /modules/:moduleId/lessons', async () => {
      const dto: CreateLessonDto = { title: 'New Lesson', contentType: LessonContentType.VIDEO };
      const moduleId = 'module-uuid';
      expect(await controller.create(moduleId, dto)).toEqual(mockLesson);
    });

    it('GET /modules/:moduleId/lessons', async () => {
      const moduleId = 'module-uuid';
      expect(await controller.findAll(moduleId)).toEqual([mockLesson]);
    });

    it('PATCH /lessons/:id', async () => {
      const dto: UpdateLessonDto = { title: 'Updated Title' };
      const id = 'lesson-uuid';
      expect(await controller.update(id, dto)).toEqual(mockLesson);
    });

    it('DELETE /lessons/:id', async () => {
      const id = 'lesson-uuid';
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('Upload Endpoint (getMuxUploadUrl)', () => {
    it('Success: should return upload URL for video lessons', async () => {
      const lessonId = 'lesson-uuid';
      const videoLesson = { id: lessonId, contentType: 'video' };
      const mockMuxResponse = { uploadId: 'up-123', uploadUrl: 'http://mux.url' };

      jest.spyOn(service, 'findOne').mockResolvedValue(videoLesson as any);
      jest.spyOn(muxService, 'createDirectUploadUrl').mockResolvedValue(mockMuxResponse);

      const result = await controller.getMuxUploadUrl(lessonId);

      expect(service.findOne).toHaveBeenCalledWith(lessonId);
      expect(muxService.createDirectUploadUrl).toHaveBeenCalledWith(lessonId);
      expect(result).toEqual(mockMuxResponse);
    });

    it('Failure: should throw BadRequestException if contentType is not video', async () => {
      const lessonId = 'lesson-uuid';
      const textLesson = { id: lessonId, contentType: 'text' };

      jest.spyOn(service, 'findOne').mockResolvedValue(textLesson as any);

      await expect(controller.getMuxUploadUrl(lessonId)).rejects.toThrow(BadRequestException);
    });

    it('Failure: should throw NotFoundException if lesson does not exist', async () => {
      const lessonId = 'invalid-id';

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.getMuxUploadUrl(lessonId)).rejects.toThrow(NotFoundException);
    });
  });
});
