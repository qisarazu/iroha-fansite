export function formatToSec(formattedLength: string) {
  const splitted = formattedLength.split(':');
  splitted.reverse();
  let time = 0;
  for (let i = 0; i < splitted.length; i++) {
    time += parseInt(splitted[i], 10) * Math.pow(60, i);
  }
  return time;
}
