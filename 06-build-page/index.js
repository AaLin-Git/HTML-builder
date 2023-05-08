const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');
const templatePath = path.join(__dirname, 'template.html');
const distPath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const finalStyle = path.join(__dirname, 'project-dist', 'style.css');
const sourceAssets = path.join(__dirname, 'assets');
const finalAssets = path.join(distPath, 'assets');

const output = fs.createWriteStream(finalStyle);

fs.mkdir(distPath, { recursive: true }, err => {
  if (err) {
    throw err;
  }
});

fs.mkdir(finalAssets, { recursive: true }, err => {
  if (err) {
    throw err;
  }
});

const copyHtml = async () => {
  const templateHtml = fs.createReadStream(templatePath, 'utf-8');

  let buffer='';

  templateHtml.on('data', chunk => {
    buffer = chunk.toString();

    fs.readdir(componentsPath, { withFileTypes: true }, (err, data) => {
      if (err) {
        throw err;
      }
      data.forEach((file) => {
        const readFile = fs.createReadStream(path.join(componentsPath, file.name), 'utf-8');
        const fileName = file.name.split('.')[0];

        readFile.on('data', data => {
          buffer = buffer.replace(`{{${fileName}}}`, data.toString());

          fsPromises.writeFile(path.join(distPath, 'index.html'), buffer, (err) => {
            if (err) {
              throw err;
            }
          });
        });
      });
    });
  });
}
copyHtml();

const mergeStyles = (file) => {
  const input = fs.createReadStream(path.join(stylesPath, file.name), 'utf-8');

  let data = '';
  input.on('data', chunk => {
    data += chunk;
    output.write(data);
  });

  input.on('end', () => console.log());
  input.on('error', error => console.log('Error', error.message));
}

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
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

const copyAssets = async (from, to) => {
  await fs.mkdir(to, { recursive: true }, err => {
    if (err) {
      throw err;
    }
  });

  const data = await fsPromises.readdir(from, { withFileTypes: true });
  data.forEach(file => {
    if (file.isFile()) {
      fsPromises.copyFile(path.join(from, file.name), path.join(to, file.name));
    } else {
      copyAssets(path.join(from, file.name), path.join(to, file.name));
    }
  });
}
copyAssets(sourceAssets, finalAssets);
