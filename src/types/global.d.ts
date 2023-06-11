import type { PrismaClient } from '@prisma/client';

export declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}
