const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'community', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// We need to add more properties to `c` object
const extraProps = `    border08: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    overlay: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
    purpleHighlight: isDark ? 'rgba(60,40,100,0.4)' : 'rgba(139,128,249,0.1)',
    cardTransparent: isDark ? 'rgba(15,15,20,0)' : 'rgba(255,255,255,0)',
    inputBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',`;

content = content.replace("gradTop: isDark ? 'rgba(30,20,50,1)' : 'rgba(230,225,245,1)',", `gradTop: isDark ? 'rgba(30,20,50,1)' : 'rgba(230,225,245,1)',\n${extraProps}`);

// Let's replace the remaining bad colors in light mode
const replacements = [
  { search: /'rgba\(255, \ 255, \ 255, \ 0\.03\)'/g, replace: "c.border03" },
  { search: /'rgba\(255, 255, 255, 0\.03\)'/g, replace: "c.border03" },
  { search: /'rgba\(255,255,255,0\.08\)'/g, replace: "c.border08" },
  { search: /'#fff'/g, replace: "c.text" },
  { search: /'rgba\(0,0,0,0\.8\)'/g, replace: "c.overlay" },
  { search: /'rgba\(15, 15, 25, 0\.6\)'/g, replace: "c.cardLight" },
  { search: /'rgba\(15,15,20,0\)'/g, replace: "c.cardTransparent" },
  { search: /'rgba\(30,20,45,0\.6\)'/g, replace: "c.cardLight" },
  { search: /'rgba\(20,15,25,0\.8\)'/g, replace: "c.card" },
  { search: /'rgba\(30,20,50,0\.4\)'/g, replace: "c.cardLight" },
  { search: /'rgba\(20,15,30,1\)'/g, replace: "c.gradBase" },
  { search: /'rgba\(10,10,15,1\)'/g, replace: "c.gradTop" },
  { search: /'rgba\(60,40,100,0\.4\)'/g, replace: "c.purpleHighlight" },
  { search: /'rgba\(255,255,255,1\)'/g, replace: "c.text" },
  
  // also fix some inputs that hardcoded the bg 
  // background: 'rgba(255,255,255,0.03)' -> c.inputBg
  // wait, the previous script might have replaced rgba(255,255,255,0.03) with c.border03. That's fine for input background in light mode?
  // In light mode c.border03 is rgba(0,0,0,0.03). Yes, that's fine.
  
  // Also we should disable DarkAurora in light mode, or reduce its opacity?
  // Let's do opacity: isDark ? 1 : 0.2 for DarkAurora parent
];

for (const { search, replace } of replacements) {
  content = content.replace(search, replace);
}

// Check DarkAurora opacity
content = content.replace(
  /<ComponentErrorBoundary>\n\s*<DarkAurora \/>/,
  `<ComponentErrorBoundary>\n          <div style={{ opacity: isDark ? 1 : 0.3, position: 'absolute', inset: 0, pointerEvents: 'none' }}>\n            <DarkAurora />\n          </div>`
);

// We have strings like: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)`
// Replace the literal rgba inside the string
content = content.replace(/rgba\(255, 255, 255, 0\.03\)/g, '${c.border03}');
content = content.replace(/rgba\(15,15,20,1\)/g, '${c.gradBase}');
content = content.replace(/rgba\(30,20,50,1\)/g, '${c.gradTop}');


// Write it back
fs.writeFileSync(filePath, content, 'utf8');
console.log("Refactored more colors successfully.");
