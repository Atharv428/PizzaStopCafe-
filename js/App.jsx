// js/App.jsx - Main Application Entrypoint
(function () {
  const { useState, useEffect } = React;

  function App() {
    const validThemes = ['cyan-purple', 'orange-cream', 'lime-violet'];
    const savedTheme = localStorage.getItem('pizzastop_theme');
    const [theme, setTheme] = useState(validThemes.includes(savedTheme) ? savedTheme : 'cyan-purple');

    useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('pizzastop_theme', theme);

      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        if (theme === 'cyan-purple') metaTheme.content = '#11101C';
        else if (theme === 'orange-cream') metaTheme.content = '#301044';
        else if (theme === 'lime-violet') metaTheme.content = '#101010';
      }
    }, [theme]);

    useEffect(() => {
      const handleStorage = (e) => {
        if (e.key === 'pizzastop_theme' && e.newValue && validThemes.includes(e.newValue)) {
          setTheme(e.newValue);
        }
      };
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
      <React.Fragment>
        {/* Ambient Particles Atmosphere */}
        <div className="story-bg-particles"></div>

        {/* Top Floating Navigation Bar */}
        <TopNav theme={theme} onThemeChange={setTheme} />

        {/* Main Story Sections */}
        <main id="story-main-content">
          <HeroSection />
          <StoryIntro />
          <VideoSection />
          <AmbianceSection />
          <MemoryWall />
        </main>

        {/* Minimal Brand Footer */}
        <Footer />
      </React.Fragment>
    );
  }

  const container = document.getElementById('root');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
  }
})();
