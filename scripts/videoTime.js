function videoTime(formatTime) {
  const splited = formatTime.split(':');
  splited.reverse();
  let time = 0;
  for (let i = 0; i < splited.length; i++) {
    time += parseInt(splited[i], 10) * Math.pow(60, i);
  }

  console.log(time);
}

for (let i = 2; i < process.argv.length; i++) {
  videoTime(process.argv[i]);
}
