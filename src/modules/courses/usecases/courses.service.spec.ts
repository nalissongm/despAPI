import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  promises: {
    unlink: jest.fn(),
  },
}));

import { CoursesService } from './courses.service';
import { CourseModel } from '../infra/models/course.model';
import { InstructorProfileModel } from '../../instructors/infra/models/instructor-profile.model';
import { IStorageProvider } from '../../../shared/containers/storage/istorage.provider';

describe('CoursesService', () => {
  let service: CoursesService;
  let model: typeof CourseModel;
  let instructorModel: typeof InstructorProfileModel;
  let storageProvider: IStorageProvider;

  const mockCourse = {
    id: 'b6b55364-77ac-4ba5-a8ea-92b0051cd118',
    instructorId: 'b6b55364-77ac-4ba5-a8ea-92b0051cd119',
    title: 'NestJS Masterclass',
    description: 'Learn NestJS from scratch.',
    imageCourseUrl: 'old-cover.jpg',
    update: jest.fn(),
    save: jest.fn(),
    destroy: jest.fn(),
  };

  const mockInstructor = {
    id: 'b6b55364-77ac-4ba5-a8ea-92b0051cd119',
  };

  const mockCourseModel = {
    create: jest.fn().mockResolvedValue(mockCourse),
    findAll: jest.fn().mockResolvedValue([mockCourse]),
    findByPk: jest.fn().mockResolvedValue(mockCourse),
  };

  const mockInstructorProfileModel = {
    findByPk: jest.fn().mockResolvedValue(mockInstructor),
  };

  const mockStorageProvider = {
    saveFile: jest.fn().mockResolvedValue('new-cover.jpg'),
    deleteFile: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getModelToken(CourseModel),
          useValue: mockCourseModel,
        },
        {
          provide: getModelToken(InstructorProfileModel),
          useValue: mockInstructorProfileModel,
        },
        {
          provide: IStorageProvider,
          useValue: mockStorageProvider,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    model = module.get<typeof CourseModel>(getModelToken(CourseModel));
    instructorModel = module.get<typeof InstructorProfileModel>(getModelToken(InstructorProfileModel));
    storageProvider = module.get<IStorageProvider>(IStorageProvider);

    jest.clearAllMocks();
  });

  describe('CRUD Operations', () => {
    it('should create a course if instructor exists', async () => {
      const dto = { instructorId: mockCourse.instructorId, title: mockCourse.title };
      const result = await service.create(dto);
      expect(instructorModel.findByPk).toHaveBeenCalledWith(dto.instructorId);
      expect(model.create).toHaveBeenCalled();
      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException if instructor does not exist', async () => {
      jest.spyOn(instructorModel, 'findByPk').mockResolvedValueOnce(null);
      const dto = { instructorId: 'invalid-id', title: 'Title' };
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should find all courses with pagination', async () => {
      const result = await service.findAll(10, 0);
      expect(model.findAll).toHaveBeenCalledWith(expect.objectContaining({ limit: 10, offset: 0 }));
      expect(result).toEqual([mockCourse]);
    });

    it('should find one course by id', async () => {
      const result = await service.findOne(mockCourse.id);
      expect(model.findByPk).toHaveBeenCalledWith(mockCourse.id, expect.any(Object));
      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException if course not found', async () => {
      jest.spyOn(model, 'findByPk').mockResolvedValueOnce(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('should update a course', async () => {
      const dto = { title: 'Updated Title' };
      const result = await service.update(mockCourse.id, dto);
      expect(mockCourse.update).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockCourse);
    });

    it('should remove a course', async () => {
      await service.remove(mockCourse.id);
      expect(mockCourse.destroy).toHaveBeenCalled();
    });
  });

  describe('Smart Storage & Cleanup (uploadCover)', () => {
    beforeEach(() => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);
    });

    it('Success: should upload cover, update DB, delete old cover, and unlink temp file', async () => {
      const filename = 'temp-file-123.jpg';
      const expectedTempPath = path.resolve(__dirname, '..', '..', '..', '..', 'tmp', 'uploads', filename);

      const result = await service.uploadCover(mockCourse.id, filename);

      expect(storageProvider.saveFile).toHaveBeenCalledWith(filename, 'courses/covers');
      expect(storageProvider.deleteFile).toHaveBeenCalledWith('old-cover.jpg', 'courses/covers');
      expect(mockCourse.save).toHaveBeenCalled();
      expect(fs.promises.unlink).toHaveBeenCalledWith(expectedTempPath);
      expect(result).toEqual(mockCourse);
    });

    it('Failure/Garbage Collection: should unlink temp file EVEN IF database save fails', async () => {
      const filename = 'temp-file-fail.jpg';
      const expectedTempPath = path.resolve(__dirname, '..', '..', '..', '..', 'tmp', 'uploads', filename);

      mockCourse.save.mockRejectedValueOnce(new InternalServerErrorException('DB Crash'));

      await expect(service.uploadCover(mockCourse.id, filename)).rejects.toThrow(InternalServerErrorException);
      expect(fs.promises.unlink).toHaveBeenCalledWith(expectedTempPath);
    });
  });
});
