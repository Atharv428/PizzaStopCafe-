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

  // 3. Cafe Video Player Interaction (Strictly controlled via Play/Pause button)
  const cafeVideo = document.getElementById('cafeStoryVideo');
  const videoFrame = document.querySelector('.video-phone-frame');
  const btnPlay = document.getElementById('btnVideoPlay');
  const btnSound = document.getElementById('btnVideoSound');
  const instaBadge = document.querySelector('.video-overlay-badge');

  if (cafeVideo && videoFrame) {
    const togglePlay = () => {
      if (cafeVideo.paused) {
        cafeVideo.play().then(() => {
          videoFrame.classList.add('is-playing');
          if (btnPlay) {
            btnPlay.innerHTML = '<i class="fas fa-pause"></i>';
            btnPlay.setAttribute('aria-label', 'Pause Cafe Video');
            btnPlay.setAttribute('title', 'Pause Video');
          }
        }).catch(() => {});
      } else {
        cafeVideo.pause();
        videoFrame.classList.remove('is-playing');
        videoFrame.classList.remove('show-controls');
        if (btnPlay) {
          btnPlay.innerHTML = '<i class="fas fa-play"></i>';
          btnPlay.setAttribute('aria-label', 'Play Cafe Video');
          btnPlay.setAttribute('title', 'Play Video');
        }
      }
    };

    // Only the play/pause button controls play & pause
    if (btnPlay) {
      btnPlay.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
      });
    }

    // Instagram badge click propagation prevention
    if (instaBadge) {
      instaBadge.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Clicking anywhere on the video frame does NOT play/pause.
    // If playing, it reveals the controls/pause button temporarily (e.g. for touch/mobile).
    let hideControlsTimeout = null;
    videoFrame.addEventListener('click', (e) => {
      if (!cafeVideo.paused) {
        videoFrame.classList.add('show-controls');
        clearTimeout(hideControlsTimeout);
        hideControlsTimeout = setTimeout(() => {
          videoFrame.classList.remove('show-controls');
        }, 3000);
      }
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

  // 4. Memory Wall Camera & Photo Upload Feature (Side-by-Side Layout)
  const btnOpenCamera = document.getElementById('btnOpenCamera');
  const btnUploadPhoto = document.getElementById('btnUploadPhoto');
  const momentDropZone = document.getElementById('momentDropZone');
  const momentCameraInput = document.getElementById('momentCameraInput');
  const momentFileInput = document.getElementById('momentFileInput');

  const momentCameraView = document.getElementById('momentCameraView');
  const momentCameraVideo = document.getElementById('momentCameraVideo');
  const btnCaptureShutter = document.getElementById('btnCaptureShutter');
  const btnCloseCamera = document.getElementById('btnCloseCamera');
  const btnSwitchCamera = document.getElementById('btnSwitchCamera');

  const polaroidWrapper = document.getElementById('polaroidWrapper');
  const polaroidPreviewImg = document.getElementById('polaroidPreviewImg');
  const polaroidCaptionInput = document.getElementById('polaroidCaptionInput');
  const polaroidCaptionDisplay = document.getElementById('polaroidCaptionDisplay');
  const polaroidDateStamp = document.getElementById('polaroidDateStamp');
  const momentActiveToolbar = document.getElementById('momentActiveToolbar');
  const momentUploadedStrip = document.getElementById('momentUploadedStrip');
  const uploadedThumbsList = document.getElementById('uploadedThumbsList');

  const btnDownloadMemory = document.getElementById('btnDownloadMemory');
  const btnRetakePhoto = document.getElementById('btnRetakePhoto');
  const btnUploadAnother = document.getElementById('btnUploadAnother');
  const btnRemovePhoto = document.getElementById('btnRemovePhoto');
  const momentExportCanvas = document.getElementById('momentExportCanvas');

  let activeCameraStream = null;
  let currentFacingMode = 'user';
  const uploadedMomentsHistory = [];

  function stopCameraStream() {
    if (activeCameraStream) {
      activeCameraStream.getTracks().forEach((track) => track.stop());
      activeCameraStream = null;
    }
    if (momentCameraVideo) {
      momentCameraVideo.srcObject = null;
    }
    if (momentCameraView) {
      momentCameraView.classList.add('is-hidden');
    }
    if (polaroidWrapper) {
      polaroidWrapper.style.display = 'flex';
    }
  }

  async function openLiveCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (momentCameraInput) momentCameraInput.click();
      return;
    }

    try {
      stopCameraStream();
      const constraints = {
        video: {
          facingMode: currentFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      };

      activeCameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (momentCameraVideo) {
        momentCameraVideo.srcObject = activeCameraStream;
        momentCameraVideo.onloadedmetadata = () => {
          momentCameraVideo.play().catch(() => {});
        };
      }

      if (polaroidWrapper) {
        polaroidWrapper.style.display = 'none';
      }
      if (momentCameraView) {
        momentCameraView.classList.remove('is-hidden');
      }

      // Check if multiple cameras are available (e.g. front and rear on mobile)
      if (navigator.mediaDevices.enumerateDevices && btnSwitchCamera) {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          const videoDevices = devices.filter((d) => d.kind === 'videoinput');
          btnSwitchCamera.style.display = videoDevices.length > 1 ? 'inline-flex' : 'none';
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('Direct webcam access not available, falling back to device file/camera input:', err);
      if (momentCameraInput) {
        momentCameraInput.click();
      } else {
        alert('Could not start camera stream. Please use the Upload Photo option.');
      }
    }
  }

  function addUploadedThumbnail(dataUrl) {
    if (!uploadedMomentsHistory.includes(dataUrl)) {
      uploadedMomentsHistory.unshift(dataUrl);
    }
    if (momentUploadedStrip && uploadedThumbsList) {
      momentUploadedStrip.style.display = 'block';
      uploadedThumbsList.innerHTML = '';
      uploadedMomentsHistory.slice(0, 6).forEach((url, idx) => {
        const thumb = document.createElement('div');
        thumb.className = 'uploaded-thumb-item' + (idx === 0 ? ' active' : '');
        thumb.innerHTML = `<img src="${url}" alt="Moment ${idx + 1}">`;
        thumb.addEventListener('click', () => {
          if (polaroidPreviewImg) polaroidPreviewImg.src = url;
          document.querySelectorAll('.uploaded-thumb-item').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
        uploadedThumbsList.appendChild(thumb);
      });
    }
  }

  function renderPolaroid(dataUrl) {
    if (polaroidPreviewImg) {
      polaroidPreviewImg.src = dataUrl;
    }
    if (polaroidDateStamp) {
      const now = new Date();
      polaroidDateStamp.textContent = now.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
    if (momentActiveToolbar) {
      momentActiveToolbar.style.display = 'block';
    }
    addUploadedThumbnail(dataUrl);
    stopCameraStream();
  }

  function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      renderPolaroid(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function captureSnapshot() {
    if (!momentCameraVideo || !momentCameraVideo.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = momentCameraVideo.videoWidth;
    canvas.height = momentCameraVideo.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(momentCameraVideo, 0, 0, canvas.width, canvas.height);
    const snapData = canvas.toDataURL('image/jpeg', 0.92);
    renderPolaroid(snapData);
  }

  // Live Sync of Caption between Input and Polaroid Card
  if (polaroidCaptionInput && polaroidCaptionDisplay) {
    polaroidCaptionInput.addEventListener('input', () => {
      const val = polaroidCaptionInput.value.trim();
      polaroidCaptionDisplay.textContent = val || 'Making delicious memories at Pizza Stop! 🍕💛';
    });
  }

  // Triggers
  if (btnOpenCamera) {
    btnOpenCamera.addEventListener('click', (e) => {
      e.preventDefault();
      openLiveCamera();
    });
  }

  if (btnUploadPhoto) {
    btnUploadPhoto.addEventListener('click', (e) => {
      e.preventDefault();
      if (momentFileInput) momentFileInput.click();
    });
  }

  if (momentDropZone) {
    momentDropZone.addEventListener('click', () => {
      if (momentFileInput) momentFileInput.click();
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
      momentDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        momentDropZone.classList.add('drag-active');
      });
    });

    ['dragleave', 'dragend'].forEach((eventName) => {
      momentDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        momentDropZone.classList.remove('drag-active');
      });
    });

    momentDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      momentDropZone.classList.remove('drag-active');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleImageFile(e.dataTransfer.files[0]);
      }
    });
  }

  if (momentFileInput) {
    momentFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleImageFile(e.target.files[0]);
        e.target.value = '';
      }
    });
  }

  if (momentCameraInput) {
    momentCameraInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleImageFile(e.target.files[0]);
        e.target.value = '';
      }
    });
  }

  // Camera toolbar listeners
  if (btnCaptureShutter) {
    btnCaptureShutter.addEventListener('click', () => {
      captureSnapshot();
    });
  }

  if (btnCloseCamera) {
    btnCloseCamera.addEventListener('click', () => {
      stopCameraStream();
    });
  }

  if (btnSwitchCamera) {
    btnSwitchCamera.addEventListener('click', () => {
      currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
      openLiveCamera();
    });
  }

  // Polaroid Result Toolbar
  if (btnRetakePhoto) {
    btnRetakePhoto.addEventListener('click', () => {
      openLiveCamera();
    });
  }

  if (btnUploadAnother) {
    btnUploadAnother.addEventListener('click', () => {
      if (momentFileInput) momentFileInput.click();
    });
  }

  if (btnRemovePhoto) {
    btnRemovePhoto.addEventListener('click', () => {
      if (polaroidPreviewImg) polaroidPreviewImg.src = './background/birth.png';
      if (polaroidCaptionInput) polaroidCaptionInput.value = 'Making delicious memories at Pizza Stop! 🍕💛';
      if (polaroidCaptionDisplay) polaroidCaptionDisplay.textContent = 'Making delicious memories at Pizza Stop! 🍕💛';
      stopCameraStream();
    });
  }

  // Export & Download High-Quality Polaroid Canvas
  if (btnDownloadMemory) {
    btnDownloadMemory.addEventListener('click', () => {
      if (!polaroidPreviewImg || !polaroidPreviewImg.src) return;

      const exportCanvas = momentExportCanvas || document.createElement('canvas');
      const ctx = exportCanvas.getContext('2d');
      const cardW = 900;
      const cardH = 1140;
      exportCanvas.width = cardW;
      exportCanvas.height = cardH;

      // 1. White Polaroid Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, cardW, cardH);

      // Subtle Outer Border
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, cardW - 4, cardH - 4);

      // 2. Draw Image (Square frame: 800 x 800)
      const photoImg = new Image();
      photoImg.crossOrigin = 'anonymous';
      photoImg.onload = () => {
        const photoX = 50;
        const photoY = 50;
        const photoSize = 800;

        // Clip & Cover image in square
        ctx.save();
        ctx.beginPath();
        ctx.rect(photoX, photoY, photoSize, photoSize);
        ctx.clip();

        // Calculate aspect fill
        let srcX = 0, srcY = 0, srcW = photoImg.naturalWidth, srcH = photoImg.naturalHeight;
        if (srcW > srcH) {
          srcX = (srcW - srcH) / 2;
          srcW = srcH;
        } else {
          srcY = (srcH - srcW) / 2;
          srcH = srcW;
        }
        ctx.drawImage(photoImg, srcX, srcY, srcW, srcH, photoX, photoY, photoSize, photoSize);
        ctx.restore();

        // 3. Instagram Sticker Badge on Top Right
        ctx.save();
        ctx.translate(photoX + photoSize - 160, 75);
        ctx.rotate((3 * Math.PI) / 180);
        ctx.fillStyle = '#FEF08A';
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 2.5;

        // Rounded pill
        const pillW = 210, pillH = 40, pillR = 20;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(-pillW / 2, -pillH / 2, pillW, pillH, pillR);
        } else {
          ctx.rect(-pillW / 2, -pillH / 2, pillW, pillH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#92400E';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('@cafe.pizzastop_alephata', 0, 1);
        ctx.restore();

        // 4. Memory Caption
        const captionText = (polaroidCaptionInput && polaroidCaptionInput.value.trim()) 
          || 'Making delicious memories at Pizza Stop! 🍕💛';
        ctx.fillStyle = '#1C1917';
        ctx.font = 'italic 600 32px "Playfair Display", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(captionText, cardW / 2, 930);

        // 5. Footer Details
        ctx.fillStyle = '#64748B';
        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('📍 Pizza Stop Alephata • Pune - Nashik Hwy', 50, 1060);

        const dateStr = (polaroidDateStamp && polaroidDateStamp.textContent) || 'Today';
        ctx.textAlign = 'right';
        ctx.fillText(dateStr, cardW - 50, 1060);

        // Download trigger
        try {
          const dlUrl = exportCanvas.toDataURL('image/png');
          const dlLink = document.createElement('a');
          dlLink.download = 'pizzastop-memory.png';
          dlLink.href = dlUrl;
          document.body.appendChild(dlLink);
          dlLink.click();
          document.body.removeChild(dlLink);
        } catch (e) {
          console.error('Failed to export canvas:', e);
        }
      };

      photoImg.src = polaroidPreviewImg.src;
    });
  }

  // Cleanup camera stream if user navigates away
  window.addEventListener('beforeunload', () => {
    stopCameraStream();
  });
});
