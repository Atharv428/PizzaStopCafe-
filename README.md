# 🍕 Pizza Stop Alephata — Official Web Portal

> **Made with Love, Served with Passion.**  
> The premier highway food destination and cozy cafe hangout along the **Pune – Nashik Highway (Alephata)**.

---

## 📖 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [CSS & Component Architecture](#-css--component-architecture)
- [Theme System](#-theme-system)
- [Interactive Modules](#-interactive-modules)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Browser Compatibility & Performance](#-browser-compatibility--performance)
- [Social & Location](#-social--location)

---

## 🌟 Overview
**Pizza Stop Alephata** is a vibrant, modern highway cafe offering artisan stone-baked pizzas, gourmet burgers, signature cold coffees, and warm hospitality. 

This repository contains the front-end web application for Pizza Stop Alephata, designed with a focus on rich visual aesthetics, responsive typography, micro-animations, and interactive customer engagement.

---

## ✨ Key Features

### 1. 🎬 Reel Video Showcase (`VideoSection.jsx`)
- **Real Instagram Reel Integration**: Streams authentic cafe moments from [`video/snapgram.io_iclpdlznzt4f.mp4`](./video/snapgram.io_iclpdlznzt4f.mp4).
- **Single-Time Auto-Play**: Automatically starts playing when first scrolled into view, then shifts to manual control.
- **Manual Play / Pause & Audio Controls**: Interactive play/pause toggle and sound mute/unmute control.
- **Top-to-Bottom Falling Hearts**: Pink heart particles cascade gently from the top of the section to the bottom.
- **Instagram Profile Direct Link**: Clickable badge connecting travelers directly to `@cafe.pizzastop_alephata`.

### 2. 📸 Interactive Memory Wall & Polaroid Generator (`MemoryWall.jsx`)
- **Live Camera Capture**: Real-time webcam viewfinder with target reticles and live shutter capture.
- **Photo Upload & Drag-and-Drop**: Easily upload moments directly from mobile galleries or desktop folders.
- **Customizable Polaroid Keepsake**: Real-time live preview with handwritten font captioning, location stamp, and sticker badges.
- **Keepsake Download**: Export the personalized Polaroid photo directly to the device.
- **Moments Filmstrip**: Side reel displaying uploaded moments.

### 3. 🎨 3-Way Dynamic Theme Switcher
- **Electric Cyan & Purple** (`cyan-purple`)
- **Hot Orange & Cream** (`orange-cream`)
- **Neon Lime & Violet** (`lime-violet`)
- Instant theme switching persisted across pages via `localStorage`.

### 4. 🔐 Member Portal (`login.html` & `register.html`)
- Dedicated registration and login screens for express orders, reservations, and rewards.
- Floating particle backdrop and glassmorphic card design.

---

## 🛠 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure, SEO metadata, and OpenGraph tags |
| **React 18** | Modular component-based reactive user interface |
| **Babel Standalone** | In-browser JSX transformation without requiring build pipelines |
| **Tailwind CSS v3** | Utility classes via Play CDN (`corePlugins: { preflight: false }`) |
| **Vanilla CSS3** | Custom animations, responsive grids, and design tokens |
| **Font Awesome 6** | Scalable vector icons |
| **Google Fonts** | `Cinzel` (Brand), `Playfair Display` (Serif Headings), `Plus Jakarta Sans` (Body) |

---

## 📂 Project Directory Structure

```text
d:\brand/
├── Logo/                          # Brand logos and icons
│   └── logo.jpeg
├── background/                    # Background textures and promotional images
│   ├── birth.png                  # Cafe celebration & birthday backdrop
│   └── ...
├── video/                         # Video reels and assets
│   ├── login.mp4                  # Background authentication video
│   ├── snapgram.io_iclpdlznzt4f.mp4 # Cafe celebration showcase reel
│   └── thumb.jpg                  # Video thumbnail preview
├── css/
│   ├── auth.css                   # Styles for login & register pages
│   ├── story.css                  # Master CSS manifest (imports all modules)
│   └── modules/                   # Distributed CSS modules
│       ├── base.css               # Design tokens, themes & particle resets
│       ├── navbar.css             # Navigation bar & theme switcher
│       ├── hero.css               # Hero cover, typography & scroll cue
│       ├── story-intro.css        # Narrative collage & pills
│       ├── video-section.css      # Video reel, falling hearts & media controls
│       ├── ambiance.css           # Cafe corner showcase & perks
│       ├── memory-wall.css        # Camera viewfinder & Polaroid keepsake
│       └── footer.css             # Brand promise seal, CTA & responsive queries
├── js/
│   ├── auth.js                    # Authentication validation and state logic
│   ├── story.js                   # Interactive story utilities & canvas
│   ├── App.jsx                    # Root React component
│   └── components/                # Distributed React components
│       ├── TopNav.jsx             # Top navigation bar & theme dropdown
│       ├── HeroSection.jsx        # Hero headline and cover banner
│       ├── StoryIntro.jsx         # Artisan narrative & photo frame
│       ├── VideoSection.jsx       # Video showcase & falling hearts
│       ├── AmbianceSection.jsx    # Greenery corner & ambiance list
│       ├── MemoryWall.jsx         # Live camera & Polaroid keepsake generator
│       └── Footer.jsx             # Promise seal, closing CTA & footer
├── login.html                     # Customer sign-in page
├── register.html                  # Customer registration page
├── story.html                     # Main interactive cafe story experience
└── README.md                      # Project documentation
```

---

## 🧩 CSS & Component Architecture

### Modular CSS
The stylesheet architecture separates concerns across 8 standalone modules loaded in [`css/story.css`](./css/story.css):

```css
@import "./modules/base.css";
@import "./modules/navbar.css";
@import "./modules/hero.css";
@import "./modules/story-intro.css";
@import "./modules/video-section.css";
@import "./modules/ambiance.css";
@import "./modules/memory-wall.css";
@import "./modules/footer.css";
```

### Preflight-Safe Tailwind Integration
Tailwind CSS v3 runs via Play CDN with Preflight disabled to guarantee zero visual regressions while making utility classes available:

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    corePlugins: { preflight: false },
    theme: {
      extend: {
        colors: {
          leaf: 'var(--c-leaf)',
          forest: 'var(--c-forest)',
          jungle: 'var(--c-jungle)',
          gold: 'var(--c-gold)',
          cream: 'var(--c-cream)',
          yellowAccent: '#FEF08A'
        }
      }
    }
  };
</script>
```

---

## 🎨 Theme System

Themes are activated via the `data-theme` attribute on the `<html>` root element:

- **`cyan-purple`**: Cyan neon primary, deep purple secondary, vibrant teal accents.
- **`orange-cream`**: Warm orange primary, terracotta secondary, honey cream accents.
- **`lime-violet`**: Fresh lime green primary, deep violet secondary, soft gold accents.

### Immediate Theme Guard
```javascript
(function () {
  const valid = ['cyan-purple', 'orange-cream', 'lime-violet'];
  const saved = localStorage.getItem('pizzastop_theme');
  const theme = valid.includes(saved) ? saved : 'cyan-purple';
  document.documentElement.setAttribute('data-theme', theme);
})();
```

---

## 🚀 Getting Started & Local Setup

### Option 1: Python HTTP Server (Recommended)
From the project root directory, run:
```bash
python -m http.server 8085
```
Then open your browser at:
```text
http://localhost:8085/story.html
```

### Option 2: Node.js `npx http-server`
```bash
npx http-server -p 8085
```

### Option 3: VS Code Live Server
Right-click [`story.html`](./story.html) and select **Open with Live Server**.

---

## 📱 Browser Compatibility & Performance
- **Zero Build Step**: Runs directly in modern browsers without needing Webpack, Vite, or Node compilation.
- **Fully Responsive**: Optimized for viewports ranging from mobile phones (360px+) to 4K desktop screens.
- **Fast Performance**: Lightweight assets, CSS hardware acceleration (`transform: translateZ(0)`), and lazy component rendering.

---

## 📍 Social & Location

- **Brand**: Pizza Stop Alephata
- **Location**: Pune – Nashik Highway, Alephata, Maharashtra, India
- **Instagram**: [@cafe.pizzastop_alephata](https://www.instagram.com/cafe.pizzastop_alephata/)
- **Tagline**: *Good Food. Great Moments. That's Pizza Stop Alephata.*
