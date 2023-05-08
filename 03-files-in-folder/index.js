const { dir } = require('console');
const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');
console.log(dirPath);

const showFile = (file) => {
    filePath = path.join(dirPath, file.name);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.log(err);
      } else {
        fileName = file.name.split('.')[0];
        fileExtension = file.name.split('.')[1];
        fileSize = stats.size / 1024 + 'Kb';
        console.log(`${fileName} - ${fileExtension} - ${fileSize}`);
      }
    });
}

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        showFile(file);
      }
    })
  }
})

