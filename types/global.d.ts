declare interface Window {
  onYouTubeIframeAPIReady: () => void;
}

declare namespace YT {
  export function ready(callback: () => void): void;

  export class Player {
    constructor(
      mountId: string,
      options?: {
        width?: number;
        height?: number;
        videoId?: string;
        playerVars?: Record<string, unknown>;
        events?: {
          onReady?: (event: { target: Player }) => void;
          onStateChange?: (event: { target: Player; data: number }) => void;
        };
      }
    );

    public loadVideoById(
      videoId: string,
      startSeconds?: number,
      suggestedQuality?: string
    ): void;

    public loadVideoById({
      videoId,
      startSeconds,
      endSeconds,
      suggestedQuality
    }: {
      videoId: string;
      startSeconds?: number;
      endSeconds?: number;
      suggestedQuality?: string;
    }): void;

    public cueVideoByUrl(
      mediaContentUrl: string,
      startSeconds?: number,
      suggestedQuality?: string
    ): void;

    public cueVideoByUrl({
      mediaContentUrl,
      startSeconds,
      endSeconds,
      suggestedQuality
    }: {
      mediaContentUrl: string;
      startSeconds?: number;
      endSeconds?: number;
      suggestedQuality?: string;
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

    public addEventListener(event: string, listener: Function): void;

    public removeEventListener(event: string, listener: Function): Void;
  }
}
