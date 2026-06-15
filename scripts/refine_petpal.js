const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../user/app/components/KocBoutiqueClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  { search: /bg-gray-900/g, replace: 'bg-[#002169]' },
  { search: /text-gray-900/g, replace: 'text-[#002169]' },
  { search: /text-gray-500/g, replace: 'text-[#767676]' },
  { search: /text-gray-600/g, replace: 'text-[#686677]' },
  { search: /bg-gray-50/g, replace: 'bg-[#F7F4F7]' },
  { search: /border-gray-200/g, replace: 'border-[#EFEFEF]' },
  { search: /border-gray-300/g, replace: 'border-[#F9EADC]' },
  { search: /text-gray-400/g, replace: 'text-[#ACB9D8]' }
];

replacements.forEach(({ search, replace }) => {
  content = content.replace(search, replace);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully refined colors in KocBoutiqueClient.tsx');
