declare interface Window {
  onYouTubeIframeAPIReady: () => void;
}

declare namespace YT {
  export class Player {
    constructor(
      mountId: string,
      options?: {
        width?: string | number;
        height?: string | number;
        videoId?: string;
        playerVars?: Record<string, unknown>;
        events?: {
          onReady?: (event: { target: Player }) => void;
          onStateChange?: (event: { target: Player; data: number }) => void;
        };
      },
    );
    public loadVideoById(videoId: string, startSeconds?: number, suggestedQuality?: string): void;
    public loadVideoById({
      videoId,
      startSeconds,
      endSeconds,
      suggestedQuality,
    }: {
      videoId: string;
      startSeconds?: number;
      endSeconds?: number;
      suggestedQuality?: string;
    }): void;
    public cueVideoById(videoId: string, startSeconds?: number): void;
    public cueVideoById({
      videoId,
      startSeconds,
      endSeconds,
    }: {
      videoId: string;
      startSeconds?: number;
      endSeconds?: number;
    }): void;
    public cueVideoByUrl(mediaContentUrl: string, startSeconds?: number): void;
    public cueVideoByUrl({
      mediaContentUrl,
      startSeconds,
      endSeconds,
    }: {
      mediaContentUrl: string;
      startSeconds?: number;
      endSeconds?: number;
    }): void;
    public playVideo(): void;
    public pauseVideo(): void;
    public stopVideo(): void;
    public seekTo(seconds: number, allowSeekAhead?: boolean): void;
    public clearVideo(): void;
    public mute(): void;
    public unMute(): void;
    public isMuted(): boolean;
    public setVolume(volume: number): void;
    public getVolume(): number;
    public getIframe(): HTMLIFrameElement;
    public getCurrentTime(): number;
    public getIframe(): Node;
    public getPlayerState(): number;
    public getVideoUrl(): string;
    public destroy(): void;
    public addEventListener(event: string, listener: Function): void;
    public removeEventListener(event: string, listener: Function): Void;
  }

  export const PlayerState: {
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}
