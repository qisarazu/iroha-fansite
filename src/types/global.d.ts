import type { PrismaClient } from '@prisma/client';

export declare global {
  var prisma: PrismaClient;

  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}
