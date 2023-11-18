/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import type { NextConfig } from 'next';
import type { NextRequest } from 'next/server';
import type { CSSProperties, ReactNode } from 'react';

export const config: NextConfig = {
  runtime: 'edge',
};

async function fetchComfortaa() {
  return fetch(new URL('assets/fonts/comfortaa-bold.woff', import.meta.url)).then((res) => res.arrayBuffer());
}

async function fetchMPlusRounded1c() {
  return fetch(new URL('assets/fonts/MPLUSRounded1c-regular.woff', import.meta.url)).then((res) => res.arrayBuffer());
}

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

function Icon({ imageSize }: { imageSize: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <img width={imageSize} height={imageSize} src="https://gozaru.fans/logo.png" alt="gozaru.fans logo" />
      <h1 style={{ fontFamily: '"Comfortaa"', fontSize: imageSize / 3, color: '#44bfb7' }}>gozaru.fans</h1>
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

  const [comfortaa, mPlusROunded1c] = await Promise.all([fetchComfortaa(), fetchMPlusRounded1c()]);

  if (!validParams) {
    return new ImageResponse(
      (
        <Container>
          <Icon imageSize={256} />
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
            fontFamily: '"M Plus Rounded 1c"',
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
            fontFamily: '"M Plus Rounded 1c"',
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
          <Icon imageSize={96} />
        </div>
      </Container>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Comfortaa', data: comfortaa, style: 'normal' },
        { name: 'M Plus Rounded 1c', data: mPlusROunded1c, style: 'normal' },
      ],
    },
  );
}
