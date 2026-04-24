const fs = require("fs");

const promptsRaw = fs.readFileSync("doc/prompts_rows.csv", "utf8");
const promptMap = {};

// Parse multiline manually
const lines = promptsRaw.split('\n');
for (const line of lines) {
    if (/^\d+,/.test(line)) {
        // Line starts with ID
        const match = line.match(/^(\d+),/);
        const id = match[1];
        
        // Find slug. Slug is lowercase alpha numeric with hyphens, followed by ,"
        // Or we can just look for things like personal-insight-1200
        const slugMatch = line.match(/([a-z0-9]+-[a-z0-9\-]+-\d{4}),"/);
        if (slugMatch) {
            promptMap[slugMatch[1]] = id;
        } else {
            // Slug might not have 1200, might just be `lifelong-overview-1200` type
            const slugMatch2 = line.match(/,([a-z0-9\-]+),"/);
            if (slugMatch2 && slugMatch2[1].includes('-')) {
                promptMap[slugMatch2[1]] = id;
            }
        }
    }
}

// Ensure overrides for explicit mappings
const mapList = { 
  '8': ['personal-insight-1200', 'education-1200', 'career-1200', 'health-1200', 'enemies-1200', 'lifelong-overview-1200', '5-year-forecast-1200'], 
  '9': ['personal-insight-1500', 'education-1500', 'career-1500', 'health-1500', 'finance-1500', 'love-relation-1500', 'family-relation-1500', 'enemies-1500', 'spirituality-1500', 'lifelong-overview-1500', '10-year-forecast-1500'],
  '10': ['personal-insight-2000', 'health-2000', 'career-2000', 'education-2000', 'enemies-2000', 'finance-2000', 'love-relation-2000', 'family-relation-2000', 'spirituality-2000', 'marriage-2000', 'children-2000', 'travel-2000', 'lifelong-overview-2000', '15-year-forecast-2000']
}; 

let out = 'plan_id,prompt_id,display_order\n'; 
Object.keys(mapList).forEach(pid => { 
  mapList[pid].forEach((slug, idx) => { 
     // Note: if promptMap fails, maybe the slug in the DB is named differently.
     let foundId = promptMap[slug];
     
     // Specific fallbacks by looking for the slug directly in the raw text
     if (!foundId) {
         const directMatch = new RegExp(`^(\\d+),.*?,${slug},`, "m").exec(promptsRaw);
         if (directMatch) foundId = directMatch[1];
     }
     if (!foundId) {
         const directMatch2 = new RegExp(`^(\\d+),.*?,${slug.replace('enemies-', 'challenges-')},`, "m").exec(promptsRaw);
         if (directMatch2) { foundId = directMatch2[1]; console.warn(`Replaced ${slug} with ${slug.replace('enemies-', 'challenges-')}`); }
     }
     
     if(foundId) {
         out += `${pid},${foundId},${idx+1}\n`; 
     } else {
         console.warn(`[!] CRITICAL: Missing ID for ${slug} in prompts_rows.csv`);
     }
  }); 
}); 

fs.writeFileSync('doc/pricing_plan_prompts.csv', out); 
console.log('Wrote to doc/pricing_plan_prompts.csv successfully!');
