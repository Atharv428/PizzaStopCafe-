// js/components/AmbianceSection.jsx - Cafe Ambiance & Vibe
(function () {
  window.AmbianceSection = function AmbianceSection() {
    return (
      <section className="story-ambiance-section" id="cozy-corner" aria-label="Cozy Greenery Cafe Corner">
        <div className="container story-ambiance-grid">

          {/* Left Column: High-Res Photo Showcase Frame */}
          <div className="ambiance-photo-wrapper">
            <div className="ambiance-photo-frame">
              <img
                src="./background/birth.png"
                alt="Birthday celebrations and cozy moments at Pizza Stop Alephata"
                className="ambiance-showcase-img"
                loading="lazy"
              />
              <div className="ambiance-photo-overlay"></div>
              <div className="ambiance-photo-tag-pill">
                <i className="fas fa-heart"></i>
                <span>Found my happy corner ❣️🍕 @cafe.pizzastop_alephata</span>
              </div>
            </div>
          </div>

          {/* Right Column: Atmosphere & Ambiance Narrative */}
          <div className="ambiance-info-box">
            <div className="section-label-eyebrow">
              <i className="fas fa-leaf"></i>
              <span>Cafe Atmosphere &amp; Vibe</span>
            </div>

            <h2 className="ambiance-heading">
              Step Into Our <span>Cozy Greenery Corner.</span>
            </h2>

            <p className="ambiance-lead-text">
              A lush, tranquil haven designed for slow highway pauses, heartfelt conversations, and cheerful celebrations.
              Surrounded by cascading green ivy, soft golden filament rope lighting, and hand-drawn heart art — every
              corner is crafted to make you feel right at home.
            </p>

            <div className="ambiance-perks-list">
              <div className="ambiance-perk-item">
                <div className="ambiance-perk-icon">
                  <i className="fas fa-seedling"></i>
                </div>
                <div className="ambiance-perk-text">
                  <h4>Lush Ivy Canopy &amp; Plants</h4>
                  <p>Natural green ceiling foliage creating a refreshing, soothing atmosphere from your highway journey.</p>
                </div>
              </div>

              <div className="ambiance-perk-item">
                <div className="ambiance-perk-icon">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <div className="ambiance-perk-text">
                  <h4>Warm Filament Rope Lighting</h4>
                  <p>Rustic pendant bulbs casting an intimate, golden glow over comfortable dining tables.</p>
                </div>
              </div>

              <div className="ambiance-perk-item">
                <div className="ambiance-perk-icon">
                  <i className="fas fa-camera-retro"></i>
                </div>
                <div className="ambiance-perk-text">
                  <h4>The Alephata Heart-Art Wall</h4>
                  <p>A beloved highway photo spot where food lovers tag and celebrate memorable moments.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    );
  };
})();
