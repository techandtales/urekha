const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const regex1 = /const DEVANAGARI_REGEX = \/[\s\S]*?\}\);/g;
      
      if (regex1.test(content)) {
        let updated = content.replace(regex1, 'Font.registerHyphenationCallback((word: string) => [word]);');
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log('Fixed ' + fullPath);
      }
    }
  }
}

processDir('E:/Urekha2/Urekha/Urekha/urekhafrontend/components/pdf');
