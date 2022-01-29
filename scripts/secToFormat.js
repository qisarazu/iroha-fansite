function secToFormat(sec) {
  if (sec < 0) return `00:00`;

  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

console.log(secToFormat(process.argv[2]));
