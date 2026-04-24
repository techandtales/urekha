const fs = require('fs');
const file = 'app/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace standard tab 'active' state
content = content.replace(/bg-slate-200\/50 dark:bg-\[#D4AF37\]\/10 text-slate-900 dark:text-\[#D4AF37\] border border-slate-300 dark:border-\[#D4AF37\]\/30 shadow-\[0_0_10px_rgba\(0,0,0,0\.05\)\] dark:shadow-\[0_0_20px_rgba\(212,175,55,0\.05\)\]/g, 'border-primary text-primary dark:text-primary bg-primary/5 shadow-[0_0_15px_rgba(124,58,237,0.1)]');

// Replace standard tab 'inactive' state
content = content.replace(/text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-\[#D4AF37\] hover:bg-slate-100 dark:hover:bg-\[#D4AF37\]\/5 border border-transparent/g, 'border-transparent text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5');

// For icons
content = content.replace(/text-\[#D4AF37\]/g, 'text-primary');

// Import framer-motion if not imported
if (!content.includes('from "framer-motion"')) {
    content = content.replace(/import { useState/g, 'import { motion } from "framer-motion";\nimport { useState');
}

// Add motion.div active-pill to buttons.
// Button 1: reports
const tab1regex = /(<LayoutDashboard size=\{18\}.*?\/>\s*<span className="text-sm font-medium tracking-wide">Dashboard<\/span>\s*)(<\/button>)/;
content = content.replace(tab1regex, '$1 {activeTab === "reports" && <motion.div layoutId="active-pill" className="ml-auto w-1 h-4 rounded-full bg-primary" />}\n$2');

// Button 2: generate
const tab2regex = /(<FileText size=\{18\}.*?\/>\s*<span className="text-sm font-medium tracking-wide">Generate Report<\/span>\s*)(<\/button>)/;
content = content.replace(tab2regex, '$1 {activeTab === "generate" && <motion.div layoutId="active-pill" className="ml-auto w-1 h-4 rounded-full bg-primary" />}\n$2');

// Button 3: profile
const tab3regex = /(<User size=\{18\}.*?\/>\s*<span className="text-sm font-medium tracking-wide">Agent Profile<\/span>\s*)(<\/button>)/;
content = content.replace(tab3regex, '$1 {activeTab === "profile" && <motion.div layoutId="active-pill" className="ml-auto w-1 h-4 rounded-full bg-primary" />}\n$2');

// Settings Link (since it's a link, we'll give it the active tab styling and a pill if pathname matches... but Agent dashboard doesn't use pathname for tabs, it uses activeTab='profile' etc. For settings, they click a link that routes to /dashboard/settings.
// So we just leave the Settings Link styled as inactive but hovering correctly)

fs.writeFileSync(file, content);
console.log('Sidebar tabs updated successfully!');
