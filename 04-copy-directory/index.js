const fs = require('fs');
const rimraf = require("rimraf");
const path = require('path');
const sourcePath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

rimraf(copyPath, (err) => {
  if (err) {
    throw err;
  }
  copyDir();
});

const copyDir = () => {
  fs.mkdir(copyPath, { recursive: true }, err => {
    if (err) {
      throw err;
    }
  });

  fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        if (file.isFile()) {
          fs.copyFile(path.join(sourcePath, file.name), path.join(copyPath, file.name), err => {
            if (err) {
              throw err;
            }
          });
        }
      });
    }
  });
}
