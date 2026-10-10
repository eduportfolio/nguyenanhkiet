// Light/dark theme switch
const btn = document.getElementById('themeToggle');

if (btn) {
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
  });
}


// Reveal sections
const reveals = document.querySelectorAll('.reveal');

const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

reveals.forEach(r => obs.observe(r));


// ============================================
// LIGHTBOX
// ============================================

const lightbox = document.createElement('div');
lightbox.id = 'lightbox';

lightbox.innerHTML = `
  <img id="lightbox-img" src="" alt="">
  <span id="lightbox-close">✕</span>
  <button id="lightbox-prev">&#8592;</button>
  <button id="lightbox-next">&#8594;</button>
  <div id="lightbox-counter"></div>
`;

document.body.appendChild(lightbox);

let currentGallery = [];
let currentIndex = 0;


function openLightbox(imgs, index) {
  currentGallery = imgs;
  currentIndex = index;

  updateLightbox();

  lightbox.classList.add('active');
}


function updateLightbox() {
  const lightboxImg = document.getElementById('lightbox-img');
  const counter = document.getElementById('lightbox-counter');
  const prev = document.getElementById('lightbox-prev');
  const next = document.getElementById('lightbox-next');

  if (!currentGallery.length) return;

  lightboxImg.src = currentGallery[currentIndex];

  counter.textContent =
    currentGallery.length > 1
      ? `${currentIndex + 1} / ${currentGallery.length}`
      : '';

  prev.style.display =
    currentGallery.length > 1 ? 'flex' : 'none';

  next.style.display =
    currentGallery.length > 1 ? 'flex' : 'none';
}


function closeLightbox() {
  lightbox.classList.remove('active');
}


// ============================================
// IMAGE CLICK HANDLER
// ============================================

document.body.addEventListener('click', e => {

  // ------------------------------------------
  // 1. Regular single images
  // ------------------------------------------

  const normalImg = e.target.closest(
    '.card-img, .rp-img, .avatar-img'
  );

  if (normalImg && normalImg.src) {
    openLightbox([normalImg.src], 0);
    return;
  }


  // ------------------------------------------
  // 2. Activity galleries
  // ------------------------------------------

  const activityImg = e.target.closest(
    '.activity-gallery img'
  );

  if (activityImg && activityImg.src) {

    const gallery = activityImg.closest(
      '.activity-gallery'
    );

    const allImgs = [
      ...gallery.querySelectorAll('img')
    ].filter(img => img.src);

    const index = allImgs.indexOf(activityImg);

    openLightbox(
      allImgs.map(img => img.src),
      index
    );

    return;
  }


  // ------------------------------------------
  // 3. INTERNSHIP GALLERY
  // ------------------------------------------
  // This is the important fix.
  //
  // Any image inside .internship-gallery
  // can now be opened and navigated.

  const internshipImg = e.target.closest(
    '.internship-gallery img'
  );

  if (internshipImg && internshipImg.src) {

    const gallery = internshipImg.closest(
      '.internship-gallery'
    );

    const allImgs = [
      ...gallery.querySelectorAll('img')
    ].filter(img => img.src);

    const index = allImgs.indexOf(
      internshipImg
    );

    openLightbox(
      allImgs.map(img => img.src),
      index
    );

    return;
  }

});


// ============================================
// LIGHTBOX NAVIGATION
// ============================================

document
  .getElementById('lightbox-prev')
  .addEventListener('click', e => {

    e.stopPropagation();

    if (!currentGallery.length) return;

    currentIndex =
      (currentIndex - 1 + currentGallery.length)
      % currentGallery.length;

    updateLightbox();
  });


document
  .getElementById('lightbox-next')
  .addEventListener('click', e => {

    e.stopPropagation();

    if (!currentGallery.length) return;

    currentIndex =
      (currentIndex + 1)
      % currentGallery.length;

    updateLightbox();
  });


// ============================================
// CLOSE LIGHTBOX
// ============================================

document
  .getElementById('lightbox-close')
  .addEventListener('click', closeLightbox);


lightbox.addEventListener('click', e => {

  if (e.target === lightbox) {
    closeLightbox();
  }

});


// ============================================
// KEYBOARD CONTROL
// ============================================

document.addEventListener('keydown', e => {

  if (!lightbox.classList.contains('active')) {
    return;
  }

  if (e.key === 'Escape') {
    closeLightbox();
  }

  if (e.key === 'ArrowLeft') {

    if (!currentGallery.length) return;

    currentIndex =
      (currentIndex - 1 + currentGallery.length)
      % currentGallery.length;

    updateLightbox();
  }

  if (e.key === 'ArrowRight') {

    if (!currentGallery.length) return;

    currentIndex =
      (currentIndex + 1)
      % currentGallery.length;

    updateLightbox();
  }

});


// ============================================
// ACTIVITY ITEM EXPAND / COLLAPSE
// ============================================

document
  .querySelectorAll('.activity-item')
  .forEach(item => {

    item.addEventListener('click', e => {

      // Don't toggle when clicking lightbox
      if (e.target.closest('#lightbox')) {
        return;
      }

      // Don't toggle when clicking an image
      if (e.target.closest('.activity-gallery')) {
        return;
      }

      item.classList.toggle('open');

    });

  });