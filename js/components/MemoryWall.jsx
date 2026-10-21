// js/components/MemoryWall.jsx - Yellow Accent Section: Camera & Photo Upload (Side-by-Side)
(function () {
  const { useState, useEffect, useRef } = React;

  const DEFAULT_IMAGE = './background/birth.png';
  const DEFAULT_CAPTION = 'Making delicious memories at Pizza Stop! 🍕💛';

  window.MemoryWall = function MemoryWall() {
    const [currentImage, setCurrentImage] = useState(DEFAULT_IMAGE);
    const [caption, setCaption] = useState(DEFAULT_CAPTION);
    const [dateStamp, setDateStamp] = useState('Today');
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [facingMode, setFacingMode] = useState('user');
    const [canFlipCamera, setCanFlipCamera] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);
    const [hasUploadedPhoto, setHasUploadedPhoto] = useState(false);
    const [uploadedMoments, setUploadedMoments] = useState([]);

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
      const now = new Date();
      setDateStamp(
        now.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      );
    }, []);

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    };

    const startCamera = async (targetFacing = facingMode) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (cameraInputRef.current) cameraInputRef.current.click();
        return;
      }

      try {
        stopCamera();
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: targetFacing,
            width: { ideal: 1280 },
            height: { ideal: 960 }
          },
          audio: false
        });

        streamRef.current = stream;
        setIsCameraActive(true);

        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        }, 50);

        if (navigator.mediaDevices.enumerateDevices) {
          navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoInputs = devices.filter((d) => d.kind === 'videoinput');
            setCanFlipCamera(videoInputs.length > 1);
          }).catch(() => {});
        }
      } catch (err) {
        console.warn('Webcam stream unavailable, falling back to camera input:', err);
        if (cameraInputRef.current) {
          cameraInputRef.current.click();
        } else {
          alert('Could not open camera stream. Please use the Upload Photo option.');
        }
      }
    };

    const flipCamera = () => {
      const nextFacing = facingMode === 'user' ? 'environment' : 'user';
      setFacingMode(nextFacing);
      startCamera(nextFacing);
    };

    const takeSnapshot = () => {
      const video = videoRef.current;
      if (!video || !video.videoWidth) return;

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

      stopCamera();
      applyNewPhoto(dataUrl);
    };

    const applyNewPhoto = (dataUrl) => {
      setCurrentImage(dataUrl);
      setHasUploadedPhoto(true);
      setUploadedMoments((prev) => {
        if (prev.includes(dataUrl)) return prev;
        return [dataUrl, ...prev.slice(0, 5)];
      });
    };

    const handleFile = (file) => {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        applyNewPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragActive(false);
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    };

    const resetToDefault = () => {
      stopCamera();
      setCurrentImage(DEFAULT_IMAGE);
      setCaption(DEFAULT_CAPTION);
      setHasUploadedPhoto(false);
    };

    // Canvas PNG Export for downloading the keepsake
    const downloadKeepsake = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const cardW = 900;
      const cardH = 1140;
      canvas.width = cardW;
      canvas.height = cardH;

      // 1. White Polaroid Background & Outer Border
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, cardW, cardH);
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

        ctx.save();
        ctx.beginPath();
        ctx.rect(photoX, photoY, photoSize, photoSize);
        ctx.clip();

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
        const captionText = caption.trim() || DEFAULT_CAPTION;
        ctx.fillStyle = '#1C1917';
        ctx.font = 'italic 600 32px "Playfair Display", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(captionText, cardW / 2, 930);

        // 5. Footer Details
        ctx.fillStyle = '#64748B';
        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('📍 Pizza Stop Alephata • Pune - Nashik Hwy', 50, 1060);

        ctx.textAlign = 'right';
        ctx.fillText(dateStamp, cardW - 50, 1060);

        try {
          const dlUrl = canvas.toDataURL('image/png');
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

      photoImg.src = currentImage;
    };

    return (
      <section className="story-values-section" id="our-values" aria-label="Cafe Photo Wall and Camera">
        <div className="container story-moment-grid">

          {/* Left Column: Narrative & Upload Controls */}
          <div className="moment-info-box">
            <div className="section-label-eyebrow moment-eyebrow">
              <i className="fas fa-camera-retro"></i>
              <span>Pizza Stop Memory Wall</span>
            </div>

            <h2 className="moment-heading">
              Capture &amp; Share <span>Your Cafe Moment.</span>
            </h2>

            <p className="moment-lead-text">
              Enjoying good food and cozy vibes along the highway? Snap a live selfie with your camera or upload your
              favorite cafe clicks to craft your custom keepsake!
            </p>

            {/* Action Buttons */}
            <div className="moment-action-grid">
              <button
                type="button"
                className="moment-cta-btn btn-camera-trigger"
                id="btnOpenCamera"
                aria-label="Open Camera to Take Photo"
                onClick={() => startCamera()}
              >
                <div className="moment-cta-icon-wrapper">
                  <i className="fas fa-camera"></i>
                </div>
                <div className="moment-cta-text">
                  <span className="cta-title">Open Camera</span>
                  <span className="cta-desc">Take a live photo right now</span>
                </div>
              </button>

              <button
                type="button"
                className="moment-cta-btn btn-upload-trigger"
                id="btnUploadPhoto"
                aria-label="Upload Photo from Device"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <div className="moment-cta-icon-wrapper">
                  <i className="fas fa-cloud-arrow-up"></i>
                </div>
                <div className="moment-cta-text">
                  <span className="cta-title">Upload Photo</span>
                  <span className="cta-desc">Choose from your gallery or files</span>
                </div>
              </button>
            </div>

            {/* Drag & Drop Zone */}
            <div
              className={`moment-drop-zone ${isDragActive ? 'drag-active' : ''}`}
              id="momentDropZone"
              tabIndex="0"
              role="button"
              aria-label="Drag and drop photo here or click to select"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
            >
              <i className="fas fa-images drop-icon"></i>
              <div className="drop-text-group">
                <span className="drop-primary-text">Or drag and drop your photo here</span>
                <span className="drop-secondary-text">Supports JPG, PNG, WEBP, GIF (up to 15MB)</span>
              </div>
            </div>

            {/* Hidden File Inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              id="momentCameraInput"
              accept="image/*"
              capture="user"
              style={{ display: 'none' }}
              aria-hidden="true"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />
            <input
              ref={fileInputRef}
              type="file"
              id="momentFileInput"
              accept="image/*"
              style={{ display: 'none' }}
              aria-hidden="true"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />

            {/* Action & Caption Bar (appears when custom photo is active) */}
            {hasUploadedPhoto && (
              <div className="moment-active-toolbar" id="momentActiveToolbar">
                <div className="moment-caption-input-group">
                  <label htmlFor="polaroidCaptionInput" className="moment-caption-label">
                    <i className="fas fa-pen"></i> Memory Caption:
                  </label>
                  <div className="moment-caption-field-wrapper">
                    <input
                      type="text"
                      id="polaroidCaptionInput"
                      className="moment-caption-input-field"
                      value={caption}
                      maxLength="60"
                      placeholder="Type a memory caption..."
                      aria-label="Memory Caption"
                      onChange={(e) => setCaption(e.target.value)}
                    />
                  </div>
                </div>

                <div className="moment-result-actions">
                  <button
                    type="button"
                    className="result-action-btn btn-download-memory"
                    id="btnDownloadMemory"
                    aria-label="Download Polaroid Memory"
                    onClick={downloadKeepsake}
                  >
                    <i className="fas fa-download"></i> Download Keepsake
                  </button>
                  <button
                    type="button"
                    className="result-action-btn btn-retake-memory"
                    id="btnRetakePhoto"
                    aria-label="Take Another Photo"
                    onClick={() => startCamera()}
                  >
                    <i className="fas fa-camera"></i> Camera
                  </button>
                  <button
                    type="button"
                    className="result-action-btn btn-new-upload"
                    id="btnUploadAnother"
                    aria-label="Upload Another Photo"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    <i className="fas fa-cloud-arrow-up"></i> Upload New
                  </button>
                  <button
                    type="button"
                    className="result-action-btn btn-remove-memory"
                    id="btnRemovePhoto"
                    aria-label="Reset and Clear Photo"
                    onClick={resetToDefault}
                  >
                    <i className="fas fa-trash-can"></i> Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Photo Display & Live Camera Viewfinder */}
          <div className="moment-showcase-col">

            {/* Live Camera Viewfinder */}
            {isCameraActive && (
              <div className="camera-viewfinder-box" id="momentCameraView">
                <video ref={videoRef} id="momentCameraVideo" autoPlay playsInline muted></video>

                <div className="viewfinder-overlay">
                  <div className="viewfinder-reticle top-left"></div>
                  <div className="viewfinder-reticle top-right"></div>
                  <div className="viewfinder-reticle bottom-left"></div>
                  <div className="viewfinder-reticle bottom-right"></div>
                  <span className="viewfinder-live-badge">
                    <span className="live-dot"></span> LIVE CAMERA
                  </span>
                  <span className="viewfinder-hint">Say Cheese! 🍕</span>
                </div>

                <div className="camera-controls-toolbar">
                  <button
                    type="button"
                    className="camera-btn-secondary"
                    id="btnCloseCamera"
                    aria-label="Cancel Camera"
                    onClick={stopCamera}
                  >
                    <i className="fas fa-arrow-left"></i> Cancel
                  </button>

                  <button
                    type="button"
                    className="camera-shutter-btn"
                    id="btnCaptureShutter"
                    aria-label="Capture Photo"
                    title="Snap Photo"
                    onClick={takeSnapshot}
                  >
                    <div className="shutter-inner-circle">
                      <i className="fas fa-camera"></i>
                    </div>
                  </button>

                  {canFlipCamera && (
                    <button
                      type="button"
                      className="camera-btn-secondary"
                      id="btnSwitchCamera"
                      aria-label="Switch Camera"
                      onClick={flipCamera}
                    >
                      <i className="fas fa-camera-rotate"></i> Flip
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Polaroid Keepsake Card */}
            {!isCameraActive && (
              <div className="polaroid-wrapper" id="polaroidWrapper">
                <div className="polaroid-card" id="polaroidKeepsake">
                  <div className="polaroid-sticker">
                    <i className="fab fa-instagram"></i> @cafe.pizzastop_alephata
                  </div>

                  <div className="polaroid-photo-frame">
                    <img id="polaroidPreviewImg" src={currentImage} alt="Your Pizza Stop Memory Preview" />
                  </div>

                  <div className="polaroid-caption-area">
                    <div className="polaroid-caption-text" id="polaroidCaptionDisplay">
                      {caption || DEFAULT_CAPTION}
                    </div>

                    <div className="polaroid-footer-meta">
                      <span className="meta-location">
                        <i className="fas fa-location-dot"></i> Alephata, Pune-Nashik Hwy
                      </span>
                      <span className="meta-date" id="polaroidDateStamp">
                        {dateStamp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Uploaded Moments Reel on this side */}
            {uploadedMoments.length > 0 && !isCameraActive && (
              <div className="moment-uploaded-strip" id="momentUploadedStrip">
                <div className="uploaded-strip-header">
                  <span>
                    <i className="fas fa-photo-film"></i> Uploaded Moments
                  </span>
                </div>
                <div className="uploaded-thumbs-list" id="uploadedThumbsList">
                  {uploadedMoments.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`uploaded-thumb-item ${currentImage === imgUrl ? 'active' : ''}`}
                      onClick={() => setCurrentImage(imgUrl)}
                    >
                      <img src={imgUrl} alt={`Moment ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden Canvas for Memory Card Export */}
            <canvas ref={canvasRef} id="momentExportCanvas" style={{ display: 'none' }}></canvas>
          </div>

        </div>
      </section>
    );
  };
})();
