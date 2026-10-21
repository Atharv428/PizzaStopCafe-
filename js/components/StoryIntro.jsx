// js/components/StoryIntro.jsx - Our Story Narrative & Craft
(function () {
  window.StoryIntro = function StoryIntro() {
    return (
      <section className="story-narrative-section" id="our-story" aria-label="Our Cafe Story">
        <div className="container story-grid-layout">

          {/* Left Visual Collage */}
          <div className="story-collage-wrapper">
            <div className="collage-main-frame">
              <img
                src="./background/bro.jpg"
                alt="Cozy ambient cafe interior and lush garden dining space at Pizza Stop Alephata"
                className="collage-main-img"
                loading="lazy"
              />
              <div className="collage-main-overlay"></div>
              <div className="collage-main-caption">
                <h4>The Alephata Sanctuary</h4>
                <p>A tranquil, welcoming haven where friends, families, and travelers connect.</p>
              </div>
            </div>

            {/* Overlapping Floating Badge */}
            <div className="collage-overlap-badge">
              <div className="overlap-icon">
                <i className="fas fa-pizza-slice"></i>
              </div>
              <div className="overlap-text">
                <h5>Artisan Craft</h5>
                <p>Fresh Dough &amp; Pure Mozzarella</p>
              </div>
            </div>
          </div>

          {/* Right Narrative Story */}
          <div className="story-text-wrapper">
            <div className="section-label-eyebrow">
              <i className="fas fa-leaf"></i>
              <span>Our Heart &amp; Soul</span>
            </div>

            <h2 className="story-heading-primary">
              Our Story — <span>Made with Love,</span> Served with Passion.
            </h2>

            <p className="story-lead-paragraph">
              At Pizza Stop Alephata, we believe food is more than just a meal — it is an invitation to pause, share a
              smile, and celebrate the moments that matter most.
            </p>

            <p className="story-body-paragraph">
              Our journey began with a heartfelt passion for authentic flavours and handcrafted food. Nestled along the
              bustling Pune-Nashik Highway in Alephata, we set out to create a warm, inviting destination where travelers taking
              a road break, local families gathering for celebrations, and friends catching up can all feel right at home.
            </p>

            <p className="story-body-paragraph">
              Every pizza that leaves our kitchen starts with fresh dough kneaded daily, layered with rich house-blended
              sauces, 100% pure dairy mozzarella, and vibrant garden-fresh vegetables. We never cut corners, because we
              believe true culinary joy comes from honest ingredients, patient baking, and genuine attention to every
              detail.
            </p>

            <div className="story-quote-card">
              “When you cook with real love, people don’t just taste the food — they feel the warmth behind it.”
            </div>

            <p className="story-body-paragraph">
              Our vision is simple yet profound: to be Alephata’s favourite food destination — a place known not only for
              unforgettable pizzas, gourmet burgers, and creamy cold coffees, but for the smiles, memories, and warm
              hospitality that greet you every time you walk through our doors.
            </p>

            <div className="story-pills-row">
              <div className="story-pill-item">
                <i className="fas fa-seedling"></i>
                <span>Farm-Fresh Toppings</span>
              </div>
              <div className="story-pill-item">
                <i className="fas fa-fire"></i>
                <span>Stone-Baked Perfection</span>
              </div>
              <div className="story-pill-item">
                <i className="fas fa-users"></i>
                <span>Family &amp; Highway Haven</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    );
  };
})();
