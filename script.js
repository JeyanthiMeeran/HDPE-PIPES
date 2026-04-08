/**
 * Mangalam HDPE Pipes – Product Page JavaScript
 * Handles:
 *  1. Sticky header (appears after scrolling past hero, hides on scroll up)
 *  2. Image carousel with thumbnail sync
 *  3. Zoom-on-hover for carousel images
 *  4. FAQ accordion
 *  5. Manufacturing process tabs
 *  6. Applications carousel (horizontal scroll with nav buttons)
 *  7. Mobile hamburger menu
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════════════════════
     1. STICKY HEADER
     Shows when user scrolls past the hero section (first fold),
     hides when scrolling back up toward top.
     ══════════════════════════════════════════════════════════ */
  const stickyHeader = document.getElementById('stickyHeader');
  const heroSection  = document.getElementById('heroSection');
  let lastScrollY    = 0;
  let ticking        = false;

  function updateStickyHeader() {
    const heroBottom  = heroSection.getBoundingClientRect().bottom + window.scrollY;
    const currentY    = window.scrollY;
    const scrollingUp = currentY < lastScrollY;

    if (currentY > heroBottom) {
      // Past first fold
      if (scrollingUp) {
        // Scrolling up → show header
        stickyHeader.classList.add('visible');
      } else {
        // Scrolling down → show header (it stays until back near top)
        stickyHeader.classList.add('visible');
      }
    } else {
      // Within first fold → hide header
      stickyHeader.classList.remove('visible');
    }

    lastScrollY = currentY;
    ticking     = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateStickyHeader);
      ticking = true;
    }
  }, { passive: true });

  /* ══════════════════════════════════════════════════════════
     2. IMAGE CAROUSEL
     ══════════════════════════════════════════════════════════ */
  const slides      = Array.from(document.querySelectorAll('.carousel-slide'));
  const thumbs      = Array.from(document.querySelectorAll('.thumb'));
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');
  let currentIndex  = 0;
  let autoPlayTimer = null;

  /** Activate a specific slide by index */
  function goToSlide(index) {
    // Wrap around
    if (index < 0)             index = slides.length - 1;
    if (index >= slides.length) index = 0;

    // Deactivate current
    slides[currentIndex].classList.remove('active');
    thumbs[currentIndex].classList.remove('active');

    // Activate new
    currentIndex = index;
    slides[currentIndex].classList.add('active');
    thumbs[currentIndex].classList.add('active');
  }

  // Arrow buttons
  prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
    resetAutoPlay();
  });
  nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
    resetAutoPlay();
  });

  // Thumbnail clicks
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      goToSlide(parseInt(thumb.dataset.index, 10));
      resetAutoPlay();
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goToSlide(currentIndex - 1); resetAutoPlay(); }
    if (e.key === 'ArrowRight') { goToSlide(currentIndex + 1); resetAutoPlay(); }
  });

  // Auto-play every 4s
  function startAutoPlay() {
    autoPlayTimer = setInterval(() => goToSlide(currentIndex + 1), 4000);
  }
  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }
  startAutoPlay();

  /* ══════════════════════════════════════════════════════════
     3. CAROUSEL IMAGE ZOOM ON HOVER
     Shows a zoomed overlay panel positioned to the side.
     The zoom origin updates dynamically based on mouse position
     within the image to provide a magnifying-glass effect.
     ══════════════════════════════════════════════════════════ */
  const carouselMain = document.querySelector('.carousel-main');
  const zoomOverlay  = document.getElementById('zoomOverlay');
  const zoomImg      = document.getElementById('zoomImg');
  let zoomHideTimer  = null;

  carouselMain.addEventListener('mousemove', (e) => {
    const activeSlide = slides[currentIndex];
    const img         = activeSlide.querySelector('img');
    if (!img) return;

    const rect = carouselMain.getBoundingClientRect();

    // Normalised mouse position (0–1) within the carousel
    const relX = (e.clientX - rect.left)  / rect.width;
    const relY = (e.clientY - rect.top)   / rect.height;

    // Set zoom image source to match current slide
    if (zoomImg.src !== img.src) {
      zoomImg.src = img.src;
      zoomImg.alt = img.alt;
    }

    // Move zoom origin to follow the cursor (creates magnifier effect)
    const originX = (relX * 100).toFixed(1) + '%';
    const originY = (relY * 100).toFixed(1) + '%';
    zoomImg.style.transformOrigin = `${originX} ${originY}`;
    zoomImg.style.transform       = 'scale(2.2)';

    // Position overlay: to the left of carousel on default, or below on mobile
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      // Desktop: appears to the left of the carousel
      const overlayTop = Math.max(0, e.clientY - rect.top - 130);
      zoomOverlay.style.top  = overlayTop + 'px';
    }

    // Show overlay
    clearTimeout(zoomHideTimer);
    zoomOverlay.classList.add('visible');
  });

  carouselMain.addEventListener('mouseleave', () => {
    // Small delay prevents flickering when moving to overlay edge
    zoomHideTimer = setTimeout(() => {
      zoomOverlay.classList.remove('visible');
    }, 120);
  });

  /* ══════════════════════════════════════════════════════════
     4. FAQ ACCORDION
     ══════════════════════════════════════════════════════════ */
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));

  faqItems.forEach(item => {
    const btn  = item.querySelector('.faq-question');
    const icon = item.querySelector('.faq-icon');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-icon').textContent = '+';
      });

      // Toggle clicked item
      if (!isOpen) {
        item.classList.add('open');
        icon.textContent = '−';
      }
    });
  });

  /* ══════════════════════════════════════════════════════════
     5. MANUFACTURING PROCESS TABS
     ══════════════════════════════════════════════════════════ */
  const processTabs  = Array.from(document.querySelectorAll('.process-tab'));
  const processPanel = document.getElementById('processPanel');

  // Content for each tab
  const tabContent = {
    raw: {
      title: 'High-Grade Raw Material Selection',
      body: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
      points: ['PE100 grade material', 'Optimal molecular weight distribution'],
      img: './assests/images/main_images.jpg'
    },
    extrusion: {
      title: 'Advanced Extrusion Process',
      body: 'Our state-of-the-art extruders process PE100 compound at precise temperatures ensuring consistent melt flow and pipe wall integrity.',
      points: ['Temperature-controlled barrel zones', 'Consistent wall thickness'],
      img: './assests/images/raw_material.jpg'
    },
    cooling: {
      title: 'Controlled Cooling System',
      body: 'Water cooling baths maintain precise temperature gradients to relieve internal stresses and achieve dimensional stability.',
      points: ['Staged cooling zones', 'Stress relief through controlled cooling'],
      img: './assests/images/cooling.jpg'
    },
    sizing: {
      title: 'Precision Sizing & Calibration',
      body: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
      points: ['±0.1mm dimensional tolerance', 'Continuous laser measurement'],
      img: './assests/images/sizing.jpg'
    },
    quality: {
      title: 'Rigorous Quality Control',
      body: 'Every pipe undergoes comprehensive testing for pressure resistance, dimensional accuracy, and material properties before shipment.',
      points: ['Hydrostatic pressure testing', 'Full dimensional inspection'],
      img: './assests/images/quality.jpg'
    },
    marking: {
      title: 'Permanent Pipe Marking',
      body: 'Inkjet marking systems apply permanent identification including manufacturer details, specification ratings, and batch traceability codes.',
      points: ['ISO-compliant marking format', 'UV-resistant inks'],
      img: './assests/images/marking.jpg'
    },
    cutting: {
      title: 'Precision Cutting & Length Control',
      body: 'Automated cutting systems deliver consistent lengths with clean square cuts, ensuring accurate measurement and easy installation.',
      points: ['±5mm length tolerance', 'Burr-free clean cuts'],
      img: './assests/images/cutting.webp'
    },
    packaging: {
      title: 'Protective Packaging & Dispatch',
      body: 'Pipes are bundled and wrapped with UV-protective polyethylene film for safe transportation and storage.',
      points: ['UV-protective outer wrapping', 'Stackable bundle design'],
      img: './assests/images/packing.webp'
    }
  };

  function renderTab(tabKey) {
    const data = tabContent[tabKey];
    if (!data) return;

    processPanel.innerHTML = `
      <div class="process-content">
        <div class="process-text">
          <h3>${data.title}</h3>
          <p>${data.body}</p>
          <ul>
            ${data.points.map(p => `<li><span class="dot blue"></span>${p}</li>`).join('')}
          </ul>
        </div>
        <div class="process-image">
          <img src="${data.img}" alt="${data.title}" loading="lazy" />
        </div>
      </div>
    `;
  }

  processTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      processTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTab(tab.dataset.tab);
    });
  });

  // Render initial tab
  renderTab('raw');

  /* ══════════════════════════════════════════════════════════
     6. APPLICATIONS CAROUSEL (horizontal scroll with buttons)
     ══════════════════════════════════════════════════════════ */
  const appTrack = document.getElementById('appTrack');
  const appPrev  = document.getElementById('appPrev');
  const appNext  = document.getElementById('appNext');

  /** Calculate one card's width including gap */
  function getAppCardStep() {
    const card = appTrack.querySelector('.app-card');
    if (!card) return 300;
    return card.offsetWidth + 16; // 16 = gap
  }

  appPrev.addEventListener('click', () => {
    appTrack.scrollBy({ left: -getAppCardStep(), behavior: 'smooth' });
  });
  appNext.addEventListener('click', () => {
    appTrack.scrollBy({ left: getAppCardStep(), behavior: 'smooth' });
  });

  // Convert the track to use scrollLeft instead of CSS transform for smoother behavior
  appTrack.style.overflowX = 'auto';
  appTrack.style.transform = 'none';
  appTrack.style.scrollSnapType = 'x mandatory';
  appTrack.style.scrollbarWidth = 'none';

  /* ══════════════════════════════════════════════════════════
     7. MOBILE HAMBURGER MENU
     ══════════════════════════════════════════════════════════ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);

    // Animate hamburger to X
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    const mainNav = document.getElementById('mainNav');
    if (!mainNav.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });

  /* ══════════════════════════════════════════════════════════
     8. TOUCH SWIPE SUPPORT for main carousel
     ══════════════════════════════════════════════════════════ */
  let touchStartX = 0;
  let touchEndX   = 0;

  carouselMain.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselMain.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const delta = touchStartX - touchEndX;

    if (Math.abs(delta) > 40) {  // min swipe distance
      if (delta > 0) {
        goToSlide(currentIndex + 1); // swipe left → next
      } else {
        goToSlide(currentIndex - 1); // swipe right → prev
      }
      resetAutoPlay();
    }
  }, { passive: true });

  /* ══════════════════════════════════════════════════════════
     9. SMOOTH SECTION REVEAL ON SCROLL (Intersection Observer)
     Adds 'in-view' class to sections as they enter viewport.
     ══════════════════════════════════════════════════════════ */
  const revealTargets = document.querySelectorAll(
    '.feature-card, .portfolio-card, .testimonial-card, .faq-item, .resource-item'
  );

  // Inject base styles for reveal animation
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .feature-card, .portfolio-card, .testimonial-card, .faq-item, .resource-item {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .feature-card.in-view, .portfolio-card.in-view, .testimonial-card.in-view,
    .faq-item.in-view, .resource-item.in-view {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(styleEl);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay based on sibling order
          const siblings = Array.from(entry.target.parentElement.children);
          const delay    = siblings.indexOf(entry.target) * 80;
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver
    revealTargets.forEach(el => el.classList.add('in-view'));
  }

}); // end DOMContentLoaded


document.querySelectorAll('.process-tab').forEach(tab => {
  tab.addEventListener('click', function () {

    // Remove active from all tabs
    document.querySelectorAll('.process-tab')
      .forEach(t => t.classList.remove('active'));

    // Remove active from all content
    document.querySelectorAll('.process-content')
      .forEach(c => c.classList.remove('active'));

    // Activate clicked tab
    this.classList.add('active');

    // Show matching panel
    const tabName = this.getAttribute('data-tab');
    document.querySelector(
      `.process-content[data-tab="${tabName}"]`
    ).classList.add('active');

  });
});