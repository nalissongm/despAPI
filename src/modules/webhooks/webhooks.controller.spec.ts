import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { LessonsService } from '../courses/usecases/lessons.service';
import Mux from '@mux/mux-node';

// Mock the Mux SDK
jest.mock('@mux/mux-node');

describe('WebhooksController', () => {
  let controller: WebhooksController;
  let lessonsService: LessonsService;
  let mockMuxInstance: any;

  const mockWebhookSecret = 'test-secret';
  const mockSignature = 't=123,v1=abc';
  const mockPayload = JSON.stringify({ type: 'video.asset.created', data: {} });
  const mockRawBody = Buffer.from(mockPayload);

  beforeEach(async () => {
    mockMuxInstance = {
      webhooks: {
        verifySignature: jest.fn(),
      },
    };

    (Mux as any).mockImplementation(() => mockMuxInstance);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'MUX_WEBHOOK_SECRET') return mockWebhookSecret;
              if (key === 'MUX_TOKEN_ID') return 'test-id';
              if (key === 'MUX_TOKEN_SECRET') return 'test-secret';
              return null;
            }),
          },
        },
        {
          provide: LessonsService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WebhooksController>(WebhooksController);
    lessonsService = module.get<LessonsService>(LessonsService);

    jest.clearAllMocks();
  });

  describe('Webhook Signature Verification', () => {
    it('Success: should return 200 OK if signature is valid', async () => {
      mockMuxInstance.webhooks.verifySignature.mockReturnValue(true);

      const req = { rawBody: mockRawBody };
      const result = await controller.handleMuxWebhook(req, mockSignature);

      expect(mockMuxInstance.webhooks.verifySignature).toHaveBeenCalledWith(
        mockPayload,
        { 'mux-signature': mockSignature },
        mockWebhookSecret,
      );
      expect(result).toEqual({ received: true });
    });

    it('Failure: should throw BadRequestException if signature is invalid', async () => {
      mockMuxInstance.webhooks.verifySignature.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const req = { rawBody: mockRawBody };

      await expect(
        controller.handleMuxWebhook(req, mockSignature),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Webhook Event Processing', () => {
    it('should update the lesson when a video.asset.ready event is received', async () => {
      const lessonId = 'lesson-uuid-123';
      const playbackId = 'playback-id-xyz';
      const duration = 120.5;

      const readyPayload = JSON.stringify({
        type: 'video.asset.ready',
        data: {
          passthrough: lessonId,
          playback_ids: [{ id: playbackId }],
          duration: duration,
        },
      });

      mockMuxInstance.webhooks.verifySignature.mockReturnValue(true);

      const req = { rawBody: Buffer.from(readyPayload) };
      await controller.handleMuxWebhook(req, mockSignature);

      expect(lessonsService.update).toHaveBeenCalledWith(lessonId, {
        videoUrl: playbackId,
        durationSeconds: Math.round(duration),
      });
    });
  });
});
