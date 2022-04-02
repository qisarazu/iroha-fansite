export const parseDuration = (arg: string) => {
  const match = arg.match(/PT(\d+H)?(\d+M)?(\d+S)/);
  if (!match) {
    throw new Error(`Invalid duration: ${arg}`);
  }
  const [, hours, minutes, seconds] = match;
  const duration =
    (hours ? parseInt(hours.slice(0, -1), 10) * 60 * 60 : 0) +
    (minutes ? parseInt(minutes.slice(0, -1), 10) * 60 : 0) +
    (seconds ? parseInt(seconds.slice(0, -1), 10) : 0);
  return duration;
};
