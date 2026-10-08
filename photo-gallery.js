(() => {
  const BATCH = 30;
  const photos = Array.isArray(window.greatDaneLocalGallery) ? window.greatDaneLocalGallery : [];
  let limit = BATCH;

  function draw(host) {
    const shown = photos.slice(0, limit);
    host.className = 'photo-library section';
    host.setAttribute('aria-label', 'Great Dane photo collection');
    host.innerHTML = `<div class="photo-library-head"><div><div class="eyebrow">From your photo folder</div><h2>Great Dane photos</h2><p>${photos.length} photos | showing ${shown.length}</p><p class="photo-library-note">The puppy profiles above include each puppy's recorded sex and individual price. The first 30 cards use the names you supplied. The remaining 12 are extra photos. Puppy-specific age, sex, and availability were not included with these images; each card shows its own price between $800 and $1,200.</p></div></div>
      <div class="photo-grid">${shown.map((photo, index) => `<article class="photo-card"><button class="photo-image-link" type="button" data-open-photo="${index}" aria-label="View ${photo.name || photo.alt}"><img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async"><span class="photo-category-badge">Puppy photo</span></button><div class="photo-attribution"><h3 class="photo-title-link">${photo.name || photo.alt}</h3><span>Great Dane puppy | Sex not provided | Age not provided</span><div class="photo-listing-price"><span>Price</span><strong>$${photo.price.toLocaleString("en-US")}</strong></div><a class="photo-card-link" href="#puppies?browse=1">See named puppy profiles</a></div></article>`).join('')}</div>
      ${shown.length < photos.length ? `<button class="btn photo-more" type="button">Show the remaining ${photos.length - shown.length} photos</button>` : ''}
      <dialog class="local-photo-dialog" aria-label="Great Dane puppy photo details"><button class="local-photo-close" type="button" aria-label="Close photo details">&times;</button><div class="local-photo-layout"><img class="local-photo-large" alt=""><section class="local-photo-details"><span class="photo-category-badge">Puppy photo</span><h2 class="local-photo-name"></h2><p class="local-photo-price"><span>Price</span><strong></strong></p><dl><div><dt>Sex</dt><dd>Not provided</dd></div><div><dt>Age</dt><dd>Not provided</dd></div><div><dt>Color / pattern</dt><dd>Not provided</dd></div><div><dt>Availability</dt><dd>Contact to confirm</dd></div></dl><p class="local-photo-note">The photo folder does not include this puppy's age, sex, color details, or availability.</p><a class="button" href="#contact">Ask about availability</a></section></div><div class="local-photo-controls"><button type="button" data-photo-step="-1" aria-label="Previous photo">&larr; Previous</button><span class="local-photo-count"></span><button type="button" data-photo-step="1" aria-label="Next photo">Next &rarr;</button></div></dialog>`;

    const dialog = host.querySelector('.local-photo-dialog');
    const largeImage = host.querySelector('.local-photo-large');
    const count = host.querySelector('.local-photo-count');
    const detailName = host.querySelector('.local-photo-name');
    const detailPrice = host.querySelector('.local-photo-price strong');
    let active = 0;
    const show = index => {
      active = (index + photos.length) % photos.length;
      largeImage.src = photos[active].src;
      largeImage.alt = photos[active].alt;
      detailName.textContent = photos[active].name || photos[active].alt;
      detailPrice.textContent = `$${photos[active].price.toLocaleString("en-US")}`;
      count.textContent = `${active + 1} of ${photos.length}`;
    };

    host.querySelectorAll('[data-open-photo]').forEach(button => button.addEventListener('click', () => {
      show(Number(button.dataset.openPhoto));
      dialog.showModal();
    }));
    host.querySelector('.local-photo-close').addEventListener('click', () => dialog.close());
    host.querySelectorAll('[data-photo-step]').forEach(button => button.addEventListener('click', () => {
      show(active + Number(button.dataset.photoStep));
    }));
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
    host.querySelector('.photo-more')?.addEventListener('click', () => {
      limit = photos.length;
      draw(host);
    });
  }

  function enhance() {
    const app = document.getElementById('app');
    if (!app) return;
    app.querySelectorAll('img[data-pending-photo]').forEach((image, index) => {
      if (photos.length) {
        const photo = photos[index % photos.length];
        image.src = photo.src;
        image.alt = photo.alt;
        image.loading = 'lazy';
        image.decoding = 'async';
      }
      image.removeAttribute('data-pending-photo');
    });
    document.body.classList.remove('photos-pending');

    const route = location.hash.slice(1) || 'home';
    const gallery = ['puppies', 'dogs'].includes(route) ? app.querySelector('.gallery') : null;
    if (gallery) {
      const host = document.createElement('section');
      gallery.replaceWith(host);
      draw(host);
    }
  }

  const app = document.getElementById('app');
  if (app) new MutationObserver(enhance).observe(app, { childList: true });
  window.addEventListener('hashchange', () => setTimeout(enhance, 0));
  enhance();
})();
