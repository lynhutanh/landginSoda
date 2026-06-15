const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../user/app/components/KocBoutiqueClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// I will use regex to extract sections, then reassemble them in the desired order and with the exact Petpal titles.

// 1. HERO
let heroRegex = /\{\/\* ── HERO SECTION[\s\S]*?<\/section>/;
let heroMatch = content.match(heroRegex);
let hero = heroMatch ? heroMatch[0] : '';
// Replace Hero title
hero = hero.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, `<h1 className="hero-title-main text-[clamp(2.5rem,5.5vw,4.8rem)] font-extrabold font-sans-title tracking-tight leading-[1.08] text-[#002169]">\n                Trusted <span className="text-[#ED1730]">Pet care</span> & Veterinary Center Point\n              </h1>`);

// 2. COUNTER
let counterRegex = /\{\/\* ── COUNTER SECTION[\s\S]*?<\/section>/;
let counterMatch = content.match(counterRegex);
let counter = counterMatch ? counterMatch[0] : '';
counter = counter.replace(/max-w-7xl mx-auto px-6 grid/, `max-w-7xl mx-auto px-6 mb-12 text-center\"><h2 className=\"text-3xl font-bold text-[#002169] mb-8\">Professional pet care and guaranteed quality</h2></div><div className=\"max-w-7xl mx-auto px-6 grid`);

// 3. CATEGORY FEATURES
let featuresRegex = /\{\/\* ── CATEGORY FEATURES SECTION[\s\S]*?<\/section>/;
let featuresMatch = content.match(featuresRegex);
let features = featuresMatch ? featuresMatch[0] : '';

// 4. ABOUT
let aboutRegex = /\{\/\* ── ABOUT US SECTION[\s\S]*?<\/section>/;
let aboutMatch = content.match(aboutRegex);
let about = aboutMatch ? aboutMatch[0] : '';
about = about.replace(/<h2[^>]*>[\s\S]*?<\/h2>/, `<h2 className="text-3xl md:text-5xl font-bold font-sans-title tracking-tight leading-tight text-[#002169]">\n                Our Passion Is Providing Superior Pet Care\n              </h2>`);

// 5. POPULAR CATEGORIES
let popCatsRegex = /\{\/\* ── POPULAR CATEGORIES SECTION[\s\S]*?<\/section>/;
let popCatsMatch = content.match(popCatsRegex);
let popCats = popCatsMatch ? popCatsMatch[0] : '';
popCats = popCats.replace(/<h2[^>]*>[\s\S]*?<\/h2>/, `<h2 className="text-3xl md:text-5xl font-bold font-sans-title tracking-tight text-[#002169]">\n                Providing Our Best Pet Care & Veterinary Services\n              </h2>`);

// 6. COURSE SECTION (Shop)
let shopRegex = /\{\/\* ── COURSE SECTION[\s\S]*?<\/section>/;
let shopMatch = content.match(shopRegex);
let shop = shopMatch ? shopMatch[0] : '';
shop = shop.replace(/<h2[^>]*>[\s\S]*?<\/h2>/, `<h2 className="text-3xl md:text-5xl font-bold font-sans-title tracking-tight text-[#002169]">\n                Our Quality Products For Your Pets\n              </h2>`);

// 7. VIDEO SECTION
let videoRegex = /\{\/\* ── VIDEO SECTION[\s\S]*?<\/section>/;
let videoMatch = content.match(videoRegex);
let video = videoMatch ? videoMatch[0] : '';

// 8. TEAM SECTION
let teamRegex = /\{\/\* ── TEACHER \/ TEAM SECTION[\s\S]*?<\/section>/;
let teamMatch = content.match(teamRegex);
let team = teamMatch ? teamMatch[0] : '';
team = team.replace(/<h2[^>]*>[\s\S]*?<\/h2>/, `<h2 className="text-3xl md:text-5xl font-bold font-sans-title tracking-tight text-[#002169]">\n                Meet Our Expertise Pet Doctors\n              </h2>`);

// 9. PROMO CHOOSE SECTION
let promoRegex = /\{\/\* ── PROMO CHOOSE SECTION[\s\S]*?<\/section>/;
let promoMatch = content.match(promoRegex);
let promo = promoMatch ? promoMatch[0] : '';
promo = promo.replace(/<h2[^>]*>[\s\S]*?<\/h2>/, `<h2 className="text-3xl md:text-5xl font-bold font-sans-title tracking-tight leading-tight text-[#002169]">\n                Pet emergencies what you need to know.\n              </h2>`);

// 10. TESTIMONIALS SECTION
let testimonialRegex = /\{\/\* ── TESTIMONIALS SECTION[\s\S]*?<\/section>/;
let testimonialMatch = content.match(testimonialRegex);
let testimonial = testimonialMatch ? testimonialMatch[0] : '';
testimonial = testimonial.replace(/<h2[^>]*>[\s\S]*?<\/h2>/, `<h2 className="text-3xl md:text-5xl font-bold font-sans-title tracking-tight leading-tight text-[#002169]">\n                Pet Health Important\n              </h2>`);

// Extract header and footer and other parts
let topParts = content.substring(0, heroMatch.index);
let bottomParts = content.substring(testimonialMatch.index + testimonialMatch[0].length);

// Reassemble in Petpal order: Hero -> About -> Services (PopCats) -> Shop -> Why Choose Us (Promo) -> Counter -> Video -> Team -> Testimonial
let newContent = topParts + 
  hero + '\n\n' +
  about + '\n\n' +
  popCats + '\n\n' +
  shop + '\n\n' +
  promo + '\n\n' +
  counter + '\n\n' +
  video + '\n\n' +
  team + '\n\n' +
  testimonial + '\n\n' +
  bottomParts;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully restructured sections in KocBoutiqueClient.tsx');
