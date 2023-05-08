const fs = require('fs');
const path = require('path');
const textPath = path.join(__dirname, 'text.txt');
const { stdin, stdout } = process;

const output = fs.createWriteStream(textPath);

console.log("Hello node!");
stdout.write('Введите вообщение: ');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  stdout.write('Введите вообщение: ');
  output.write(data);
});

process.on('SIGINT', () => {
  stdout.write('\n');
  process.exit();
});

process.on('exit', () => {
  stdout.write('Удачи в изучении Node.js!');
});


