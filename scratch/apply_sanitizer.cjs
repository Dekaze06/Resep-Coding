const fs = require('fs');

// 1. Update app.astro
const appAstroPath = 'c:/Users/Akamale/Documents/PROJECT WEB APP/2.Web Task Development/src/pages/app.astro';
let appContent = fs.readFileSync(appAstroPath, 'utf8');

const oldGetCanvasState = `window.getActiveProjectCanvasState = function () {
            const store = loadProjectsStore();
            if (!store.activeId || !store.projects[store.activeId]) return null;
            const proj = store.projects[store.activeId];
            return {
                code: proj.canvasCode || '',
                messages: proj.canvasMessages || [],
                title: proj.canvasTitle || (proj.name ? proj.name + ' - Web Canvas' : 'Web Canvas')
            };
        };`;

const newGetCanvasState = `window.getActiveProjectCanvasState = function () {
            const store = loadProjectsStore();
            if (!store.activeId || !store.projects[store.activeId]) return null;
            const proj = store.projects[store.activeId];
            let rawCode = proj.canvasCode || '';
            
            if (rawCode) {
                const docTypeIdx = rawCode.indexOf('<!DOCTYPE html>');
                const htmlIdx = rawCode.indexOf('<html');
                const startIdx = docTypeIdx !== -1 ? docTypeIdx : htmlIdx;
                if (startIdx > 0) {
                    rawCode = rawCode.slice(startIdx);
                }
                rawCode = rawCode.replace(/\`\`\`(?:html|HTML)?/gi, '').replace(/\`\`\`\\s*$/g, '').trim();
            }

            return {
                code: rawCode,
                messages: proj.canvasMessages || [],
                title: proj.canvasTitle || (proj.name ? proj.name + ' - Web Canvas' : 'Web Canvas')
            };
        };`;

appContent = appContent.replace(oldGetCanvasState, newGetCanvasState);
fs.writeFileSync(appAstroPath, appContent, 'utf8');
console.log('Updated app.astro getActiveProjectCanvasState with auto-clean');

// 2. Update FrontendCanvasViewer.tsx with cleanHtmlCode
const canvasViewerPath = 'c:/Users/Akamale/Documents/PROJECT WEB APP/2.Web Task Development/src/components/FrontendCanvasViewer.tsx';
let viewerContent = fs.readFileSync(canvasViewerPath, 'utf8');

// Insert cleanHtmlCode helper
const targetHelperPos = 'const THEME_PRESETS = [';
const cleanHtmlHelperCode = `const cleanHtmlCode = (raw: string): string => {
  if (!raw) return raw;
  let cleaned = raw;
  const docTypeIdx = cleaned.indexOf("<!DOCTYPE html>");
  const htmlIdx = cleaned.indexOf("<html");
  const startIdx = docTypeIdx !== -1 ? docTypeIdx : htmlIdx;
  if (startIdx > 0) {
    cleaned = cleaned.slice(startIdx);
  }
  cleaned = cleaned.replace(/\`\`\`(?:html|HTML)?/gi, "").replace(/\`\`\`\\s*$/g, "").trim();
  return cleaned;
};

const THEME_PRESETS = [`;

viewerContent = viewerContent.replace(targetHelperPos, cleanHtmlHelperCode);

// Wrap previewSrcDoc with cleanHtmlCode
viewerContent = viewerContent.replace(
  'const previewSrcDoc = useMemo(() => {\n    if (!code) return "";',
  'const previewSrcDoc = useMemo(() => {\n    if (!code) return "";\n    const cleanCode = cleanHtmlCode(code);'
);
viewerContent = viewerContent.replace(
  'if (code.includes("</body>")) {\n      return code.replace("</body>", interceptorScript + "</body>");\n    }\n    return code + interceptorScript;',
  'if (cleanCode.includes("</body>")) {\n      return cleanCode.replace("</body>", interceptorScript + "</body>");\n    }\n    return cleanCode + interceptorScript;'
);

// Wrap updateCodeWithHistory and loadProjectState
viewerContent = viewerContent.replace(
  'const updateCodeWithHistory = useCallback((newCode: string) => {\n    setCode(newCode);',
  'const updateCodeWithHistory = useCallback((newCode: string) => {\n    const cleaned = cleanHtmlCode(newCode);\n    setCode(cleaned);'
);

viewerContent = viewerContent.replace(
  'const saved = window.getActiveProjectCanvasState();\n      if (saved && saved.code) {\n        setCode(saved.code);',
  'const saved = window.getActiveProjectCanvasState();\n      if (saved && saved.code) {\n        const cleaned = cleanHtmlCode(saved.code);\n        setCode(cleaned);'
);

fs.writeFileSync(canvasViewerPath, viewerContent, 'utf8');
console.log('Updated FrontendCanvasViewer.tsx with cleanHtmlCode auto-sanitizer');
