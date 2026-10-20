/* ==========================================================================
   PIZZA STOP ALEPHATA - STORY PAGE INTERACTIVITY & THEME SWITCHER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Palette Switcher
  const themePicker = document.getElementById('themePalettePicker');
  const themePickerBtn = document.getElementById('themePickerBtn');
  const themeOptions = document.querySelectorAll('.theme-option-btn');
  const activeLabel = document.querySelector('.theme-active-label');

  const themeNames = {
    'cyan-purple': 'Electric Cyan',
    'orange-cream': 'Hot Orange',
    'lime-violet': 'Neon Lime'
  };

  const validThemes = ['cyan-purple', 'orange-cream', 'lime-violet'];

  // Load saved theme or default to 'cyan-purple'
  const savedTheme = localStorage.getItem('pizzastop_theme');
  const initialTheme = validThemes.includes(savedTheme) ? savedTheme : 'cyan-purple';
  applyTheme(initialTheme);

  if (themePickerBtn && themePicker) {
    themePickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themePicker.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!themePicker.contains(e.target)) {
        themePicker.classList.remove('open');
      }
    });
  }

  themeOptions.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme-val');
      applyTheme(selectedTheme);
      if (themePicker) {
        themePicker.classList.remove('open');
      }
    });
  });

  function applyTheme(themeKey) {
    if (!validThemes.includes(themeKey)) {
      themeKey = 'cyan-purple';
    }

    document.documentElement.setAttribute('data-theme', themeKey);
    localStorage.setItem('pizzastop_theme', themeKey);

    themeOptions.forEach((btn) => {
      if (btn.getAttribute('data-theme-val') === themeKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (activeLabel && themeNames[themeKey]) {
      activeLabel.textContent = themeNames[themeKey];
    }

    // Update browser theme-color for mobile chrome / safari status bar
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      if (themeKey === 'cyan-purple') metaTheme.content = '#11101C';
      else if (themeKey === 'orange-cream') metaTheme.content = '#301044';
      else if (themeKey === 'lime-violet') metaTheme.content = '#101010';
    }
  }

  // Real-time synchronization across open tabs or pages
  window.addEventListener('storage', (e) => {
    if (e.key === 'pizzastop_theme' && e.newValue) {
      applyTheme(e.newValue);
    }
  });

  // 2. Navigation Header Shadow On Scroll
  const navBar = document.querySelector('.top-nav-bar');
  if (navBar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navBar.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.55)';
      } else {
        navBar.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.35)';
      }
    });
  }

  // 3. Cafe Video Player Interaction
  const cafeVideo = document.getElementById('cafeStoryVideo');
  const videoFrame = document.querySelector('.video-phone-frame');
  const btnPlay = document.getElementById('btnVideoPlay');
  const btnSound = document.getElementById('btnVideoSound');

  if (cafeVideo && videoFrame) {
    const togglePlay = () => {
      if (cafeVideo.paused) {
        cafeVideo.play().then(() => {
          videoFrame.classList.add('is-playing');
          if (btnPlay) btnPlay.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(() => {});
      } else {
        cafeVideo.pause();
        videoFrame.classList.remove('is-playing');
        if (btnPlay) btnPlay.innerHTML = '<i class="fas fa-play"></i>';
      }
    };

    if (btnPlay) {
      btnPlay.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
      });
    }

    videoFrame.addEventListener('click', () => {
      togglePlay();
    });

    if (btnSound) {
      btnSound.addEventListener('click', (e) => {
        e.stopPropagation();
        cafeVideo.muted = !cafeVideo.muted;
        if (cafeVideo.muted) {
          btnSound.innerHTML = '<i class="fas fa-volume-mute"></i>';
          btnSound.setAttribute('aria-label', 'Unmute sound');
        } else {
          btnSound.innerHTML = '<i class="fas fa-volume-up"></i>';
          btnSound.setAttribute('aria-label', 'Mute sound');
        }
      });
    }

    // Auto play when scrolled into view (muted)
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cafeVideo.play().then(() => {
              videoFrame.classList.add('is-playing');
              if (btnPlay) btnPlay.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(() => {});
          } else {
            cafeVideo.pause();
            videoFrame.classList.remove('is-playing');
            if (btnPlay) btnPlay.innerHTML = '<i class="fas fa-play"></i>';
          }
        });
      }, { threshold: 0.35 });

      observer.observe(videoFrame);
    }
  }
});
