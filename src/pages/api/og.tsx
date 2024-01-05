/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import type { NextConfig } from 'next';
import type { NextRequest } from 'next/server';
import type { CSSProperties, HTMLProps, ReactNode } from 'react';

export const config: NextConfig = {
  runtime: 'edge',
};

function Container({ style, children }: { style?: CSSProperties; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#0e2625',
        padding: 32,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Icon(props: HTMLProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 285.75 285.75" {...props}>
      <path
        d="M138.116 0s-32.017 21.631-61.688 55.201l1.117 1.161 1.294 1.419 1.245 1.444 1.196 1.467 1.143 1.487 1.09 1.504a61.91 61.91 0 0 1 1.034 1.519l.977 1.532a57.63 57.63 0 0 1 .917 1.542l.858 1.55a53.15 53.15 0 0 1 .795 1.554 50.87 50.87 0 0 1 .733 1.558 48.56 48.56 0 0 1 .667 1.557 46.31 46.31 0 0 1 .603 1.555 44.06 44.06 0 0 1 .537 1.55l.468 1.544a39.73 39.73 0 0 1 .402 1.533 37.6 37.6 0 0 1 .332 1.521 35.64 35.64 0 0 1 .263 1.506 33.75 33.75 0 0 1 .194 1.489 31.95 31.95 0 0 1 .124 1.469l.054 1.446a28.7 28.7 0 0 1-.017 1.423l-.086 1.395s-.093.916-.157 1.367-.139.895-.226 1.335a23.73 23.73 0 0 1-.296 1.302l-.365 1.267s-.278.825-.433 1.228-.323.8-.501 1.189-.367.772-.567 1.147-.411.743-.633 1.104-.455.714-.699 1.06-.498.683-.762 1.012a20.35 20.35 0 0 1-.825.964l-.886.913a21.39 21.39 0 0 1-3.009 2.426c-1.088.728-2.258 1.371-3.502 1.927s-2.561 1.024-3.944 1.4-2.829.661-4.329.852-3.053.289-4.649.293a43.82 43.82 0 0 1-4.904-.271 50.62 50.62 0 0 1-5.086-.831 57.41 57.41 0 0 1-5.194-1.381 63.68 63.68 0 0 1-5.226-1.908 69 69 0 0 1-4.441-2.063c-8.724 17.473-14.467 36.269-14.779 55.703-1.393 86.83 73.829 111.672 73.829 111.672-10.459-18.373-12.304-39.7-12.304-39.7-5.572-55.488 40.934-93.392 40.934-93.392l.165-73.382s1.97-7.387 8.701-7.387 8.865 7.551 8.865 7.551v59.593c42.683-25.61 81.796-30.89 81.796-30.89C191.795 33.733 138.116 0 138.116 0z"
        fill="#44bfb7"
      />
      <path
        d="M117.502 265.436s-30.414-39.7 4.643-92.402 136.514-68.489 136.514-68.489 3.25 78.24-20.198 121.887-68.721 66.864-111.904 57.113l37.611-54.327 49.916-9.054s6.501-3.947 5.572-10.447-8.126-8.126-8.126-8.126l-32.039 5.572 32.735-46.201s3.25-5.34-3.018-10.447-11.84.929-11.84.929z"
        fill="#ddaa71"
      />
    </svg>
  );
}

function Logo({ imageSize }: { imageSize: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Icon width={imageSize} height={imageSize} />
      <div style={{ display: 'flex', fontFamily: '"Comfortaa"', fontSize: imageSize / 3, color: '#44bfb7' }}>
        gozaru.fans
      </div>
    </div>
  );
}

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const hasTitle = searchParams.has('title');
  const hasArtist = searchParams.has('artist');
  const hasVideoTitle = searchParams.has('video-title');
  const hasVideoPublishedAt = searchParams.has('video-published-at');

  const validParams = hasTitle && hasArtist && hasVideoTitle && hasVideoPublishedAt;

  const comfortaa = await fetch(new URL('../../../assets/comfortaa-bold.woff', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );

  if (!validParams) {
    return new ImageResponse(
      (
        <Container>
          <Logo imageSize={256} />
        </Container>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [{ name: 'Comfortaa', data: comfortaa, style: 'normal' }],
      },
    );
  }

  const title = searchParams.get('title');
  const artist = searchParams.get('artist');
  const videoTitle = searchParams.get('video-title');
  const videoPublishedAt = searchParams.get('video-published-at');

  return new ImageResponse(
    (
      <Container>
        <div
          style={{
            position: 'absolute',
            top: 32,
            left: 32,
            right: 32,
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column',
            gap: 8,
            color: '#d0efed',
          }}
        >
          <p style={{ margin: 0, fontSize: 20 }}>{videoPublishedAt} 配信</p>
          <p style={{ display: 'block', margin: 0, fontSize: 24, lineClamp: 2 }}>{videoTitle}</p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            color: '#d0efed',
          }}
        >
          <p
            style={{
              margin: 0,
              display: 'block',
              lineClamp: 1,
              fontSize: 40,
            }}
          >
            {artist}
          </p>
          <p
            style={{
              margin: 0,
              display: 'block',
              lineClamp: 1,
              fontSize: 64,
            }}
          >
            {title}
          </p>
        </div>
        <div style={{ position: 'absolute', display: 'flex', right: 32, bottom: 32 }}>
          <Logo imageSize={96} />
        </div>
      </Container>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Comfortaa', data: comfortaa, style: 'normal' }],
    },
  );
}
