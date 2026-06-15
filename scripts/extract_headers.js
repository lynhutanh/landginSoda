const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\tgrde\\.gemini\\antigravity-ide\\brain\\8904ce83-9b6e-4455-be82-e10edd4cbc42\\petpal.html', 'utf8');

const regex = /<section[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/section>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  const className = match[1];
  const sectionHtml = match[2];
  const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/g;
  let h2Match;
  console.log(`\nSection: ${className}`);
  while ((h2Match = h2Regex.exec(sectionHtml)) !== null) {
    console.log(`- ${h2Match[1].replace(/<[^>]+>/g, '').trim()}`);
  }
}
