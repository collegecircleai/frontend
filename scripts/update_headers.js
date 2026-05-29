const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/\\(protected\\)/**/layout.tsx', { cwd: 'd:/zezeze/frontend', absolute: true });

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let updated = false;
  
  const searchStr = '<Menu size={20} />\n            </button>\n          )}';
  const searchStrWindows = '<Menu size={20} />\r\n            </button>\r\n          )}';
  
  const replaceStr = `          )}

          {/* Mobile Top Left Logo */}
          {isMobile && (
            <div style={{ zIndex: 10, paddingLeft: "4px", display: "flex", alignItems: "center" }}>
              <div style={{ transform: "scale(0.8)", transformOrigin: "left center" }}><CCAILogo /></div>
            </div>
          )}`;
          
  if (!content.includes('Mobile Top Left Logo')) {
    if (content.includes(searchStr)) {
        content = content.replace(searchStr, '<Menu size={20} />\n            </button>\n' + replaceStr);
        updated = true;
    } else if (content.includes(searchStrWindows)) {
        content = content.replace(searchStrWindows, '<Menu size={20} />\r\n            </button>\r\n' + replaceStr);
        updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
