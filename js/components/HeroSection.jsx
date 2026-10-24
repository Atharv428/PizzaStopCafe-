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
      </section>
    );
  };
})();
