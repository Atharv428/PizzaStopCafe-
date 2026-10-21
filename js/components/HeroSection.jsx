// js/components/HeroSection.jsx - Hero Banner
(function () {
  window.HeroSection = function HeroSection() {
    return (
      <section className="story-hero-section" id="hero" aria-label="Hero Section">
        <div className="hero-bg-media">
          <img
            src="./background/1.png"
            alt="Pizza Stop Alephata authentic cafe moments and artisan food showcase"
            className="hero-bg-img"
          />
          <div className="hero-gradient-overlay"></div>
          <div className="hero-vignette"></div>
        </div>

        <div className="hero-content">
          <div className="hero-content-main">
            <div className="hero-eyebrow-pill">
              <i className="fas fa-heart"></i>
              <span>Welcome to Pizza Stop Alephata</span>
            </div>

            <h1 className="hero-title">
              Every Pizza Has a <span>Story.</span>
            </h1>
          </div>

          <div className="hero-content-meta">
            <p className="hero-tagline">
              Born from a passion for artisan food, warm conversations, and genuine hospitality along the Pune-Nashik
              Highway. Step in, unwind, and discover the heartfelt craft behind every single slice.
            </p>

            <a href="#our-story" className="hero-scroll-cue" aria-label="Scroll down to read our story">
              <span>Discover Our Journey</span>
              <div className="hero-scroll-icon">
                <i className="fas fa-chevron-down"></i>
              </div>
            </a>
          </div>
        </div>
      </section>
    );
  };
})();
