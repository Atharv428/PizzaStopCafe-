/**
 * Pizza Stop Alephata - Client-Side Authentication UI & Form Validation
 * Only handles UI interactions and client-side validation between Login and Register.
 * No external authentication services or databases.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Theme Palette Synchronization
  setupThemePalette();

  // 1. Password Visibility Toggles
  setupPasswordToggles();

  // 2. Dynamic Input Icon (Email vs Phone)
  setupIdentityDetection();

  // 3. Showcase Photography Slider
  setupShowcaseSlider();

  // 4. Login Form Validation
  setupLoginForm();

  // 5. Register Form Validation
  setupRegisterForm();

  // 6. Modal Interactions (Forgot Password & Terms)
  setupModals();
});

/**
 * Toggle Password Visibility (Eye Icon)
 */
function setupPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const icon = btn.querySelector('i');
      if (icon) {
        if (isPassword) {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
          btn.setAttribute('aria-label', 'Hide password');
        } else {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
          btn.setAttribute('aria-label', 'Show password');
        }
      }
    });
  });
}

/**
 * Detect Email vs Mobile Number input to update prefix icon dynamically
 */
function setupIdentityDetection() {
  const identityInputs = document.querySelectorAll('input[name="identity"], #login-identity, #register-identity, #forgot-identity');
  identityInputs.forEach(input => {
    const parent = input.closest('.input-container');
    const icon = parent ? parent.querySelector('.input-prefix-icon') : null;
    if (!icon) return;

    input.addEventListener('input', () => {
      let val = input.value;
      // If user starts entering a phone number (digits or +)
      if (/^[\+\d]/.test(val.trim())) {
        let digits = val.replace(/\D/g, '');
        // If user typed 91 prefix with 12 digits, strip to 10 digits
        if (digits.length > 10 && digits.startsWith('91')) {
          digits = digits.slice(2);
        }
        // Restrict strictly to 10 digits limit for Indian mobile numbers
        if (digits.length > 10) {
          digits = digits.slice(0, 10);
        }
        input.value = digits;
        icon.className = 'fas fa-phone-alt input-prefix-icon';
      } else {
        icon.className = 'fas fa-envelope input-prefix-icon';
      }
    });
  });
}

/**
 * Left Panel Image Carousel / Dots
 */
function setupShowcaseSlider() {
  const dots = document.querySelectorAll('.slider-dot');
  const showcaseImg = document.getElementById('showcase-active-img');
  const showcaseHeading = document.getElementById('showcase-heading-text');

  if (!dots.length || !showcaseImg) return;

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      const newImg = dot.getAttribute('data-img');
      const newTitle = dot.getAttribute('data-title');

      if (newImg) {
        showcaseImg.style.opacity = '0.3';
        setTimeout(() => {
          showcaseImg.src = newImg;
          showcaseImg.style.opacity = '1';
        }, 200);
      }

      if (newTitle && showcaseHeading) {
        showcaseHeading.innerHTML = newTitle;
      }
    });
  });
}

/**
 * Helpers for Field Error Handling
 */
function setFieldError(input, hintId, message) {
  input.classList.remove('is-valid');
  input.classList.add('is-invalid');
  const hint = document.getElementById(hintId);
  if (hint) {
    if (message) {
      hint.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    }
    hint.classList.add('active');
  }
}

function clearFieldError(input, hintId) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  const hint = document.getElementById(hintId);
  if (hint) {
    hint.classList.remove('active');
  }
}

function showBanner(type, message) {
  const alertBox = document.getElementById(`auth-${type}-alert`);
  if (!alertBox) return;
  const textEl = alertBox.querySelector('.alert-text') || alertBox;
  textEl.textContent = message;
  alertBox.style.display = 'flex';
}

function hideBanners() {
  const err = document.getElementById('auth-error-alert');
  const succ = document.getElementById('auth-success-alert');
  if (err) err.style.display = 'none';
  if (succ) succ.style.display = 'none';
}

/**
 * Validator Helpers
 */
function isValidEmailOrMobile(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cleanMobile = value.replace(/[\s\-\+]/g, '');
  // Indian mobile: exactly 10 digits starting with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  const indianWith91 = /^91[6-9]\d{9}$/;
  return emailRegex.test(value) || indianMobileRegex.test(cleanMobile) || indianWith91.test(cleanMobile);
}

/**
 * Login Form Handling
 */
function setupLoginForm() {
  const form = document.getElementById('form-login');
  if (!form) return;

  const identityInput = document.getElementById('login-identity');
  const passwordInput = document.getElementById('login-password');
  const submitBtn = document.getElementById('btn-login-submit');

  // Real-time input clearing
  if (identityInput) {
    identityInput.addEventListener('input', () => {
      if (identityInput.classList.contains('is-invalid')) {
        if (isValidEmailOrMobile(identityInput.value.trim())) {
          clearFieldError(identityInput, 'login-identity-hint');
        }
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      if (passwordInput.classList.contains('is-invalid')) {
        if (passwordInput.value.length > 0) {
          clearFieldError(passwordInput, 'login-password-hint');
        }
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideBanners();

    let isValid = true;
    const identityVal = identityInput.value.trim();
    const passwordVal = passwordInput.value;

    // Validate Identity
    if (!identityVal) {
      setFieldError(identityInput, 'login-identity-hint', 'Please enter your email or 10-digit Indian mobile number.');
      isValid = false;
    } else if (!isValidEmailOrMobile(identityVal)) {
      if (/^\d+$/.test(identityVal)) {
        setFieldError(identityInput, 'login-identity-hint', 'Please enter a valid 10-digit Indian mobile number.');
      } else {
        setFieldError(identityInput, 'login-identity-hint', 'Please enter a valid email or 10-digit Indian mobile number.');
      }
      isValid = false;
    } else {
      clearFieldError(identityInput, 'login-identity-hint');
    }

    // Validate Password
    if (!passwordVal) {
      setFieldError(passwordInput, 'login-password-hint', 'Please enter your password.');
      isValid = false;
    } else if (passwordVal.length < 6) {
      setFieldError(passwordInput, 'login-password-hint', 'Password must be at least 6 characters.');
      isValid = false;
    } else {
      clearFieldError(passwordInput, 'login-password-hint');
    }

    if (!isValid) {
      form.classList.remove('shake');
      void form.offsetWidth; // Trigger reflow
      form.classList.add('shake');
      showBanner('error', 'Please resolve the highlighted fields to sign in.');
      return;
    }

    // Simulate login interaction
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      showBanner('success', 'Welcome back, Food Lover! You are successfully signed in.');
    }, 800);
  });

  // Social Login Mock Handlers
  const googleBtn = document.getElementById('btn-google-login');
  const facebookBtn = document.getElementById('btn-facebook-login');

  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      googleBtn.style.opacity = '0.7';
      const label = googleBtn.querySelector('span');
      if (label) label.textContent = 'Connecting with Google...';
      setTimeout(() => {
        googleBtn.style.opacity = '1';
        if (label) label.textContent = 'Continue with Google';
      }, 700);
    });
  }

  if (facebookBtn) {
    facebookBtn.addEventListener('click', () => {
      facebookBtn.style.opacity = '0.7';
      const label = facebookBtn.querySelector('span');
      if (label) label.textContent = 'Connecting with Facebook...';
      setTimeout(() => {
        facebookBtn.style.opacity = '1';
        if (label) label.textContent = 'Continue with Facebook';
      }, 700);
    });
  }
}

/**
 * Register Form Handling & Password Strength
 */
function setupRegisterForm() {
  const form = document.getElementById('form-register');
  if (!form) return;

  const nameInput = document.getElementById('register-fullname');
  const identityInput = document.getElementById('register-identity');
  const passwordInput = document.getElementById('register-password');
  const confirmInput = document.getElementById('register-confirm-password');
  const termsCheckbox = document.getElementById('register-terms');
  const submitBtn = document.getElementById('btn-register-submit');

  // Password Strength Checklist & Bar
  if (passwordInput) {
    const strengthFill = document.getElementById('strength-fill');
    const chkLen = document.getElementById('chk-len');
    const chkUpper = document.getElementById('chk-upper');
    const chkNum = document.getElementById('chk-number');
    const chkSpec = document.getElementById('chk-special');

    passwordInput.addEventListener('input', () => {
      const val = passwordInput.value;
      const hasLen = val.length >= 8;
      const hasUpper = /[A-Z]/.test(val);
      const hasNum = /[0-9]/.test(val);
      const hasSpec = /[^A-Za-z0-9]/.test(val);

      updateCheckItem(chkLen, hasLen);
      updateCheckItem(chkUpper, hasUpper);
      updateCheckItem(chkNum, hasNum);
      updateCheckItem(chkSpec, hasSpec);

      let score = 0;
      if (hasLen) score++;
      if (hasUpper) score++;
      if (hasNum) score++;
      if (hasSpec) score++;

      if (strengthFill) {
        if (val.length === 0) {
          strengthFill.style.width = '0%';
          strengthFill.style.backgroundColor = 'transparent';
        } else if (score <= 1) {
          strengthFill.style.width = '25%';
          strengthFill.style.backgroundColor = '#ef4444';
        } else if (score === 2) {
          strengthFill.style.width = '50%';
          strengthFill.style.backgroundColor = '#f59e0b';
        } else if (score === 3) {
          strengthFill.style.width = '75%';
          strengthFill.style.backgroundColor = '#A7C957';
        } else {
          strengthFill.style.width = '100%';
          strengthFill.style.backgroundColor = '#10b981';
        }
      }

      // Check confirm password if already typed
      if (confirmInput && confirmInput.value) {
        if (confirmInput.value !== val) {
          setFieldError(confirmInput, 'register-confirm-hint', 'Passwords do not match.');
        } else {
          clearFieldError(confirmInput, 'register-confirm-hint');
        }
      }
    });
  }

  function updateCheckItem(el, isValid) {
    if (!el) return;
    const icon = el.querySelector('i');
    if (isValid) {
      el.classList.add('valid');
      if (icon) {
        icon.className = 'fas fa-check-circle';
      }
    } else {
      el.classList.remove('valid');
      if (icon) {
        icon.className = 'far fa-circle';
      }
    }
  }

  // Real-time Confirm Password check
  if (confirmInput && passwordInput) {
    confirmInput.addEventListener('input', () => {
      if (confirmInput.value === passwordInput.value) {
        clearFieldError(confirmInput, 'register-confirm-hint');
      } else if (confirmInput.classList.contains('is-invalid')) {
        setFieldError(confirmInput, 'register-confirm-hint', 'Passwords do not match.');
      }
    });
  }

  // Real-time Terms check
  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => {
      if (termsCheckbox.checked) {
        const hint = document.getElementById('register-terms-hint');
        if (hint) hint.classList.remove('active');
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideBanners();

    let isValid = true;
    const nameVal = nameInput ? nameInput.value.trim() : '';
    const identityVal = identityInput ? identityInput.value.trim() : '';
    const passwordVal = passwordInput ? passwordInput.value : '';
    const confirmVal = confirmInput ? confirmInput.value : '';
    const termsChecked = termsCheckbox ? termsCheckbox.checked : true;

    // 1. Full Name
    if (!nameVal || nameVal.length < 2) {
      setFieldError(nameInput, 'register-fullname-hint', 'Please enter your full name (at least 2 letters).');
      isValid = false;
    } else {
      clearFieldError(nameInput, 'register-fullname-hint');
    }

    // 2. Email or Mobile
    if (!identityVal) {
      setFieldError(identityInput, 'register-identity-hint', 'Please enter your email or 10-digit Indian mobile number.');
      isValid = false;
    } else if (!isValidEmailOrMobile(identityVal)) {
      if (/^\d+$/.test(identityVal)) {
        setFieldError(identityInput, 'register-identity-hint', 'Please enter a valid 10-digit Indian mobile number.');
      } else {
        setFieldError(identityInput, 'register-identity-hint', 'Please enter a valid email or 10-digit Indian mobile number.');
      }
      isValid = false;
    } else {
      clearFieldError(identityInput, 'register-identity-hint');
    }

    // 3. Password
    if (!passwordVal || passwordVal.length < 8) {
      setFieldError(passwordInput, 'register-password-hint', 'Password must be at least 8 characters long.');
      isValid = false;
    } else {
      clearFieldError(passwordInput, 'register-password-hint');
    }

    // 4. Confirm Password Match
    if (!confirmVal) {
      setFieldError(confirmInput, 'register-confirm-hint', 'Please re-enter your password to confirm.');
      isValid = false;
    } else if (confirmVal !== passwordVal) {
      setFieldError(confirmInput, 'register-confirm-hint', 'Passwords do not match. Please recheck.');
      isValid = false;
    } else {
      clearFieldError(confirmInput, 'register-confirm-hint');
    }

    // 5. Terms & Conditions Checkbox
    if (!termsChecked) {
      const hint = document.getElementById('register-terms-hint');
      if (hint) hint.classList.add('active');
      isValid = false;
    } else {
      const hint = document.getElementById('register-terms-hint');
      if (hint) hint.classList.remove('active');
    }

    if (!isValid) {
      form.classList.remove('shake');
      void form.offsetWidth;
      form.classList.add('shake');
      showBanner('error', 'Please complete all required fields correctly to create your account.');
      return;
    }

    // Simulated Account Creation
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      showBanner('success', 'Your Pizza Stop Alephata account has been created successfully! You can now sign in.');
      
      // Auto-focus on link to login after 1.5s
      setTimeout(() => {
        const toLogin = document.getElementById('link-goto-login');
        if (toLogin) toLogin.focus();
      }, 1500);
    }, 900);
  });
}

/**
 * Modals Handling: Forgot Password & Terms
 */
function setupModals() {
  // Forgot Password Modal
  const forgotLink = document.getElementById('link-forgot-password');
  const forgotModal = document.getElementById('modal-forgot-password');
  const forgotClose = document.getElementById('btn-close-forgot');
  const forgotForm = document.getElementById('form-forgot-password');
  const forgotFeedback = document.getElementById('forgot-feedback-alert');

  if (forgotLink && forgotModal) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      forgotModal.classList.add('open');
      if (forgotFeedback) forgotFeedback.style.display = 'none';
    });
  }

  if (forgotClose && forgotModal) {
    forgotClose.addEventListener('click', () => {
      forgotModal.classList.remove('open');
    });
  }

  if (forgotForm && forgotModal) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('forgot-identity');
      const val = input ? input.value.trim() : '';

      if (!val || !isValidEmailOrMobile(val)) {
        if (forgotFeedback) {
          forgotFeedback.className = 'auth-banner-alert error';
          forgotFeedback.textContent = 'Please enter a valid registered email or mobile number.';
          forgotFeedback.style.display = 'flex';
        }
        return;
      }

      if (forgotFeedback) {
        forgotFeedback.className = 'auth-banner-alert success';
        forgotFeedback.textContent = `Password reset instructions sent to ${val}.`;
        forgotFeedback.style.display = 'flex';
      }

      setTimeout(() => {
        forgotModal.classList.remove('open');
      }, 2000);
    });
  }

  // Terms & Conditions Modal
  const termsLink = document.getElementById('link-terms-modal');
  const termsModal = document.getElementById('modal-terms');
  const termsClose = document.getElementById('btn-close-terms');

  if (termsLink && termsModal) {
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      termsModal.classList.add('open');
    });
  }

  if (termsClose && termsModal) {
    termsClose.addEventListener('click', () => {
      termsModal.classList.remove('open');
    });
  }

  // Close modals on clicking backdrop
  [forgotModal, termsModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    }
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (forgotModal) forgotModal.classList.remove('open');
      if (termsModal) termsModal.classList.remove('open');
    }
  });
}

/**
 * Setup Theme Palette Switcher & Synchronization with story.html
 */
function setupThemePalette() {
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

  // Apply saved theme immediately
  const savedTheme = localStorage.getItem('pizzastop_theme');
  const initialTheme = validThemes.includes(savedTheme) ? savedTheme : 'cyan-purple';
  applyTheme(initialTheme);

  if (themePickerBtn && themePicker) {
    themePickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themePicker.classList.toggle('open');
    });

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

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      if (themeKey === 'cyan-purple') metaTheme.content = '#11101C';
      else if (themeKey === 'orange-cream') metaTheme.content = '#301044';
      else if (themeKey === 'lime-violet') metaTheme.content = '#101010';
    }
  }

  // Cross-tab real-time sync with story page
  window.addEventListener('storage', (e) => {
    if (e.key === 'pizzastop_theme' && e.newValue) {
      applyTheme(e.newValue);
    }
  });
}

