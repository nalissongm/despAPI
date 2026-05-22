import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { MuxService } from './mux.service';
import Mux from '@mux/mux-node';

// Mock the Mux SDK
jest.mock('@mux/mux-node');

describe('MuxService', () => {
  let service: MuxService;
  let mockMuxClient: any;

  beforeEach(async () => {
    // Setup Mux client mock structure
    mockMuxClient = {
      video: {
        uploads: {
          create: jest.fn().mockResolvedValue({
            id: 'upload-id',
            url: 'https://mux.com/upload-url',
          }),
        },
      },
    };

    (Mux as any).mockImplementation(() => mockMuxClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MuxService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'MUX_TOKEN_ID') return 'test-id';
              if (key === 'MUX_TOKEN_SECRET') return 'test-secret';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MuxService>(MuxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDirectUploadUrl', () => {
    it('should call Mux SDK with lessonId in passthrough and return upload data', async () => {
      const lessonId = 'lesson-uuid';
      const result = await service.createDirectUploadUrl(lessonId);

      expect(mockMuxClient.video.uploads.create).toHaveBeenCalledWith({
        new_asset_settings: {
          playback_policy: ['public'],
          passthrough: lessonId,
        },
        cors_origin: '*',
      });

      expect(result).toEqual({
        uploadId: 'upload-id',
        uploadUrl: 'https://mux.com/upload-url',
      });
    });

    it('should throw InternalServerErrorException if Mux API fails', async () => {
      mockMuxClient.video.uploads.create.mockRejectedValueOnce(new Error('Mux Error'));

      await expect(service.createDirectUploadUrl('id')).rejects.toThrow(InternalServerErrorException);
    });
  });
});
