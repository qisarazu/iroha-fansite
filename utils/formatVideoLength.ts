export function formatVideoLength(length: number) {
  if (length < 0) return `00:00`;

  const minutes = Math.floor(length / 60);
  const seconds = Math.floor(length % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
