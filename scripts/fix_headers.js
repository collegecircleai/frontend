const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/\\(protected\\)/**/layout.tsx', { cwd: 'd:/zezeze/frontend', absolute: true });

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let updated = false;

  // Revert the bad import addition
  if (content.includes('import CCAILogo from "@/components/brand/CCAILogo";')) {
    content = content.replace('import CCAILogo from "@/components/brand/CCAILogo";\n', '');
    content = content.replace('import CCAILogo from "@/components/brand/CCAILogo";\r\n', '');
    updated = true;
  }
  
  // Fix the props of the injected logo
  if (content.includes('<CCAILogo size={22} variant="theme" />')) {
    content = content.replace('<CCAILogo size={22} variant="theme" />', '<div style={{ transform: "scale(0.8)", transformOrigin: "left center" }}><CCAILogo /></div>');
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(file, content);
    console.log('Fixed ' + file);
  }
});
