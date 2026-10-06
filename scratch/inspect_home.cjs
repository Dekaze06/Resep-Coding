const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/data/projects.json', 'utf8'));
const proj = data.find(p => p.id === 'proj_default');
if (proj) {
  const homeStart = proj.code.indexOf('page-home');
  const homeEnd = proj.code.indexOf('page-catalog');
  console.log(proj.code.slice(homeStart, Math.min(homeStart + 2500, homeEnd)));
}
