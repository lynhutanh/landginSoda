const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../user/app/components/KocBoutiqueClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  { search: /#F7931A/g, replace: '#FFBE17' },
  { search: /#EA580C/g, replace: '#ED1730' },
  { search: /Eduleb/g, replace: 'Petpal' },
  { search: /eduleb/g, replace: 'petpal' },
  { search: /Smart Study/g, replace: 'Care for Pets' },
  { search: /Where Knowledge Meets the Web/g, replace: 'Where Pets Meet Love' },
  { search: /Student Eduleb/g, replace: 'Petpal Pets' },
  { search: /Active student/g, replace: 'Happy Pets' },
  { search: /Our Online Course/g, replace: 'Pet Products' },
  { search: /Academic Programs/g, replace: 'Pet Brands' },
  { search: /Certified Students/g, replace: 'Verified Reviews' },
  { search: /Enrolled Students/g, replace: 'Customers' },
  { search: /Search your course here/g, replace: 'Search pet products here' },
  { search: /View All Courses/g, replace: 'View All Products' },
  { search: /Online Course/g, replace: 'Pet Products' },
  { search: /Course Fee/g, replace: 'Price' },
  { search: /We Are Providing The Online Course In Global World/g, replace: 'We Are Providing The Best Pet Care Products In The World' },
  { search: /Get access to <b>12,000\+<\/b> of our top courses/g, replace: 'Get access to <b>12,000+</b> of our top pet products' },
  { search: /Popular topic to learn now in our online courses for student/g, replace: 'Popular products for your pets' },
  { search: /Find the right instructor for you/g, replace: 'Find the right product for your pets' },
  { search: /Join with more than <b>80,000\+ <\/b> <br \/>Courses & Learning creators./g, replace: 'Join with more than <b>80,000+ </b> <br />Pet lovers & customers.' },
  { search: /Video Course Tour/g, replace: 'Petpal Store Tour' },
  { search: /Meet our Instructors/g, replace: 'Meet our Experts' },
  { search: /Why Choose Us For Your Online Education Courses/g, replace: 'Why Choose Us For Your Pet Care Needs' },
  { search: /What Student’s Say To Do <br \/>Their Online Course/g, replace: 'What Customer’s Say About <br />Our Pet Products' },
  { search: /Instructor Registration/g, replace: 'Expert Registration' },
  { search: /Become A Teacher/g, replace: 'Become A Partner' },
  { search: /All Instructors/g, replace: 'All Experts' },
  { search: /Popular Course/g, replace: 'Popular Products' },
  { search: /12 Lectures/g, replace: 'Premium' },
  { search: /41 Lectures/g, replace: 'Standard' },
  { search: /2 Hrs 32 Min/g, replace: 'In Stock' },
  { search: /Development/g, replace: 'Dog Food' },
  { search: /Arts & design/g, replace: 'Cat Toys' },
  { search: /Visual Design/g, replace: 'Pet Beds' },
  { search: /Graphic Design/g, replace: 'Accessories' },
  { search: /Code Inspection/g, replace: 'Grooming' },
  { search: /KHÔNG TÌM THẤY KHÓA HỌC PHÙ HỢP./g, replace: 'KHÔNG TÌM THẤY SẢN PHẨM PHÙ HỢP.' },
  { search: /Course/g, replace: 'Products' },
  { search: /student/g, replace: 'customer' },
  { search: /Student/g, replace: 'Customer' }
];

replacements.forEach(({ search, replace }) => {
  content = content.replace(search, replace);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully replaced Petpal strings in KocBoutiqueClient.tsx');
