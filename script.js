const routeLinks = [
  ['home', 'Home'], ['puppies', 'Available Puppies'], ['about', 'About Us'],
  ['breed-info', 'Breed Info'], ['adoption', 'Adoption Process'], ['blog', 'Blog'],
  ['faq', 'FAQ'], ['contact', 'Contact']
];
const puppiesData = Array.isArray(window.greatDanePuppies) ? window.greatDanePuppies : [];
const galleryPhotos = Array.isArray(window.greatDaneLocalGallery) ? window.greatDaneLocalGallery : [];
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const imageUrl = value => {
  const url = String(value || '').trim();
  return (/^https?:\/\//i.test(url) || /^(?:\.\/)?assets\/(?:[\w-]+\/)*[\w.-]+\.(?:jpe?g|png|webp|avif)$/i.test(url)) ? esc(url) : '';
};
const publishedPuppies = puppiesData.filter(p => p.is_published !== false && p.slug && p.name && typeof p.price === 'number' && Number.isFinite(p.price) && p.price >= 0 && ['available', 'reserved', 'adopted'].includes(p.adoption_status) && Array.isArray(p.photos) && p.photos.some(photo => imageUrl(typeof photo === 'string' ? photo : photo?.url)));
const eyebrow = text => `<div class="eyebrow">${esc(text)}</div>`;
const pageHero = (title, intro) => `<section class="page-hero"><div class="wrap">${eyebrow('Shade of Grey Great Danes')}<h1>${esc(title)}</h1><p>${esc(intro)}</p></div></section>`;
const puppyLink = puppy => `#/puppies/${encodeURIComponent(puppy.slug)}`;
const puppyPhotos = puppy => (Array.isArray(puppy.photos) ? puppy.photos : []).filter(photo => imageUrl(typeof photo === 'string' ? photo : photo?.url));
const photoSrc = photo => imageUrl(typeof photo === 'string' ? photo : photo.url);
const photoAlt = (photo, puppy, index = 0) => esc((typeof photo === 'object' && photo.alt) || `${puppy.name} the Great Dane puppy${index ? `, photo ${index + 1}` : ''}`);
function ageText(puppy) {
  if (puppy.age_label) return puppy.age_label;
  if (!puppy.date_of_birth) return '';
  const weeks = Math.floor((Date.now() - new Date(`${puppy.date_of_birth}T00:00:00`).getTime()) / 604800000);
  if (!Number.isFinite(weeks) || weeks < 0) return '';
  if (weeks < 12) return `${weeks} weeks old`;
  const months = Math.floor(weeks / 4.345);
  return `${months} months old`;
}
function priceText(price) {
  if (typeof price !== 'number' || !Number.isFinite(price)) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}
const statusText = status => ({ available: 'Available', reserved: 'Reserved', adopted: 'Adopted' }[status] || 'Contact to confirm');

function puppyCards(list) {
  if (!list.length) return `<div class="empty-catalog"><div class="empty-mark">SG</div><h2>No puppy profiles are posted right now.</h2><p>Contact us to ask about current availability and upcoming litters.</p><a class="button" href="#contact">Ask about puppies</a></div>`;
  return `<div class="puppy-grid">${list.map(puppy => {
    const photo = puppyPhotos(puppy)[0];
    const age = ageText(puppy);
    return `<a class="puppy-card" href="${puppyLink(puppy)}"><div class="puppy-card-image"><img src="${photoSrc(photo)}" alt="${photoAlt(photo, puppy)}" loading="lazy"><span class="status-badge status-${esc(puppy.adoption_status || 'available')}">${statusText(puppy.adoption_status)}</span></div><div class="puppy-card-copy"><h2>${esc(puppy.name)}</h2>${priceText(puppy.price) ? `<strong class="puppy-card-price">${priceText(puppy.price)}</strong>` : ''}<p class="coat-name">${esc(puppy.color_pattern || 'Great Dane')}</p><div class="puppy-meta"><span>${esc(puppy.gender || '')}</span>${age ? `<span>${esc(age)}</span>` : ''}${puppy.location ? `<span>${esc(puppy.location)}</span>` : ''}</div><span class="card-details">View puppy details <b>→</b></span></div></a>`;
  }).join('')}</div>`;
}

const contactForm = () => `<form class="contact-form"><input type="text" name="_honey" tabindex="-1" autocomplete="off" style="display:none"><div class="form-grid"><label>Your name<input name="name" autocomplete="name" required></label><label>Email address<input name="email" type="email" autocomplete="email" required></label><label>Phone (optional)<input name="phone" type="tel" autocomplete="tel"></label><label>What can we help with?<select name="subject"><option>Tell me about available puppies</option><option>Ask about the breed</option><option>Plan a visit</option><option>Other question</option></select></label><label class="wide">Message<textarea name="message" rows="5" required></textarea></label><div class="wide"><button class="button" type="submit">Send a message</button><p class="form-notice" aria-live="polite"></p></div></div></form>`;
const applicationForm = () => `<form class="contact-form application-form"><input type="text" name="_honey" tabindex="-1" autocomplete="off" style="display:none"><div class="form-grid"><label>Your name<input name="name" autocomplete="name" required></label><label>Email address<input name="email" type="email" autocomplete="email" required></label><label>Phone<input name="phone" type="tel" autocomplete="tel" required></label><label>City and state<input name="location" autocomplete="address-level2" required></label><label>Have you owned a Great Dane before?<select name="experience"><option>Yes</option><option>No</option></select></label><label>Home type<select name="home"><option>House</option><option>Apartment</option><option>Other</option></select></label><label class="wide">Tell us about your home and the companion you are looking for<textarea name="message" rows="5" required></textarea></label><div class="wide"><button class="button" type="submit">Send application</button><p class="form-notice" aria-live="polite"></p></div></div></form>`;

const home = () => `
  <section class="hero"><div class="hero-shade"></div><div class="wrap hero-copy">${eyebrow('Family-raised Great Danes · Waterford, Pennsylvania')}<h1>A gentle giant<br>to call your own.</h1><p>Thoughtfully raised Great Danes, cared for with patience from their first days.</p><div class="button-row"><a class="button" href="#puppies">View available puppies</a><a class="button button-light" href="#about">Get to know us</a></div></div><span class="hero-caption">A little more room for a lot of love.</span></section>
  <section class="welcome section"><div class="wrap"><div class="home-welcome-copy">${eyebrow('Welcome to Shade of Grey')}<h2>Big-hearted dogs.<br>Thoughtful beginnings.</h2><p>We have been raising Great Danes in Waterford, Pennsylvania, since 2001. Our puppies grow up around family life, with room to explore and time to build confidence.</p><p>That early attention matters. It helps each puppy develop a calm temperament, strong social skills, and the confidence to settle beautifully into a new home.</p><a class="text-link" href="#about">A little about us <span>→</span></a></div></div></section>
  <section class="section section-soft story-panel"><div class="wrap story-panel-inner"><div class="story-text"><div class="eyebrow">Why families choose us</div><h2>We raise Great Danes for real life, not just for first impressions.</h2><p>Every puppy is handled with intention, exposed to family routines, and given room to play, rest, and learn. We believe a strong start creates a dog that is easier to live with and easier to love.</p></div><div class="info-stack"><div class="info-item"><strong>01</strong><div><h3>Family-centered upbringing</h3><p>Puppies grow in a home setting where they learn gentle routines and healthy social habits.</p></div></div><div class="info-item"><strong>02</strong><div><h3>Space to grow</h3><p>Our dogs enjoy open outdoor time and a heated indoor area that supports comfort through all seasons.</p></div></div><div class="info-item"><strong>03</strong><div><h3>Support after placement</h3><p>We take time to answer questions, guide new families, and help each adoption feel well prepared.</p></div></div></div></div></section>
  <section class="section stat-panel"><div class="wrap stat-grid"><div class="stat-box"><span>Since</span><strong>2001</strong><p>Years of intentional Great Dane breeding and care.</p></div><div class="stat-box"><span>Space</span><strong>20 acres</strong><p>Room for healthy movement, exercise, and outdoor enrichment.</p></div><div class="stat-box"><span>Comfort</span><strong>Heated</strong><p>Indoor care for colder months and a more stable routine.</p></div><div class="stat-box"><span>Approach</span><strong>Gentle</strong><p>Low-stress handling and attention to temperament from day one.</p></div></div></section>
  <section class="highlights section section-soft"><div class="wrap"><div class="section-heading">${eyebrow('A good start matters')}<h2>Care in every detail.</h2><p>We keep our approach simple: attentive care, a safe place to grow, and honest guidance for every family.</p></div><div class="highlight-grid"><article><span class="highlight-number">01</span><h3>Raised with care</h3><p>Our puppies are handled gently and grow in a family environment.</p></article><article><span class="highlight-number">02</span><h3>Room to explore</h3><p>Our dogs have a fenced 20-acre area and a heated indoor space.</p></article><article><span class="highlight-number">03</span><h3>Here for your family</h3><p>We are glad to answer questions and help you decide if a Dane is right for you.</p></article></div></div></section>
  <section class="section catalog-preview"><div class="wrap"><div class="section-heading">${eyebrow('Find your new companion')}<h2>Available Great Dane puppies</h2><p>Browse puppy profiles, photos, and details. Contact us for current availability.</p></div>${puppyCards(publishedPuppies.slice(0, 3))}<div class="center"><a class="button button-outline" href="#puppies">View all puppies</a></div></div></section>
  <section class="home-cta"><div class="wrap cta-inner">${eyebrow('A thoughtful match begins with a conversation')}<h2>Thinking about a Great Dane?</h2><p>Tell us what you are looking for. We will help you take the next step.</p><a class="button button-light" href="#contact">Talk with us</a></div></section>`;

const availablePuppies = () => `${pageHero('Available Great Dane puppies', 'Meet the puppies currently looking for homes. Select a profile to see all photos and details.')}<section class="section catalog-section"><div class="wrap"><aside class="market-guide"><div><span class="market-label">Typical U.S. breeder price range</span><strong>$1,000–$3,500+</strong></div><p>This is a general market guide, not a price quote for a specific puppy. Individual puppy prices are set by the breeder. <a href="https://www.carecredit.com/well-u/pet-care/great-dane-dog-breed/" target="_blank" rel="noopener noreferrer">Source: CareCredit’s Great Dane guide</a></p></aside><div class="catalog-toolbar"><p>${publishedPuppies.length} puppy ${publishedPuppies.length === 1 ? 'profile' : 'profiles'} · <span id="gallery-count">${galleryPhotos.length} photos · showing ${galleryPhotos.length}</span></p><label>Availability <select id="puppy-filter"><option value="all">All profiles</option><option value="available">Available</option><option value="reserved">Reserved</option><option value="adopted">Adopted</option></select></label></div><div class="gallery"></div><div id="puppy-results">${puppyCards(publishedPuppies)}</div></div></section>`;

function puppyDetail(slug) {
  const puppy = publishedPuppies.find(item => item.slug === slug);
  if (!puppy) return `${pageHero('Puppy profile unavailable', 'This puppy profile is not currently published.')}<section class="section"><div class="content-narrow empty-catalog"><p>Browse current profiles or contact us to ask about upcoming litters.</p><a class="button" href="#puppies">View available puppies</a></div></section>`;
  const photos = puppyPhotos(puppy);
  const age = ageText(puppy);
  const prettyDate = value => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const normalizedSex = String(puppy.gender || '').toLowerCase();
  const sex = normalizedSex === 'male' ? 'Male' : normalizedSex === 'female' ? 'Female' : 'Not provided';
  const colorPattern = typeof puppy.color_pattern === 'string' && puppy.color_pattern.trim()
    ? puppy.color_pattern.trim()
    : 'Not provided';
  const availability = statusText(puppy.adoption_status);
  const specifications = [
    ['Sex', sex],
    ['Age', age || 'Puppy; exact age not provided'],
    ['Color / Pattern', colorPattern],
    ['Availability', availability],
    ['Date of birth', prettyDate(puppy.date_of_birth)],
    ['Location', puppy.location]
  ];
  const extraDetails = [['Personality & temperament', puppy.personality], ['Health information', puppy.health_info], ['Health guarantee', puppy.health_guarantee], ['Vaccination information', puppy.vaccination_info], ['Registration', puppy.registration_info]].filter(([, value]) => value);
  const statusAction = puppy.adoption_status === 'adopted'
    ? `<div class="status-message"><p>${esc(puppy.name)} has found a home. View other Great Dane puppy profiles.</p><a class="text-link" href="#puppies">See available puppies <span>→</span></a></div>`
    : puppy.adoption_status === 'reserved'
      ? `<div class="status-message"><p>${esc(puppy.name)} is currently reserved. Contact us to ask about this puppy or upcoming litters.</p><a class="button" href="#contact?puppy=${encodeURIComponent(puppy.slug)}">Ask a question</a></div>`
      : `<a class="button" href="#adoption-application?puppy=${encodeURIComponent(puppy.slug)}">Apply to adopt ${esc(puppy.name)}</a>`;
  const related = publishedPuppies.filter(item => item.slug !== puppy.slug).slice(0, 3);
  return `<div class="detail-breadcrumb"><div class="wrap"><a href="#home">Home</a><span>&rsaquo;</span><a href="#puppies">Available Puppies</a><span>&rsaquo;</span><span>${esc(puppy.name)}</span></div></div><section class="section puppy-detail"><div class="wrap"><div class="detail-grid"><div class="detail-gallery"><div class="detail-main-photo"><img id="detail-main-image" src="${photoSrc(photos[0])}" alt="${photoAlt(photos[0], puppy)}">${photos.length > 1 ? '<button class="detail-arrow detail-prev" type="button" aria-label="Previous photo">&#8249;</button><button class="detail-arrow detail-next" type="button" aria-label="Next photo">&#8250;</button>' : ''}</div>${photos.length > 1 ? `<div class="detail-thumbnails">${photos.map((photo, i) => `<button class="detail-thumb${i === 0 ? ' selected' : ''}" data-photo-index="${i}" type="button" aria-label="Show photo ${i + 1}"><img src="${photoSrc(photo)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}</div><div class="detail-copy"><a class="button button-outline detail-back" href="#puppies">← Back to puppies</a><span class="status-badge status-${esc(puppy.adoption_status)}">${statusText(puppy.adoption_status)}</span><h1>${esc(puppy.name)}</h1><p class="detail-coat">${esc(puppy.color_pattern || 'Great Dane')}</p><div class="detail-price">${priceText(puppy.price)}</div><dl class="spec-grid">${specifications.filter(([, value]) => value).map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><div class="detail-description"><h2>About ${esc(puppy.name)}</h2><p>${esc(puppy.description || 'Contact us to learn more about this puppy.')}</p></div>${extraDetails.map(([heading, body]) => `<div class="detail-description"><h2>${esc(heading)}</h2><p>${esc(body)}</p></div>`).join('')}${puppy.adoption_info ? `<div class="adoption-note"><h2>Adoption information</h2><p>${esc(puppy.adoption_info)}</p></div>` : ''}${puppy.availability_date && puppy.adoption_status !== 'adopted' ? `<p class="detail-availability">Available to go home: <strong>${esc(prettyDate(puppy.availability_date))}</strong></p>` : ''}${statusAction}<p class="detail-help">Questions? Call <a href="tel:+12026815722">(202) 681-5722</a></p></div></div>${related.length ? `<section class="related-puppies"><h2>More puppies to meet</h2>${puppyCards(related)}</section>` : ''}</div></section>`;
}

const about = () => `${pageHero('About Shade of Grey', 'A family passion for Great Danes, here in Waterford, Pennsylvania, since 2001.')}<section class="section"><div class="wrap welcome-grid about-grid"><div>${eyebrow('Our home is their home')}<h2>Room to grow, time to connect.</h2><p>Located just south of Erie, our home and kennel are within easy reach of Pittsburgh, Buffalo, and Cleveland. Our Great Danes spend time with people, enjoy outdoor space, and receive patient training and socialization.</p><p>We also have a heated indoor facility for colder months. Expectant mothers give birth in our home, where they can be closely monitored and cared for.</p><a class="text-link" href="#contact">Come meet us <span>→</span></a></div><img class="welcome-image" data-pending-photo="" alt="Great Dane enjoying time outdoors"></div></section>`;
const breedInfo = () => `${pageHero('Is a Great Dane right for you?', 'A little information to help you picture life with this remarkable giant breed.')}<section class="section section-soft"><div class="wrap"><div class="section-heading">${eyebrow('The breed at a glance')}<h2>Large in size. Part of the family.</h2></div><div class="info-grid"><article><h3>Space & daily life</h3><p>Great Danes grow into very large dogs. Think ahead about room at home, travel, supplies, and the cost of caring for a giant breed.</p></article><article><h3>Training & socialization</h3><p>Early, positive training helps build good manners and makes daily life easier as your puppy grows.</p></article><article><h3>Exercise & companionship</h3><p>Plan for regular walks, play, and time together. Great Danes need a family prepared to include them in everyday life.</p></article></div><div class="center"><a class="button" href="#contact">Ask us about Great Danes</a></div></div></section>`;
const adoption = () => `${pageHero('The adoption process', 'We want each puppy to find a prepared, caring home. Here is how to begin.')}<section class="section"><div class="content-narrow"><div class="process-step"><span>01</span><div><h2>Start a conversation</h2><p>Tell us a little about your home, your experience with dogs, and what you hope for in a companion.</p></div></div><div class="process-step"><span>02</span><div><h2>Get to know the breed</h2><p>We will talk through the needs of a growing Great Dane and answer your questions about our puppies.</p></div></div><div class="process-step"><span>03</span><div><h2>Plan the next step</h2><p>If it feels like a good fit, we can discuss availability, visits, timing, and the details of bringing your puppy home.</p></div></div><a class="button" href="#contact">Ask about adoption</a></div></section>`;
const adoptionApplication = () => `${pageHero('Adoption application', 'Start by telling us a little about yourself and the home you can offer a Great Dane.')}<section class="section"><div class="wrap application-wrap"><div class="application-intro">${eyebrow('Let’s find the right fit')}<h2>A few details to begin.</h2><p>When you submit, your application will be sent to our contact email. We will follow up to talk about availability and next steps.</p></div><div class="form-card">${applicationForm()}</div></div></section>`;
const blogArticles = [
  ['Preparing for a giant-breed puppy', 'Make room for a growing dog, choose sturdy everyday supplies, and plan how the new puppy will join your family routine.'],
  ['Starting training with patience', 'Short, positive practice and steady routines help puppies learn as they settle into a new home.'],
  ['Questions to ask a Great Dane breeder', 'Ask about the puppy’s background, care, health records, temperament, and what support is available after adoption.']
];
const blog = () => `${pageHero('From our Great Dane journal', 'Notes and practical ideas for families learning about life with a Great Dane.')}<section class="section"><div class="wrap article-grid">${blogArticles.map(([title, body], i) => `<article class="article-card"><span class="article-number">0${i + 1}</span><h2>${title}</h2><p>${body}</p><details><summary>Read more</summary><p>${body} Every dog and household is different, so contact us with questions about your own situation.</p></details></article>`).join('')}</div></section>`;
const faqItems = [
  ['How can I ask about available puppies?', 'Use the contact form or call us. We can share current availability and answer questions about upcoming litters.'],
  ['What do Great Dane puppies typically cost?', 'A general U.S. breeder price guide gives a broad range of about $1,000 to $3,500 and up. Individual prices depend on the breeder and the puppy; this range is not a quote for a specific dog.'],
  ['When do puppies go to their new homes?', 'We will discuss each litter’s timing with interested families and make sure the puppy is ready for the transition.'],
  ['Can I visit?', 'Visits are by appointment. Contact us so we can find a suitable time.'],
  ['What should I know before adopting a Great Dane?', 'Great Danes become very large dogs. Plan for their space, training, exercise, food, veterinary care, and the time they need with their family.'],
  ['Where are you located?', 'We are in Waterford, Pennsylvania, just south of Erie.']
];
const faq = () => `${pageHero('Frequently asked questions', 'A few helpful answers about our puppies, visits, and the breed.')}<section class="section"><div class="content-narrow faq-list">${faqItems.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></section>`;
const contact = () => `${pageHero('Let’s talk Great Danes', 'Questions about the breed, a visit, or current puppy availability? We would be glad to hear from you.')}<section class="section"><div class="wrap contact-grid"><div>${eyebrow('Get in touch')}<h2>We are here to help.</h2><p>Reach out to learn more about our Great Danes, upcoming litters, and visits by appointment.</p><div class="contact-detail"><span>Phone</span><a href="tel:+12026815722">(202) 681-5722</a></div><div class="contact-detail"><span>Email</span><a href="mailto:info@daneowernsandlovers.com">info@daneowernsandlovers.com</a></div><div class="contact-detail"><span>Facebook</span><a class="facebook-link" href="https://www.facebook.com/profile.php?id=61585033900298" target="_blank" rel="noopener noreferrer"><svg class="facebook-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.021 10.125 11.928v-8.432H7.078v-3.496h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.956.931-1.956 1.886v2.268h3.328l-.532 3.496h-2.796v8.432C19.612 23.094 24 18.092 24 12.073Z"/></svg><span>Visit our Facebook page</span></a></div><div class="contact-detail"><span>Visit</span><p>10245 Barton Road<br>Waterford, PA 16441<br>Monday–Saturday, by appointment</p></div></div><div class="form-card">${contactForm()}</div></div></section>`;

const pages = { home, puppies: availablePuppies, about, 'breed-info': breedInfo, adoption, 'adoption-application': adoptionApplication, blog, faq, contact };
function currentRoute() {
  const raw = location.hash.replace(/^#\/?/, '').split('?')[0] || 'home';
  const detail = raw.match(/^puppies\/([^/]+)$/);
  if (detail) return { page: 'puppies', detailSlug: decodeURIComponent(detail[1]) };
  return { page: pages[raw] ? raw : 'home' };
}
function setupPuppyDetail() {
  const photos = document.querySelectorAll('.detail-thumb');
  if (!photos.length) return;
  const main = document.getElementById('detail-main-image');
  let active = 0;
  const select = index => {
    active = (index + photos.length) % photos.length;
    const button = photos[active];
    main.src = button.querySelector('img').src;
    main.alt = button.querySelector('img').alt;
    photos.forEach((item, i) => item.classList.toggle('selected', i === active));
  };
  photos.forEach((button, index) => button.addEventListener('click', () => select(index)));
  document.querySelector('.detail-prev')?.addEventListener('click', () => select(active - 1));
  document.querySelector('.detail-next')?.addEventListener('click', () => select(active + 1));
}
function render() {
  const route = currentRoute();
  const page = route.detailSlug ? puppyDetail(route.detailSlug) : pages[route.page]();
  document.getElementById('app').innerHTML = page;
  document.querySelectorAll('[data-route]').forEach(link => {
    link.classList.toggle('active', link.dataset.route === route.page);
    if (link.dataset.route === route.page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.getElementById('nav').classList.remove('open');
  document.getElementById('menu').setAttribute('aria-expanded', 'false');
  document.getElementById('puppy-filter')?.addEventListener('change', event => {
    const value = event.target.value;
    const filtered = value === 'all' ? publishedPuppies : publishedPuppies.filter(puppy => puppy.adoption_status === value);
    document.getElementById('puppy-results').innerHTML = puppyCards(filtered);
  });
  setupPuppyDetail();
  if (route.page === 'contact') {
    const puppySlug = new URLSearchParams(location.hash.split('?')[1] || '').get('puppy');
    const puppy = publishedPuppies.find(item => item.slug === puppySlug);
    if (puppy) {
      const subject = document.querySelector('.contact-form select[name="subject"]');
      const message = document.querySelector('.contact-form textarea[name="message"]');
      if (subject) subject.value = 'Tell me about available puppies';
      if (message) message.value = `I am interested in ${puppy.name}. Please send me more information.`;
    }
  }
  if (route.page === 'adoption-application') {
    const puppySlug = new URLSearchParams(location.hash.split('?')[1] || '').get('puppy');
    const puppy = publishedPuppies.find(item => item.slug === puppySlug);
    if (puppy) {
      const message = document.querySelector('.application-form textarea[name="message"]');
      if (message) message.value = `I would like to apply to adopt ${puppy.name}. Please contact me with the next steps.`;
    }
  }
  document.querySelectorAll('.contact-form').forEach(form => form.addEventListener('submit', async event => {
    event.preventDefault();
    const notice = form.querySelector('.form-notice');
    const submitButton = form.querySelector('button[type="submit"]');
    const fields = Object.fromEntries(new FormData(form).entries());
    fields._replyto = fields.email;
    fields._subject = form.classList.contains('application-form')
      ? 'New Great Dane adoption application'
      : (fields.subject || 'Great Dane puppy inquiry');
    fields._template = 'table';
    submitButton.disabled = true;
    notice.textContent = 'Sending your message...';
    try {
      const response = await fetch('https://formsubmit.co/ajax/info@daneowernsandlovers.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(fields)
      });
      const result = await response.json();
      if (!response.ok || result.success === false || result.success === 'false') {
        throw new Error(result.message || 'Form submission failed');
      }
      form.reset();
      notice.textContent = 'Thank you. Your message was sent to our team.';
    } catch (error) {
      notice.textContent = 'We could not send your message. Please email info@daneowernsandlovers.com or call (202) 681-5722.';
    } finally {
      submitButton.disabled = false;
    }
  }));
  window.scrollTo(0, 0);
}
document.getElementById('menu').addEventListener('click', event => {
  const open = document.getElementById('nav').classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});
window.addEventListener('hashchange', render);
render();
