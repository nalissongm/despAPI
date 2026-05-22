import {
  Controller,
  Post,
  Req,
  Headers,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LessonsService } from '../courses/usecases/lessons.service';
import Mux from '@mux/mux-node';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);
  private mux: Mux;

  constructor(
    private configService: ConfigService,
    private lessonsService: LessonsService,
  ) {
    this.mux = new Mux({
      tokenId: this.configService.get('MUX_TOKEN_ID'),
      tokenSecret: this.configService.get('MUX_TOKEN_SECRET'),
    });
  }

  @Post('mux')
  @HttpCode(HttpStatus.OK)
  async handleMuxWebhook(
    @Req() req: any,
    @Headers('mux-signature') signature: string,
  ) {
    const webhookSecret = this.configService.get<string>('MUX_WEBHOOK_SECRET');

    if (!webhookSecret) {
      this.logger.error('MUX_WEBHOOK_SECRET is not defined in environment variables.');
      throw new BadRequestException('Webhook verification failed: Secret missing');
    }

    if (!signature) {
      throw new BadRequestException('Webhook verification failed: Signature missing');
    }

    const rawBody = req.rawBody;

    try {
      // Latest Mux SDK (v8+) uses verifySignature
      this.mux.webhooks.verifySignature(rawBody.toString(), { 'mux-signature': signature }, webhookSecret);
      
      const event = JSON.parse(rawBody.toString());
      this.logger.log(`Mux Webhook received: ${event.type}`);

      // PHASE 4: Event Processing
      if (event.type === 'video.asset.ready') {
        const asset = event.data;
        const lessonId = asset.passthrough; // Our lesson UUID
        const playbackId = asset.playback_ids[0].id;
        const duration = Math.round(asset.duration); // Duration in seconds

        this.logger.log(`Video ready for Lesson ${lessonId}. Playback ID: ${playbackId}, Duration: ${duration}s`);

        await this.lessonsService.update(lessonId, {
          videoUrl: playbackId,
          durationSeconds: duration,
        });
      }

      // Return 200 OK for all verified Mux events
      return { received: true };
    } catch (err) {
      this.logger.error(`Webhook processing failed: ${err}`);
      throw new BadRequestException('Invalid webhook signature or processing error');
    }
  }
}
