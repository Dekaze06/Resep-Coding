const fs = require('fs');

const filePath = 'c:/Users/Akamale/Documents/PROJECT WEB APP/2.Web Task Development/src/pages/api/generate-canvas.js';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  '2. Letakkan SELURUH kode HTML5 lengkap HANYA di dalam blok markdown:\n```html\n<!DOCTYPE html>\n<html lang="id">\n...\n</html>\n```',
  '2. Letakkan SELURUH kode HTML5 lengkap HANYA di dalam blok markdown:\\n\\`\\`\\`html\\n<!DOCTYPE html>\\n<html lang="id">\\n...\\n</html>\\n\\`\\`\\`'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed backticks in generate-canvas.js');
