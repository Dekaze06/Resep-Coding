const fs = require('fs');

const filePath = 'c:/Users/Akamale/Documents/PROJECT WEB APP/2.Web Task Development/src/pages/app.astro';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update task-prd-1, task-prd-2, task-prd-3 labels with onclick="togglePrdInput(...)"
content = content.replace(
  '<label class="task-container flex items-start gap-4 p-5 rounded-xl glass-panel cursor-pointer border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 via-neutral-900/40 to-neutral-900/60">',
  '<label class="task-container flex items-start gap-4 p-5 rounded-xl glass-panel cursor-pointer border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 via-neutral-900/40 to-neutral-900/60" onclick="togglePrdInput(\'wizard\')">'
);

content = content.replace(
  '<!-- Task PRD 2: Manual (Tulis Ide Bebas) -->\n                <div class="prd-task-wrapper">\n                    <label class="task-container flex items-start gap-4 p-5 rounded-xl glass-panel cursor-pointer">',
  '<!-- Task PRD 2: Manual (Tulis Ide Bebas) -->\n                <div class="prd-task-wrapper">\n                    <label class="task-container flex items-start gap-4 p-5 rounded-xl glass-panel cursor-pointer" onclick="togglePrdInput(\'manual\')">'
);

content = content.replace(
  '<!-- Task PRD 3: Cloning -->\n                <div class="prd-task-wrapper">\n                    <label class="task-container flex items-start gap-4 p-5 rounded-xl glass-panel cursor-pointer">',
  '<!-- Task PRD 3: Cloning -->\n                <div class="prd-task-wrapper">\n                    <label class="task-container flex items-start gap-4 p-5 rounded-xl glass-panel cursor-pointer" onclick="togglePrdInput(\'cloning\')">'
);

// 2. Enhance togglePrdInput in script
const oldTogglePrdTarget = `window.togglePrdInput = function(type) {
            const allTypes = ['wizard', 'manual', 'cloning'];
            const currentPanel = document.getElementById('prd-input-' + type);
            if (!currentPanel) return;

            // Close other panels
            allTypes.filter(t => t !== type).forEach(t => {
                const other = document.getElementById('prd-input-' + t);
                if (other && !other.classList.contains('hidden')) {
                    other.style.maxHeight = '0';
                    other.style.opacity = '0';
                    setTimeout(() => other.classList.add('hidden'), 400);
                }
            });

            // Toggle current panel
            if (currentPanel.classList.contains('hidden')) {
                currentPanel.classList.remove('hidden');
                void currentPanel.offsetWidth; // reflow
                currentPanel.style.maxHeight = currentPanel.scrollHeight + 60 + 'px';
                currentPanel.style.opacity = '1';
            } else {
                currentPanel.style.maxHeight = '0';
                currentPanel.style.opacity = '0';
                setTimeout(() => currentPanel.classList.add('hidden'), 400);
            }
        };`;

const newTogglePrd = `window.togglePrdInput = function(type) {
            const allTypes = ['wizard', 'manual', 'cloning'];
            const currentPanel = document.getElementById('prd-input-' + type);
            if (!currentPanel) return;

            const isCurrentlyHidden = currentPanel.classList.contains('hidden');

            // Close other panels
            allTypes.filter(t => t !== type).forEach(t => {
                const other = document.getElementById('prd-input-' + t);
                if (other && !other.classList.contains('hidden')) {
                    other.style.maxHeight = '0';
                    other.style.opacity = '0';
                    setTimeout(() => other.classList.add('hidden'), 400);
                }
            });

            // Toggle current panel
            if (isCurrentlyHidden) {
                currentPanel.classList.remove('hidden');
                void currentPanel.offsetWidth; // reflow
                currentPanel.style.maxHeight = (currentPanel.scrollHeight + 120) + 'px';
                currentPanel.style.opacity = '1';
                
                // Focus & smooth scroll
                setTimeout(() => {
                    currentPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    const firstInput = currentPanel.querySelector('input[type="text"], textarea');
                    if (firstInput) firstInput.focus();
                }, 150);
            } else {
                currentPanel.style.maxHeight = '0';
                currentPanel.style.opacity = '0';
                setTimeout(() => currentPanel.classList.add('hidden'), 400);
            }
        };`;

content = content.replace(oldTogglePrdTarget, newTogglePrd);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated app.astro for Planning task card clicks');
