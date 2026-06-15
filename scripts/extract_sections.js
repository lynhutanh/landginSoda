const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\tgrde\\.gemini\\antigravity-ide\\brain\\8904ce83-9b6e-4455-be82-e10edd4cbc42\\petpal.html', 'utf8');

const regex = /<section[^>]*class="([^"]*)"[^>]*>[\s\S]*?<div[^>]*class="(?:container|row)[^"]*"[^>]*>/g;
let match;
const sections = [];
while ((match = regex.exec(html)) !== null) {
  sections.push(match[1]);
}

console.log("Sections found:");
console.log(sections);
