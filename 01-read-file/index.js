const fs = require('fs');
const path = require('path');
const textPath = path.join(__dirname, 'text.txt');
console.log(textPath);

const stream = fs.createReadStream(textPath, 'utf-8');

let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log('End', data));
stream.on('error', error => console.log('Error', error.message));
