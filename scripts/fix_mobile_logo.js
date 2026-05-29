const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/\\(protected\\)/**/layout.tsx', { cwd: 'd:/zezeze/frontend', absolute: true });

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let updated = false;
  
  if (content.includes('<CCAILogo /></div>')) {
    content = content.replace('<CCAILogo /></div>', '<CCAILogo collapsed={true} /></div>');
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(file, content);
    console.log('Fixed ' + file);
  }
});
