const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../user/app/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');

// Replace mock products images
pageContent = pageContent.replace(/'\/assets\/img\/product\/1.png'/g, "'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=500&q=80'");
pageContent = pageContent.replace(/'\/assets\/img\/product\/2.png'/g, "'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80'");
pageContent = pageContent.replace(/'\/assets\/img\/product\/3.png'/g, "'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80'");
pageContent = pageContent.replace(/'\/assets\/img\/product\/4.png'/g, "'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500&q=80'");
pageContent = pageContent.replace(/'\/assets\/img\/product\/5.png'/g, "'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=500&q=80'");
pageContent = pageContent.replace(/'\/assets\/img\/product\/6.png'/g, "'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=500&q=80'");
pageContent = pageContent.replace(/\/assets\/img\/logo\.png/g, "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=150&q=80"); // Generic pet logo avatar

fs.writeFileSync(pagePath, pageContent, 'utf8');

const clientPath = path.join(__dirname, '../user/app/components/KocBoutiqueClient.tsx');
let clientContent = fs.readFileSync(clientPath, 'utf8');

// Replace hero and about images
clientContent = clientContent.replace(/\/assets\/img\/home-img2\.png/g, "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80");
clientContent = clientContent.replace(/\/assets\/img\/about1\.png/g, "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80");
clientContent = clientContent.replace(/\/assets\/img\/about3\.png/g, "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80");
clientContent = clientContent.replace(/\/assets\/img\/bg\/video\.jpg/g, "https://images.unsplash.com/photo-1537151608804-ea626aab388c?auto=format&fit=crop&w=1200&q=80");

// Replace team images
clientContent = clientContent.replace(/\/assets\/img\/team\/team1\.jpg/g, "https://images.unsplash.com/photo-1533743983669-94fa5c4338ef?auto=format&fit=crop&w=400&q=80");
clientContent = clientContent.replace(/\/assets\/img\/team\/team2\.jpg/g, "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80");
clientContent = clientContent.replace(/\/assets\/img\/team\/team3\.jpg/g, "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80");
clientContent = clientContent.replace(/\/assets\/img\/team\/team4\.jpg/g, "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80");

// Replace Logo
clientContent = clientContent.replace(/\/assets\/img\/logo\.png/g, "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=150&q=80");

fs.writeFileSync(clientPath, clientContent, 'utf8');
console.log('Successfully replaced image URLs');
