// Ligh/dark theme switch  
const btn = document.getElementById('themeToggle');
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
  });

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
  
// Lightbox (clickable image)
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
  document.getElementById('lightbox-img').src = currentGallery[currentIndex];
  document.getElementById('lightbox-counter').textContent =
    currentGallery.length > 1 ? `${currentIndex + 1} / ${currentGallery.length}` : '';
  document.getElementById('lightbox-prev').style.display = currentGallery.length > 1 ? 'flex' : 'none';
  document.getElementById('lightbox-next').style.display = currentGallery.length > 1 ? 'flex' : 'none';
}

function closeLightbox() { lightbox.classList.remove('active'); }

document.body.addEventListener('click', e => {
  const img = e.target.closest('.card-img, .rp-img, .avatar-img');
  if (img && img.src) { openLightbox([img.src], 0); return; }

  const galleryImg = e.target.closest('.activity-gallery img');
  if (galleryImg && galleryImg.src) {
    const allImgs = [...galleryImg.closest('.activity-gallery').querySelectorAll('img')]
      .filter(i => i.src && !i.src.endsWith(location.href)); // lọc src rỗng
    const index = allImgs.indexOf(galleryImg);
    openLightbox(allImgs.map(i => i.src), index);
  }
});

document.getElementById('lightbox-prev').addEventListener('click', e => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  updateLightbox();
});

document.getElementById('lightbox-next').addEventListener('click', e => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % currentGallery.length;
  updateLightbox();
});

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length; updateLightbox(); }
  if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % currentGallery.length; updateLightbox(); }
});

// Activities galary
document.querySelectorAll('.activity-item').forEach(item => {
  item.addEventListener('click', e => {
    if (e.target.closest('#lightbox')) return;
    if (e.target.closest('.activity-gallery')) return;
    item.classList.toggle('open');
  });
});