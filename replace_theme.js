const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'community', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const themeVarsInsert = `
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('cc-ai-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, [])
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('cc-ai-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const isDark = theme === 'dark';
  
  const c = {
    bg: isDark ? '#0A0A1E' : '#F7F6F2',
    text: isDark ? '#FFFFFF' : '#1A1A1E',
    text80: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
    text70: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    text60: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    text50: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    text40: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
    text30: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
    card: isDark ? 'rgba(15,15,20,0.8)' : 'rgba(255,255,255,0.9)',
    cardLight: isDark ? 'rgba(15,15,20,0.6)' : 'rgba(255,255,255,0.7)',
    border15: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
    border10: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    border05: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    border03: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
    border02: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
    gradBase: isDark ? 'rgba(15,15,20,1)' : 'rgba(247,246,242,1)',
    gradTop: isDark ? 'rgba(30,20,50,1)' : 'rgba(230,225,245,1)',
  };
`;

// Replace the previous enforcement of dark mode
content = content.replace(/useEffect\(\(\) => \{\n\s*setMounted\(true\)\n\s*\/\/ Enforce landing page dark theme\n\s*document\.documentElement\.setAttribute\('data-theme', 'dark'\)\n\s*localStorage\.setItem\('cc-ai-theme', 'dark'\)\n\s*\}, \[\]\)/, `
  useEffect(() => {
    setMounted(true)
  }, [])
${themeVarsInsert}
`);

// Also add the Sun/Moon toggle to the imports
if (!content.includes('Sun, Moon')) {
  content = content.replace("import { ArrowRight", "import { Sun, Moon, ArrowRight");
}

// Add the toggle button before <Header />
const toggleBtn = `
      {mounted && (
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(139, 128, 249, 0.15)' : 'rgba(139, 128, 249, 0.05)' }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: "absolute", top: "clamp(20px, 4vw, 40px)", right: "clamp(20px, 4vw, 40px)",
            backgroundColor: 'rgba(139, 128, 249, 0)', border: \`1px solid \${c.border10}\`,
            borderRadius: '12px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: c.text, cursor: 'pointer', zIndex: 100, transition: 'all 0.3s ease'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div key={theme} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      )}
`;

content = content.replace("<ComponentErrorBoundary>\n        <Header", toggleBtn + "\n      <ComponentErrorBoundary>\n        <Header");

const replacements = [
  { search: /'#0A0A1E'/g, replace: "c.bg" },
  { search: /'#FFFFFF'/g, replace: "c.text" },
  { search: /'#fff'/g, replace: "c.text" },
  { search: /'rgba\(15,15,20,0\.8\)'/g, replace: "c.card" },
  { search: /'rgba\(15,15,20,0\.6\)'/g, replace: "c.cardLight" },
  { search: /'rgba\(15,15,20,1\)'/g, replace: "c.gradBase" },
  { search: /'rgba\(30,20,50,1\)'/g, replace: "c.gradTop" },
  { search: /'rgba\(20,15,30,1\)'/g, replace: "c.gradBase" },
  { search: /'rgba\(10,10,15,1\)'/g, replace: "c.gradTop" },
  { search: /'rgba\(255,255,255,0\.8\)'/g, replace: "c.text80" },
  { search: /'rgba\(255,255,255,0\.7\)'/g, replace: "c.text70" },
  { search: /'rgba\(255,255,255,0\.6\)'/g, replace: "c.text60" },
  { search: /'rgba\(255,255,255,0\.5\)'/g, replace: "c.text50" },
  { search: /'rgba\(255,255,255,0\.4\)'/g, replace: "c.text40" },
  { search: /'rgba\(255,255,255,0\.3\)'/g, replace: "c.text30" },
  { search: /'rgba\(255,255,255,0\.15\)'/g, replace: "c.border15" },
  { search: /'rgba\(255,255,255,0\.1\)'/g, replace: "c.border10" },
  { search: /'rgba\(255,255,255,0\.05\)'/g, replace: "c.border05" },
  { search: /'rgba\(255,255,255,0\.03\)'/g, replace: "c.border03" },
  { search: /'rgba\(255,255,255,0\.02\)'/g, replace: "c.border02" },
  
  // Note: we also have some complex strings like:
  // background: 'linear-gradient(180deg, rgba(20,15,30,1) 0%, rgba(10,10,15,1) 100%)'
  // Let's replace the string literals dynamically:
  { search: /`linear-gradient\(180deg, \$\{c\.gradBase\} 0%, \$\{c\.gradTop\} 100%\)`/g, replace: "DUMMY" }, // just a placeholder to show regex
];

for (const { search, replace } of replacements) {
  content = content.replace(search, replace);
}

// Special case for linear gradients inside strings
content = content.replace(/'linear-gradient\([^)]+\)'/g, (match) => {
  let s = match;
  s = s.replace(/rgba\(15,15,20,1\)/g, '${c.gradBase}');
  s = s.replace(/rgba\(30,20,50,1\)/g, '${c.gradTop}');
  s = s.replace(/rgba\(20,15,25,0\.8\)/g, '${c.card}');
  s = s.replace(/rgba\(30,20,50,0\.4\)/g, '${c.cardLight}');
  s = s.replace(/rgba\(20,15,30,1\)/g, '${c.gradBase}');
  s = s.replace(/rgba\(10,10,15,1\)/g, '${c.gradTop}');
  s = s.replace(/rgba\(255, 255, 255, 0\.03\)/g, '${c.border03}');
  if (s !== match) {
    return `\`${s.slice(1, -1)}\``;
  }
  return match;
});

// Write it back
fs.writeFileSync(filePath, content, 'utf8');
console.log("Refactored to support theme successfully.");
