import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from '../../usecases/courses.service';
import { CreateCourseDto } from '../../dtos/create-course.dto';
import { UpdateCourseDto } from '../../dtos/update-course.dto';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  const mockCourse = {
    id: 'b6b55364-77ac-4ba5-a8ea-92b0051cd118',
    instructorId: 'b6b55364-77ac-4ba5-a8ea-92b0051cd119',
    title: 'NestJS Masterclass',
    description: 'Learn NestJS from scratch.',
    imageCourseUrl: 'cover.jpg',
  };

  const mockCoursesService = {
    create: jest.fn().mockResolvedValue(mockCourse),
    findAll: jest.fn().mockResolvedValue([mockCourse]),
    findOne: jest.fn().mockResolvedValue(mockCourse),
    update: jest.fn().mockResolvedValue(mockCourse),
    remove: jest.fn().mockResolvedValue(undefined),
    uploadCover: jest.fn().mockResolvedValue(mockCourse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);
  });

  describe('Standard CRUD Endpoints', () => {
    it('POST /courses', async () => {
      const dto: CreateCourseDto = { instructorId: mockCourse.instructorId, title: mockCourse.title };
      expect(await controller.create(dto)).toEqual(mockCourse);
    });

    it('GET /courses', async () => {
      expect(await controller.findAll(10, 0)).toEqual([mockCourse]);
    });

    it('GET /courses/:id', async () => {
      expect(await controller.findOne(mockCourse.id)).toEqual(mockCourse);
    });

    it('PATCH /courses/:id', async () => {
      const dto: UpdateCourseDto = { title: 'New Title' };
      expect(await controller.update(mockCourse.id, dto)).toEqual(mockCourse);
    });

    it('DELETE /courses/:id', async () => {
      await controller.remove(mockCourse.id);
      expect(service.remove).toHaveBeenCalledWith(mockCourse.id);
    });
  });

  describe('Upload Endpoint', () => {
    it('PATCH /courses/:id/cover', async () => {
      const mockFile = { filename: 'test.jpg' } as Express.Multer.File;
      expect(await controller.patchCover(mockCourse.id, mockFile)).toEqual(mockCourse);
      expect(service.uploadCover).toHaveBeenCalledWith(mockCourse.id, 'test.jpg');
    });
  });
});
