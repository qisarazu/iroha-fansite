export function formatVideoLength(length: number) {
  const minutes = Math.floor(length / 60);
  const seconds = length % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${
    seconds < 10 ? '0' : ''
  }${seconds}`;
}
