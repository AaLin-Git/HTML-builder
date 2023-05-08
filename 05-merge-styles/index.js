const fs = require('fs');
const path = require('path');
const sourcePath = path.join(__dirname, 'styles');
const finalPath = path.join(__dirname, 'project-dist', 'bundle.css');

const output = fs.createWriteStream(finalPath);

const mergeStyles = (file) => {
  const input = fs.createReadStream(path.join(sourcePath, file.name), 'utf-8');

  let data = '';
  input.on('data', chunk => {
    data += chunk;
    output.write(data);
  });

  input.on('end', () => console.log());
  input.on('error', error => console.log('Error', error.message));
}

fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      const isCss = file.name.split('.')[1] === 'css';
      if (file.isFile() && isCss) {
        mergeStyles(file);
      }
    })
  }
})
