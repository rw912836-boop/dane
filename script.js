const routeLinks = [
  ['home', 'Home'], ['puppies', 'Available Puppies'], ['about', 'About Us'],
  ['breed-info', 'Breed Info'], ['adoption', 'Adoption'], ['faq', 'FAQ'], ['contact', 'Contact']
];

const eyebrow = (text) => `<div class="eyebrow">${text}</div>`;
const pageHero = (title, intro) => `<section class="page-hero"><div class="wrap">${eyebrow('Shade of Grey Great Danes')}<h1>${title}</h1><p>${intro}</p></div></section>`;
const contactForm = () => `<form class="contact-form"><div class="form-grid"><label>Your name<input name="name" autocomplete="name" required></label><label>Email address<input name="email" type="email" autocomplete="email" required></label><label>Phone (optional)<input name="phone" type="tel" autocomplete="tel"></label><label>What can we help with?<select name="subject"><option>Tell me about available puppies</option><option>Ask about the breed</option><option>Plan a visit</option><option>Other question</option></select></label><label class="wide">Message<textarea name="message" rows="5" required></textarea></label><div class="wide"><button class="button" type="submit">Send a message</button><p class="form-notice" aria-live="polite"></p></div></div></form>`;

const home = () => `
  <section class="hero">
    <div class="hero-shade"></div>
    <div class="wrap hero-copy">${eyebrow('Family-raised Great Danes · Waterford, Pennsylvania')}
      <h1>A gentle giant<br>to call your own.</h1>
      <p>Thoughtfully raised Great Danes, cared for with patience from their first days.</p>
      <div class="button-row"><a class="button" href="#puppies">Meet our puppies</a><a class="button button-light" href="#about">Get to know us</a></div>
    </div>
    <span class="hero-caption">A little more room for a lot of love.</span>
  </section>
  <section class="welcome section"><div class="wrap welcome-grid">
    <img class="welcome-image" data-pending-photo="" alt="Great Dane with its family">
    <div>${eyebrow('Welcome to Shade of Grey')}<h2>Big-hearted dogs.<br>Thoughtful beginnings.</h2>
      <p>We have been raising Great Danes in Waterford, Pennsylvania, since 2001. Our puppies grow up around family life, with room to explore and time to build confidence.</p>
      <a class="text-link" href="#about">A little about us <span>→</span></a>
    </div>
  </div></section>
  <section class="highlights section section-soft"><div class="wrap">
    <div class="section-heading">${eyebrow('A good start matters')}<h2>Care in every detail.</h2><p>We keep our approach simple: attentive care, a safe place to grow, and honest guidance for every family.</p></div>
    <div class="highlight-grid"><article><span class="highlight-number">01</span><h3>Raised with care</h3><p>Our puppies are handled gently and grow in a family environment.</p></article><article><span class="highlight-number">02</span><h3>Room to explore</h3><p>Our dogs have a fenced 20-acre area and a heated indoor space.</p></article><article><span class="highlight-number">03</span><h3>Here for your family</h3><p>We are glad to answer questions and help you decide if a Dane is right for you.</p></article></div>
  </div></section>
  <section class="puppy-preview section"><div class="wrap">
    <div class="section-heading">${eyebrow('Find your new companion')}<h2>Great Dane puppies</h2><p>See our photo collection and get in touch to ask about current availability.</p></div>
    <div class="preview-grid"><img data-pending-photo="" alt="Great Dane puppy sitting"><img data-pending-photo="" alt="Great Dane puppy with its litter"><img data-pending-photo="" alt="Young Great Dane exploring"></div>
    <div class="center"><a class="button" href="#puppies">View puppies and photos</a></div>
  </div></section>
  <section class="home-cta"><div class="wrap cta-inner">${eyebrow('A thoughtful match begins with a conversation')}<h2>Thinking about a Great Dane?</h2><p>Tell us what you are looking for. We will help you take the next step.</p><a class="button button-light" href="#contact">Talk with us</a></div></section>`;

const puppies = () => `${pageHero('Available puppies', 'Meet the breed, browse our Great Dane photos, and contact us for current litter information.')}<section class="section"><div class="wrap"><div class="gallery"></div><div class="content-narrow puppy-note">${eyebrow('A loving start')}<h2>Growing up with care.</h2><p>Our puppies are raised in a family environment and introduced to everyday sights, sounds, gentle handling, and play. Contact us to ask about current availability, timing, and what to expect when welcoming a Great Dane.</p><a class="button" href="#contact">Ask about puppies</a></div></div></section>`;

const about = () => `${pageHero('A family passion', 'We have been raising Great Danes in Waterford, Pennsylvania, since 2001.')}<section class="section"><div class="wrap welcome-grid about-grid"><div>${eyebrow('Our home is their home')}<h2>Room to grow, time to connect.</h2><p>Located just south of Erie, our home and kennel are within easy reach of Pittsburgh, Buffalo, and Cleveland. Our Great Danes spend time with people, enjoy outdoor space, and receive patient training and socialization.</p><p>We also have a heated indoor facility for colder months. Expectant mothers give birth in our home, where they can be closely monitored and cared for.</p><a class="text-link" href="#contact">Come meet us <span>→</span></a></div><img class="welcome-image" data-pending-photo="" alt="Great Dane enjoying time outdoors"></div></section>`;

const breedInfo = () => `${pageHero('Is a Great Dane right for you?', 'A little information to help you picture life with this remarkable giant breed.')}<section class="section section-soft"><div class="wrap"><div class="section-heading">${eyebrow('The breed at a glance')}<h2>Large in size. Part of the family.</h2></div><div class="info-grid"><article><h3>Space & daily life</h3><p>Great Danes grow into very large dogs. Think ahead about room at home, travel, supplies, and the cost of caring for a giant breed.</p></article><article><h3>Training & socialization</h3><p>Early, positive training helps build good manners and makes daily life easier as your puppy grows.</p></article><article><h3>Exercise & companionship</h3><p>Plan for regular walks, play, and time together. Great Danes need a family prepared to include them in everyday life.</p></article></div><div class="center"><a class="button" href="#contact">Ask us about Great Danes</a></div></div></section>`;

const adoption = () => `${pageHero('The adoption process', 'We want each puppy to find a prepared, caring home. Here is how to begin.')}<section class="section"><div class="content-narrow"><div class="process-step"><span>01</span><div><h2>Start a conversation</h2><p>Tell us a little about your home, your experience with dogs, and what you hope for in a companion.</p></div></div><div class="process-step"><span>02</span><div><h2>Get to know the breed</h2><p>We will talk through the needs of a growing Great Dane and answer your questions about our puppies.</p></div></div><div class="process-step"><span>03</span><div><h2>Plan the next step</h2><p>If it feels like a good fit, we can discuss availability, visits, timing, and the details of bringing your puppy home.</p></div></div><a class="button" href="#contact">Ask about adoption</a></div></section>`;

const faqItems = [
  ['How can I ask about available puppies?', 'Use the contact form or call us. We can share current availability and answer questions about upcoming litters.'],
  ['When do puppies go to their new homes?', 'We will discuss each litter’s timing with interested families and make sure the puppy is ready for the transition.'],
  ['Can I visit?', 'Visits are by appointment. Contact us so we can find a suitable time.'],
  ['What should I know before adopting a Great Dane?', 'Great Danes become very large dogs. Plan for their space, training, exercise, food, veterinary care, and the time they need with their family.'],
  ['Where are you located?', 'We are in Waterford, Pennsylvania, just south of Erie.']
];
const faq = () => `${pageHero('Frequently asked questions', 'A few helpful answers about our puppies, visits, and the breed.')}<section class="section"><div class="content-narrow faq-list">${faqItems.map(([q,a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></section>`;

const contact = () => `${pageHero('Let’s talk Great Danes', 'Questions about the breed, a visit, or current puppy availability? We would be glad to hear from you.')}<section class="section"><div class="wrap contact-grid"><div>${eyebrow('Get in touch')}<h2>We are here to help.</h2><p>Reach out to learn more about our Great Danes, upcoming litters, and visits by appointment.</p><div class="contact-detail"><span>Phone</span><a href="tel:8148739653">814-873-9653</a></div><div class="contact-detail"><span>Email</span><a href="mailto:info@shadeofgreyweims.com">info@shadeofgreyweims.com</a></div><div class="contact-detail"><span>Visit</span><p>10245 Barton Road<br>Waterford, PA 16441<br>Monday–Saturday, by appointment</p></div></div><div class="form-card">${contactForm()}</div></div></section>`;

const pages = { home, puppies, about, 'breed-info': breedInfo, adoption, faq, contact };
function currentRoute() {
  const raw = location.hash.replace(/^#\/?/, '').split(/[?&]/)[0];
  return pages[raw] ? raw : 'home';
}
function render() {
  const route = currentRoute();
  document.getElementById('app').innerHTML = pages[route]();
  document.querySelectorAll('[data-route]').forEach(link => {
    link.classList.toggle('active', link.dataset.route === route);
    if (link.dataset.route === route) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.getElementById('nav').classList.remove('open');
  document.getElementById('menu').setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
  document.querySelectorAll('.contact-form').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    form.querySelector('.form-notice').textContent = 'Thank you for reaching out. Please call us if you need a quick response.';
    form.reset();
  }));
}
document.getElementById('menu').addEventListener('click', event => {
  const open = document.getElementById('nav').classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});
window.addEventListener('hashchange', render);
render();
