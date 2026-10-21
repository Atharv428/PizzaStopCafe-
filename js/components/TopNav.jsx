// js/components/TopNav.jsx - Floating Navigation Bar & Theme Picker
(function () {
  const { useState, useEffect } = React;

  const THEMES = [
    { key: 'cyan-purple', name: 'Electric Cyan' },
    { key: 'orange-cream', name: 'Hot Orange' },
    { key: 'lime-violet', name: 'Neon Lime' }
  ];

  window.TopNav = function TopNav({ theme, onThemeChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 40);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
      const closeDropdown = (e) => {
        if (!e.target.closest('#themePalettePicker')) {
          setIsOpen(false);
        }
      };
      document.addEventListener('click', closeDropdown);
      return () => document.removeEventListener('click', closeDropdown);
    }, []);

    const activeThemeObj = THEMES.find((t) => t.key === theme) || THEMES[0];

    return (
      <header
        className="top-nav-bar"
        role="banner"
        style={{
          boxShadow: scrolled
            ? '0 8px 30px rgba(0, 0, 0, 0.55)'
            : '0 6px 24px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div className="brand-nav-link">
          <img
            src="./Logo/logo.jpeg"
            alt="Pizza Stop Alephata Logo"
            className="brand-logo-img"
            width="54"
            height="54"
          />
          <div className="brand-nav-meta">
            <span className="brand-nav-name">Pizza Stop Alephata</span>
            <span className="brand-nav-badge">Pune - Nashik Highway</span>
          </div>
        </div>

        <div className="nav-actions">
          {/* Theme Palette Picker */}
          <div
            className={`theme-palette-picker ${isOpen ? 'open' : ''}`}
            id="themePalettePicker"
          >
            <button
              type="button"
              className="theme-picker-btn"
              id="themePickerBtn"
              title="Change Website Color Palette"
              aria-label="Change Website Color Palette"
              onClick={() => setIsOpen(!isOpen)}
            >
              <i className="fas fa-palette"></i>
              <span className="theme-active-label">{activeThemeObj.name}</span>
              <i className="fas fa-chevron-down chevron-icon"></i>
            </button>

            <div className="theme-dropdown-menu" id="themeDropdown">
              <span className="theme-dropdown-title">Choose Color Mood</span>
              {THEMES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`theme-option-btn ${theme === item.key ? 'active' : ''}`}
                  onClick={() => {
                    onThemeChange(item.key);
                    setIsOpen(false);
                  }}
                >
                  <span className={`theme-swatch-circle swatch-${item.key}`}></span>
                  <span className="theme-name">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <a
            href="login.html"
            className="nav-btn-login"
            title="Sign in to your member account"
          >
            <i className="fas fa-sign-in-alt"></i>
            <span>Login</span>
          </a>
        </div>
      </header>
    );
  };
})();
