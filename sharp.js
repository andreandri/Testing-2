const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Update path target ke subfolder 'heros'
const target = path.resolve(__dirname, 'src/public/images/heros');
const destination = path.resolve(__dirname, 'dist/images');

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination);
}

fs.readdirSync(target).forEach((image) => {
  const ext = path.extname(image).toLowerCase();
  const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.tiff'];

  // Periksa apakah format gambar didukung
  if (supportedFormats.includes(ext)) {
    // Resize gambar dengan lebar 800px
    sharp(`${target}/${image}`)
      .resize(800)
      .toFile(path.resolve(
        __dirname,
        `${destination}/${image.split('.').slice(0, -1).join('.')}-large.jpg`
      ));

    // Resize gambar dengan lebar 480px
    sharp(`${target}/${image}`)
      .resize(480)
      .toFile(path.resolve(
        __dirname,
        `${destination}/${image.split('.').slice(0, -1).join('.')}-small.jpg`
      ));
  } else {
    console.log(`Format tidak didukung untuk file: ${image}`);
  }
});
