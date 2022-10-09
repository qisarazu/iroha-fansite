import { PrismaClient } from '@prisma/client';

import SampleSingingStreams from './sample/singing_stream.json';
import SampleSongs from './sample/song.json';
import SampleVideos from './sample/video.json';

const prisma = new PrismaClient();

const main = async () => {
  const parsedSampleVideos = SampleVideos.map(({ createdAt, updatedAt, ...x }) => {
    return {
      ...x,
      duration: typeof x.duration === 'number' ? x.duration : parseInt(x.duration, 10),
      publishedAt: (x.publishedAt as unknown) instanceof Date ? x.publishedAt : new Date(x.publishedAt),
    };
  });
  await prisma.video.createMany({
    data: parsedSampleVideos,
  });

  const parsedSampleSongs = SampleSongs.map(({ createdAt, updatedAt, ...x }) => {
    return x;
  });
  await prisma.song.createMany({
    data: parsedSampleSongs,
  });

  const parsedSampleSingingStreams = SampleSingingStreams.map(({ createdAt, updatedAt, ...x }) => {
    return {
      ...x,
      start: typeof x.start === 'number' ? x.start : parseInt(x.start, 10),
      end: typeof x.end === 'number' ? x.end : parseInt(x.end, 10),
    };
  });
  await prisma.singingStream.createMany({
    data: parsedSampleSingingStreams,
  });

  console.log('completed seed.');
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
