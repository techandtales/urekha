const fs = require('fs');
const path = require('path');

const src = "g:/urekha/urekha/urekha/app/auth";
const folders = ["forgot-password", "reset-password", "update-password", "verify", "verify-otp"];
const roles = ["user", "agent"];

folders.forEach(f => {
  const srcPath = path.join(src, f, "page.tsx");
  if (!fs.existsSync(srcPath)) return;
  const content = fs.readFileSync(srcPath, 'utf-8');
  
  roles.forEach(role => {
    const destDir = path.join(src, role, f);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    
    let newContent = content;
    if (f === "forgot-password") {
      newContent = newContent.replace(/\/auth\/user\/login/g, `/auth/${role}/login`);
      newContent = newContent.replace(/\/auth\/verify-otp/g, `/auth/${role}/verify-otp`);
    } else if (f === "reset-password") {
      newContent = newContent.replace(/\/auth\/login/g, `/auth/${role}/login`);
      newContent = newContent.replace(/\/auth\/verify\?type=recovery/g, `/auth/${role}/verify?type=recovery`);
    } else if (f === "update-password") {
      // Intentionally left blank. Nothing to replace right now.
    } else if (f === "verify") {
      newContent = newContent.replace(/\/auth\/login/g, `/auth/${role}/login`);
      newContent = newContent.replace(/\/auth\/update-password/g, `/auth/${role}/update-password`);
    } else if (f === "verify-otp") {
      newContent = newContent.replace(/\/auth\/user\/login/g, `/auth/${role}/login`);
    }

    fs.writeFileSync(path.join(destDir, "page.tsx"), newContent, 'utf-8');
  });
});
console.log("Done");
