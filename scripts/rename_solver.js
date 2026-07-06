const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('d:/zezeze/frontend/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  newContent = newContent.replace(/label: "Assg Solver"/g, 'label: "Research Studio"');
  newContent = newContent.replace(/label: "Solver"/g, 'label: "Research Studio"');
  newContent = newContent.replace(/>Assg Solver</g, '>Research Studio<');
  newContent = newContent.replace(/Assignment Solver/g, 'Research Studio');
  newContent = newContent.replace(/Assignment Assistant/gi, 'Research Studio');
  newContent = newContent.replace(/Solve Your Assignment/g, 'Start Your Research');
  newContent = newContent.replace(/Upload your assignment/g, 'Upload your document');
  newContent = newContent.replace(/Solve Assignment/g, 'Start Research');
  newContent = newContent.replace(/Assignment Rescue/g, 'Research Rescue');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated', file);
  }
});
