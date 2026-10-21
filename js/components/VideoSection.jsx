// js/components/VideoSection.jsx - Reel Video Showcase with Floating Hearts
(function () {
  const { useState, useEffect, useRef } = React;

  window.VideoSection = function VideoSection() {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [showControls, setShowControls] = useState(false);
    const hideTimeoutRef = useRef(null);
    const hasAutoPlayedRef = useRef(false);

    // Floating pink hearts generator (Gentle slow speed)
    useEffect(() => {
      const section = sectionRef.current;
      if (!section) return;

      const intervalId = setInterval(() => {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = '♥';
        heart.style.left = Math.random() * 95 + '%';
        heart.style.fontSize = (12 + Math.random() * 18) + 'px';
        heart.style.animationDuration = (7.5 + Math.random() * 4) + 's'; // Slow, gentle fall
        section.appendChild(heart);
        heart.addEventListener('animationend', () => heart.remove());
      }, 700);

      return () => clearInterval(intervalId);
    }, []);

    // Intersection observer for auto-play ONCE only, then manual control via buttons
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        setIsPlaying(false);
        setShowControls(true);
      };

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);

      let observer = null;
      // Auto-play only the first time the video enters the viewport
      if ('IntersectionObserver' in window && !hasAutoPlayedRef.current) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !hasAutoPlayedRef.current) {
                hasAutoPlayedRef.current = true;
                video.play().catch(() => {});
                // Disconnect immediately so scrolling does NOT auto-play or auto-pause again
                observer.disconnect();
              }
            });
          },
          { threshold: 0.3 }
        );
        observer.observe(video);
      }

      return () => {
        if (observer) observer.disconnect();
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
      };
    }, []);

    const togglePlay = (e) => {
      if (e) e.stopPropagation();
      const video = videoRef.current;
      if (!video) return;

      // User has manually interacted; never auto-play again
      hasAutoPlayedRef.current = true;

      if (video.paused || video.ended) {
        if (video.ended) {
          video.currentTime = 0;
        }
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        video.pause();
        setIsPlaying(false);
        setShowControls(false);
      }
    };

    const toggleSound = (e) => {
      if (e) e.stopPropagation();
      const video = videoRef.current;
      if (!video) return;
      video.muted = !video.muted;
      setIsMuted(video.muted);
    };

    const handleFrameClick = () => {
      if (isPlaying) {
        setShowControls(true);
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    return (
      <section
        className="story-video-section heart-section"
        id="heartSection"
        ref={sectionRef}
        aria-label="Cafe Video Showcase"
      >
        <div className="container story-video-grid">
          {/* Left Column: Video Story Narrative */}
          <div className="video-info-box">
            <div className="section-label-eyebrow">
              <i className="fas fa-play-circle"></i>
              <span>Life at Pizza Stop</span>
            </div>

            <h2 className="video-heading">
              Feel the <span>Energy &amp; Warmth</span> in Every Visit.
            </h2>

            <p className="video-lead-text">
              From spontaneous road trips along the Pune-Nashik Highway to anniversary toasts, birthdays, and
              laughter-filled evenings with friends — experience the vibrant atmosphere that makes Pizza Stop Alephata so
              special.
            </p>

            <div className="video-perks-list">
              <div className="video-perk-item">
                <div className="video-perk-icon">
                  <i className="fas fa-mug-hot"></i>
                </div>
                <span>Lively highway hangout with cozy, inviting indoor &amp; outdoor seating</span>
              </div>

              <div className="video-perk-item">
                <div className="video-perk-icon">
                  <i className="fas fa-pizza-slice"></i>
                </div>
                <span>Artisan stone-baked pizzas, signature cold coffees, and gourmet sides</span>
              </div>

              <div className="video-perk-item">
                <div className="video-perk-icon">
                  <i className="fab fa-instagram"></i>
                </div>
                <span>Captured and tagged by real highway travelers: @CAFE.PIZZASTOP_ALEPHATA</span>
              </div>
            </div>

            <a href="#cozy-corner" className="btn-primary-action">
              <span>Explore Cafe Ambiance</span>
              <i className="fas fa-arrow-down"></i>
            </a>
          </div>

          {/* Right Column: Phone Mockup Video Player */}
          <div className="video-player-wrapper">
            <div
              className={`video-phone-frame ${isPlaying ? 'is-playing' : ''} ${showControls ? 'show-controls' : ''}`}
              onClick={handleFrameClick}
            >
              {/* Instagram Handle Badge */}
              <a
                href="https://www.instagram.com/cafe.pizzastop_alephata/"
                target="_blank"
                rel="noopener noreferrer"
                className="video-overlay-badge"
                title="Open Pizza Stop Instagram Profile"
                aria-label="Follow Pizza Stop on Instagram"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="fab fa-instagram"></i>
                <span>@cafe.pizzastop_alephata</span>
              </a>

              {/* Video Element (Plays first time automatically, then manual control) */}
              <video
                ref={videoRef}
                id="cafeStoryVideo"
                className="cafe-story-video"
                playsInline
                preload="metadata"
                muted={isMuted}
                src="./video/snapgram.io_iclpdlznzt4f.mp4"
                poster="./background/birth.png"
              ></video>

              {/* Play / Pause Center Overlay */}
              <div className="video-action-overlay">
                <button
                  type="button"
                  className="btn-video-play"
                  id="btnVideoPlay"
                  aria-label={isPlaying ? 'Pause Cafe Video' : 'Play Cafe Video'}
                  title={isPlaying ? 'Pause Video' : 'Play Video'}
                  onClick={togglePlay}
                >
                  <i className={isPlaying ? 'fas fa-pause' : 'fas fa-play'}></i>
                </button>
              </div>

              {/* Sound Toggle Button */}
              <button
                type="button"
                className="btn-video-sound"
                id="btnVideoSound"
                aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
                title={isMuted ? 'Unmute sound' : 'Mute sound'}
                onClick={toggleSound}
              >
                <i className={isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'}></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };
})();
