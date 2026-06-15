const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../user/app/components/KocBoutiqueClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the section containing the Hero title.
const heroSectionStart = content.indexOf('{/* ── HERO SECTION');
const aboutSectionStart = content.indexOf('{/* ── CATEGORY FEATURES SECTION');

if (heroSectionStart !== -1 && aboutSectionStart !== -1) {
  const newHero = `{/* ── HERO SECTION (Petpal Home Layout) ─────────────────────────────────── */}
        <section className="relative min-h-[calc(100vh-80px)] flex items-center py-20 px-6 md:px-12 overflow-hidden z-10 bg-[#F7F4F7]">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left z-10">
              <h1 className="hero-title-main text-[clamp(2.5rem,4.5vw,4.5rem)] font-extrabold font-sans-title tracking-tight leading-[1.15] text-[#002169]">
                Trusted Pet <span className="inline-block px-2">🐾</span> <br />
                Care & Veterinary <br />
                Center <span className="inline-flex items-center justify-center w-[50px] h-[50px] bg-[#ED1730] rounded-full align-middle mx-2 text-white shadow-[0_0_20px_rgba(237,23,48,0.5)]">❤</span> Point
              </h1>

              <p className="hero-desc text-[#767676] text-[15px] font-medium leading-relaxed max-w-md pt-2">
                Template Kit uses demo images from Envato Elements Follower will need to license these images from Envato.
              </p>

              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-4 px-8 py-3.5 bg-[#894B8D] hover:bg-[#002169] text-white text-sm font-bold rounded-full flex items-center gap-2 transition-colors duration-300 w-fit"
              >
                Read More <span className="text-lg">→</span>
              </button>
            </div>

            {/* Hero Right Image (Petpal Style) */}
            <div className="lg:col-span-6 relative flex justify-end z-10">
              <div className="relative w-full max-w-xl">
                <img 
                  src="https://themedox.com/demo/petpal/assets/img/banner/banner_img01.png" 
                  alt="Petpal Banner" 
                  className="w-full h-auto object-contain relative z-10"
                />
                
                {/* Yellow Badge */}
                <div className="absolute right-0 bottom-16 w-[120px] h-[120px] bg-[#FFBE17] rounded-full z-20 flex items-center justify-center border-4 border-white shadow-xl animate-[spin_10s_linear_infinite]">
                  <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                    <path id="curve" fill="transparent" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                    <text className="text-[10px] font-bold fill-[#002169] tracking-[0.2em] uppercase">
                      <textPath href="#curve">Better - Healthy - Love - Pets - </textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xl text-[#002169]">
                    🐶
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

`;
  // We want to replace from heroSectionStart to the next section start
  // Wait, the next section is COUNTER SECTION.
  const counterSectionStart = content.indexOf('{/* ── COUNTER SECTION');
  if (counterSectionStart !== -1) {
    content = content.substring(0, heroSectionStart) + newHero + content.substring(counterSectionStart);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully applied new Petpal Hero Section');
  } else {
     console.log('Counter section not found');
  }
} else {
  console.log('Hero section not found');
}
