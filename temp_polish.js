const fs = require('fs');
const file = 'app/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace rounded-lg with rounded-xl and add group for sidebar buttons
content = content.replace(/className=\`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 \$\{/g, 'className=\`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${');

// Add group to the Settings link
content = content.replace(/className=\`flex items-center gap-3 px-4 py-3 rounded-lg transition-all/g, 'className=\`flex items-center gap-3 px-4 py-3 rounded-xl group transition-all');

// Fix icon hover states
content = content.replace(/"text-slate-400 dark:text-zinc-500"/g, '"text-slate-400 dark:text-zinc-500 group-hover:text-primary transition-colors"');

fs.writeFileSync(file, content);
console.log('Sidebar polished');
