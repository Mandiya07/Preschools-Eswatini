const fs = require('fs');
const files = [
  'src/pages/super/SuperAdminSocialPage.tsx',
  'src/pages/SubscriptionPage.tsx',
  'src/pages/FaqPage.tsx',
  'src/pages/ParentPortalPage.tsx',
  'src/pages/DirectoryPage.tsx',
  'src/components/AnalyticsCard.tsx'
];

const patterns = [
  { search: /slate-850/g, replace: 'slate-800' },
  { search: /slate-705/g, replace: 'slate-700' },
  { search: /slate-450/g, replace: 'slate-400' },
  { search: /blue-650/g, replace: 'blue-600' },
  { search: /slate-150/g, replace: 'slate-200' },
  { search: /amber-350/g, replace: 'amber-300' },
  { search: /slate-750/g, replace: 'slate-700' },
  { search: /slate-650/g, replace: 'slate-600' },
  { search: /slate-250/g, replace: 'slate-200' },
  { search: /indigo-650/g, replace: 'indigo-600' },
  { search: /slate-550/g, replace: 'slate-500' },
  { search: /blue-850/g, replace: 'blue-800' },
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    patterns.forEach(p => {
      if (content.match(p.search)) {
        content = content.replace(p.search, p.replace);
        changed = true;
      }
    });
    if (changed) {
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  }
});
