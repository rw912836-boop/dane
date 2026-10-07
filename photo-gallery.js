(() => {
  const BATCH = 30;
  const featuredHomePhotoIds = ['3a19ca69-9617-405d-ac7d-85174ece976f', 'b81cd947-310e-4802-bbc8-d53dde15f2bb'];
  const filters = [['all','All puppies'],['harlequin','Harlequin'],['black','Black'],['blue','Blue'],['mantle','Mantle'],['merle','Merle'],['fawn','Fawn'],['brindle','Brindle'],['playing','Playing'],['sleeping','Sleeping'],['running','Running'],['walking','Walking'],['sitting','Sitting'],['standing','Standing'],['lying down','Lying down'],['portrait','Portrait'],['outdoor','Outdoor'],['indoor','Indoor'],['group','Groups']];
  let photos = [], active = 'all', limit = BATCH;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const matching = () => active === 'all' ? photos : photos.filter(p => p.categories?.includes(active));

  function draw(host) {
    const results = matching(), shown = results.slice(0, limit);
    host.innerHTML = `<div class="photo-library-head"><div><div class="eyebrow">Our photo collection</div><h2>Great Dane puppies</h2><p>${results.length} openly licensed puppy photos · showing ${shown.length}</p></div><a class="photo-source" href="https://openverse.org/" target="_blank" rel="noreferrer">Find images via Openverse ↗</a></div>
      <div class="photo-filters" role="group" aria-label="Filter photos by category">${filters.map(([id,label]) => `<button type="button" data-filter="${id}" class="${active===id?'selected':''}" aria-pressed="${active===id}">${label}</button>`).join('')}</div>
      <div class="photo-grid">${shown.map(p => `<article class="photo-card"><a class="photo-image-link" href="#/photos/${encodeURIComponent(p.id)}" aria-label="View details for ${esc(p.title)}"><img src="${esc(p.url)}" alt="${esc(p.alt)}" loading="lazy" decoding="async"><span class="photo-category-badge">${esc(p.category === 'puppy' ? 'Puppy photo' : 'Great Dane photo')}</span></a><div class="photo-attribution"><a class="photo-title-link" href="#/photos/${encodeURIComponent(p.id)}">${esc(p.title)}</a><span>Photo by ${esc(p.photographer || 'Unknown creator')}</span><a class="photo-license" href="${esc(p.licenseUrl)}" target="_blank" rel="noreferrer">${esc(p.license)}</a></div></article>`).join('')}</div>
      ${shown.length < results.length ? '<button class="btn photo-more" type="button">Load more photos</button>' : ''}`;
    host.querySelectorAll('[data-filter]').forEach(button => button.onclick = () => { active = button.dataset.filter; limit = BATCH; draw(host); });
    host.querySelector('.photo-more')?.addEventListener('click', () => { limit += BATCH; draw(host); });
  }

  let loadingRoute = '';
  async function enhance() {
    const route = location.hash.slice(1) || 'home';
    if (!['home','puppies','dogs','about','testimonials'].includes(route)) {
      document.body.classList.remove('photos-pending');
      return;
    }
    const app = document.getElementById('app');
    if (!app || (['puppies','dogs'].includes(route) && app.querySelector('.photo-library')) || loadingRoute === route) return;
    loadingRoute = route;
    const showEmptyGallery = () => {
      if (!['puppies','dogs'].includes(route)) return;
      const host = document.createElement('section');
      host.className = 'photo-library section';
          host.innerHTML = '<div class="photo-empty"><div class="eyebrow">Photo gallery</div><h2>Our Great Dane photos</h2><p>Use the included no-key Openverse importer to build the photo collection.</p><a class="photo-source" href="https://openverse.org/" target="_blank" rel="noreferrer">Find images via Openverse</a></div>';
      app.querySelector('.gallery')?.replaceWith(host);
    };
    const removeUnconfiguredPhotos = () => {
      app.querySelectorAll('img').forEach(image => image.remove());
      showEmptyGallery();
      document.body.classList.remove('photos-pending');
    };
    try {
      if (Array.isArray(window.greatDanePhotos)) {
        photos = window.greatDanePhotos.filter(photo => photo.category === 'puppy');
      } else {
        const response = await fetch('./data/great-dane-photos.json');
        if (!response.ok) throw new Error('Manifest unavailable');
        photos = (await response.json()).filter(photo => photo.category === 'puppy');
      }
      if (route !== (location.hash.slice(1) || 'home')) return;
      if (!Array.isArray(photos) || !photos.length) {
        removeUnconfiguredPhotos();
        return;
      }
      const homePhotoSource = Array.isArray(window.greatDanePhotos) ? window.greatDanePhotos : photos;
      const featuredHomeImages = featuredHomePhotoIds.map(id => homePhotoSource.find(photo => photo.id === id)).filter(Boolean);
      if (!featuredHomeImages.length) featuredHomeImages.push(photos[0]);
      let slot = route === 'home' ? 1 : ['puppies','dogs'].includes(route) ? BATCH : 0;
      const nextPhoto = () => photos[(slot++) % photos.length];
      app.querySelectorAll('img[data-pending-photo]').forEach((image, index) => {
        if (image.closest('.quote .photos')) { image.closest('.photos')?.remove(); return; }
        const photo = featuredHomeImages[index] || featuredHomeImages[0];
        image.src = photo.url;
        image.removeAttribute('srcset');
        image.alt = photo.alt;
        image.loading = 'lazy';
        image.decoding = 'async';
        image.removeAttribute('data-pending-photo');
        if (!image.closest('a')) {
          const link = document.createElement('a');
          link.className = 'site-photo-link';
          link.href = `#/photos/${encodeURIComponent(photo.id)}`;
          link.setAttribute('aria-label', `View photo details for ${photo.title || 'Great Dane'}`);
          image.parentNode.insertBefore(link, image);
          link.appendChild(image);
        }
      });
      if (['puppies','dogs'].includes(route)) {
        const host = document.createElement('section');
        host.className = 'photo-library section';
        host.setAttribute('aria-label', 'Searchable Great Dane photo collection');
        app.querySelector('.gallery')?.replaceWith(host);
        draw(host);
      }
      document.body.classList.remove('photos-pending');
    } catch {
      removeUnconfiguredPhotos();
    } finally {
      loadingRoute = '';
    }
  }
  const app = document.getElementById('app');
  if (app) new MutationObserver(enhance).observe(app, { childList: true });
  window.addEventListener('hashchange', () => setTimeout(enhance, 0));
  enhance();
})();
