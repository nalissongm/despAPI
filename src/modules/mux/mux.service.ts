import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mux from '@mux/mux-node';

@Injectable()
export class MuxService {
  private muxClient: Mux;

  constructor(private configService: ConfigService) {
    const tokenId = this.configService.get<string>('MUX_TOKEN_ID');
    const tokenSecret = this.configService.get<string>('MUX_TOKEN_SECRET');

    if (!tokenId || !tokenSecret) {
      console.warn('Mux credentials not found. Video uploads will fail.');
    }

    this.muxClient = new Mux({
      tokenId: tokenId || 'placeholder_id',
      tokenSecret: tokenSecret || 'placeholder_secret',
    });
  }

  /**
   * Creates a direct upload URL for the client to upload video directly to Mux.
   * @param lessonId The UUID of the lesson. Passed as `passthrough` to identify it in webhooks.
   */
  async createDirectUploadUrl(lessonId: string) {
    try {
      const upload = await this.muxClient.video.uploads.create({
        new_asset_settings: {
          playback_policy: ['public'],
          passthrough: lessonId, // CRITICAL: This links the Mux asset back to our database record
        },
        cors_origin: '*', // Adjust to your frontend domain in production (e.g., 'https://yourdomain.com')
      });

      return {
        uploadId: upload.id,
        uploadUrl: upload.url,
      };
    } catch (error) {
      console.error('Mux Direct Upload creation failed:', error);
      throw new InternalServerErrorException('Failed to generate video upload URL');
    }
  }
}
