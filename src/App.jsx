import { useEffect, useRef, useState } from 'react'
import './App.css'

const photo = (id, width = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

const stays = [
  { number: '01', name: 'Deluxe Ocean Room', size: '45 sqm', price: 420, image: 'photo-1571896349842-33c89424de2d', details: 'A private balcony frames the changing blues of the Sibuyan Sea. Thoughtful natural materials and generous light make this a quietly restorative island hideaway.', features: ['King bed', 'Ocean view', 'Private balcony', 'Rain shower', 'Mini bar', 'Wi-Fi'] },
  { number: '02', name: 'Premier Beachfront Suite', size: '78 sqm', price: 680, image: 'photo-1611892440504-42a792e24d32', details: 'Wake to the sound of the shore in an expansive suite with its own terrace, a separate living room and the beach just beyond your door.', features: ['King bed', 'Separate living room', 'Private terrace', 'Direct beach access', 'Freestanding bathtub', 'Butler service'] },
  { number: '03', name: 'Azurea Private Villa', size: '120 sqm', price: 960, image: 'photo-1613490493576-7fde63acd811', details: 'A garden-wrapped sanctuary with a private pool, outdoor shower and dedicated butler. Made for unhurried days in your own corner of Boracay.', features: ['Private pool', 'Ocean view', 'Private garden', 'Outdoor shower', 'Private dining', 'Butler service'] },
  { number: '04', name: 'Presidential Ocean Villa', size: '220 sqm', price: 1480, image: 'photo-1600607687939-ce8a6c25118c', details: 'An exceptional private residence with room to gather, a sweeping ocean terrace and a private infinity pool made for long sunset evenings.', features: ['Private infinity pool', 'Two bedrooms', 'Dining room', 'Ocean terrace', 'Personal butler', 'Private airport transfer'] },
]

const gallery = [
  { label: 'THE SHORE', image: 'photo-1500375592092-40eb2168fd21' },
  { label: 'VILLA LIVING', image: 'photo-1613490493576-7fde63acd811' },
  { label: 'SLOW MORNINGS', image: 'photo-1571896349842-33c89424de2d' },
  { label: 'AT THE TABLE', image: 'photo-1414235077428-338989a2e8c0' },
  { label: 'THE SPA', image: 'photo-1540555700478-4be289fbecef' },
  { label: 'GOLDEN HOUR', image: 'photo-1473116763249-2faaef81ccda' },
]

const experiences = [
  { title: 'Private sunset sail', note: 'Aboard a traditional paraw', time: '2 hours', image: 'photo-1500375592092-40eb2168fd21' },
  { title: 'A quieter shore', note: 'A picnic made just for you', time: 'Half day', image: 'photo-1507525428034-b723cf961d3e' },
  { title: 'Under the surface', note: 'Explore the island reef', time: '3 hours', image: 'photo-1544551763-46a013bb70d5' },
]

const faqs = [
  ['What time is check-in and check-out?', 'Check-in is from 3:00 PM and check-out is by 12:00 PM. Early arrival and late departure can be arranged subject to availability.'],
  ['Do you arrange airport transfers?', 'Yes. Our concierge can coordinate a private van and boat transfer from Caticlan Airport, with VIP arrival assistance.'],
  ['How far are you from White Beach?', 'White Beach is a short ride from the resort. Our team can arrange a transfer or share the best route for your plans.'],
  ['Are private villas and family stays available?', 'Yes. We offer private villas and can help arrange adjoining rooms, family activities and in-room amenities for younger guests.'],
  ['Can you plan a honeymoon or wedding?', 'Our team can tailor honeymoon moments, intimate beach dinners and destination celebrations to your vision.'],
]

function VideoBackdrop({ src, poster, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '180px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`video-backdrop ${className}`} style={{ backgroundImage: `url(${poster})` }}>
      {visible && <video autoPlay muted loop playsInline poster={poster} aria-hidden="true">
        {/* Replace this source with a local /videos/*.mp4 file or a hosted video URL. */}
        <source src={src} type="video/mp4" />
      </video>}
    </div>
  )
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [booking, setBooking] = useState(() => {
    const tomorrow = new Date()
    const after = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    after.setDate(after.getDate() + 4)
    return {
      checkIn: tomorrow.toISOString().slice(0, 10),
      checkOut: after.toISOString().slice(0, 10),
      guests: '2',
      rooms: '1',
    }
  })
  const [availability, setAvailability] = useState(false)
  const [selectedStay, setSelectedStay] = useState(null)
  const [activePhoto, setActivePhoto] = useState(null)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState(0)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('modal-open', Boolean(availability || selectedStay || activePhoto || conciergeOpen))
    return () => document.body.classList.remove('modal-open')
  }, [availability, selectedStay, activePhoto, conciergeOpen])

  const checkAvailability = (event) => {
    event.preventDefault()
    if (!booking.checkIn || !booking.checkOut || booking.checkOut <= booking.checkIn) {
      setNotice('Please choose a check-out date after your arrival.')
      return
    }
    setNotice('')
    localStorage.setItem('azurea_recent_search', JSON.stringify(booking))
    setAvailability(true)
  }

  const submitLocal = (event, key, message) => {
    event.preventDefault()
    const formData = Object.fromEntries(new FormData(event.currentTarget).entries())
    const saved = JSON.parse(localStorage.getItem(key) || '[]')
    localStorage.setItem(key, JSON.stringify([...saved, { ...formData, submittedAt: new Date().toISOString() }]))
    event.currentTarget.reset()
    setNotice(message)
    window.setTimeout(() => setNotice(''), 5000)
  }

  const reserve = (stay) => {
    const reservations = JSON.parse(localStorage.getItem('azurea_bookings') || '[]')
    localStorage.setItem('azurea_bookings', JSON.stringify([...reservations, { room: stay.name, ...booking, guests: Number(booking.guests), rooms: Number(booking.rooms), createdAt: new Date().toISOString() }]))
    setAvailability(false)
    setSelectedStay(null)
    setNotice('Your request has been saved. Our reservations team will be in touch to confirm your stay.')
    window.setTimeout(() => setNotice(''), 6000)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="wordmark" href="#home" onClick={closeMenu}>AZUREA<span>BORACAY</span></a>
        <nav className={menuOpen ? 'nav-open' : ''} aria-label="Main navigation">
          <a href="#stay" onClick={closeMenu}>Stay</a><a href="#experiences" onClick={closeMenu}>Experiences</a><a href="#dining" onClick={closeMenu}>Dining</a><a href="#wellness" onClick={closeMenu}>Wellness</a><a href="#celebrate" onClick={closeMenu}>Celebrate</a><a href="#journal" onClick={closeMenu}>Journal</a>
          <a className="mobile-book-link" href="#booking" onClick={closeMenu}>Book your stay <span>↗</span></a>
        </nav>
        <a className="header-book" href="#booking">Book your stay <span>↗</span></a>
        <button className={`menu-toggle ${menuOpen ? 'menu-active' : ''}`} type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span></span><span></span></button>
      </header>

      <main>
        <section className="hero" id="home">
          <VideoBackdrop className="hero-video" src="/videos/15540961_3840_2160_60fps.mp4" poster={photo('photo-1500375592092-40eb2168fd21', 2200)} />
          <div className="hero-shade"></div>
          <div className="hero-content"><p className="eyebrow hero-eyebrow">BORACAY ISLAND · PHILIPPINES</p><h1>Where the island<br /><em>becomes your own.</em></h1><p className="hero-copy">A quieter kind of escape, shaped by the sea and the warmth of Filipino hospitality.</p><a className="button button-light" href="#booking">Discover Azurea <span>↗</span></a></div>
          <a className="scroll-cue" href="#intro"><span></span>Scroll to discover</a><div className="hero-index"><span>11°58' N</span><span>121°55' E</span></div><div className="hero-side-note">A PRIVATE ISLAND STATE OF MIND</div>
        </section>

        <section className="booking-wrap" id="booking"><form className="booking-bar" onSubmit={checkAvailability}>
          <label><span>Arrival</span><input aria-label="Check-in date" type="date" required value={booking.checkIn} onChange={(event) => setBooking({ ...booking, checkIn: event.target.value })} /></label>
          <label><span>Departure</span><input aria-label="Check-out date" type="date" required min={booking.checkIn} value={booking.checkOut} onChange={(event) => setBooking({ ...booking, checkOut: event.target.value })} /></label>
          <label><span>Guests</span><select aria-label="Guests" value={booking.guests} onChange={(event) => setBooking({ ...booking, guests: event.target.value })}><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option></select></label>
          <label><span>Rooms</span><select aria-label="Rooms" value={booking.rooms} onChange={(event) => setBooking({ ...booking, rooms: event.target.value })}><option value="1">1 room</option><option value="2">2 rooms</option><option value="3">3 rooms</option></select></label>
          <button className="button button-dark" type="submit">Check availability <span>↗</span></button>
        </form>{notice && <p className="notice" role="status">{notice}</p>}</section>

        <section className="intro section-pad" id="intro"><div className="intro-kicker"><span className="eyebrow">A PLACE APART</span><span className="fine-line"></span><span>01 / 06</span></div><div className="intro-body"><h2>Some places ask<br />you to <em>slow down.</em></h2><div className="intro-text"><p>On the quieter edge of Boracay, a considered island retreat unfolds between tropical gardens and the open sea.</p><p>Here, each day finds its own rhythm: a long breakfast, salt on your skin, the last light falling softly over the water.</p><a className="text-link" href="#experiences">The Azurea feeling <span>↗</span></a></div></div><figure className="intro-image"><img src="/videos/pexels-mikhail-nilov-9400917.jpg" alt="Clear island water meeting the shore" loading="lazy"/><figcaption><span>THE EDGE OF THE EVERYDAY</span><span>BORACAY, PHILIPPINES</span></figcaption></figure></section>

        <section className="stay-section section-pad" id="stay"><div className="section-heading"><div><p className="eyebrow">A ROOM OF YOUR OWN</p><h2>Stay <em>beautifully.</em></h2></div><p>Private spaces designed around the rhythm of the island. Find your own way to be here.</p></div><div className="stay-grid">{stays.map((stay) => <article className="stay-card" key={stay.number}><button className="stay-image" type="button" onClick={() => setSelectedStay(stay)} aria-label={`Explore ${stay.name}`}><img src={photo(stay.image, 1000)} alt={stay.name} loading="lazy"/><span className="image-index">{stay.number}</span><span className="image-arrow">↗</span></button><div className="stay-card-meta"><span>{stay.size}</span><span>From ${stay.price.toLocaleString()} / night</span></div><div className="stay-card-title"><h3>{stay.name}</h3><button type="button" aria-label={`View ${stay.name}`} onClick={() => setSelectedStay(stay)}>↗</button></div><p>{stay.features.slice(0, 3).join(' · ')}</p></article>)}</div><div className="center-link"><a className="button button-outline" href="#booking">Find your stay <span>↗</span></a></div></section>

        <section className="film-section" id="experiences"><VideoBackdrop className="film-backdrop" src="/videos/resort.mp4" poster={photo('photo-1473116763249-2faaef81ccda', 2000)}/><div className="film-shade"></div><div className="film-copy"><p className="eyebrow">MADE OF ISLAND MOMENTS</p><h2>The island,<br /><em>unhurried.</em></h2><p>From first light on the water to the last glow of sunset, let the day take the shape it wants.</p><a className="button button-light" href="#moments">Find your moment <span>↗</span></a></div><span className="film-caption">A SENSE OF SOMEWHERE ELSE · 01:24</span></section>

        <section className="moments section-pad" id="moments"><div className="section-heading"><div><p className="eyebrow">FOLLOW YOUR CURIOSITY</p><h2>Days that <em>stay with you.</em></h2></div><a className="text-link" href="#contact">Let us arrange it <span>↗</span></a></div><div className="moment-grid">{experiences.map((item, index) => <article className="moment-card" key={item.title}><button className="moment-image" type="button" onClick={() => setActivePhoto(index)}><img src={photo(item.image, 1000)} alt={item.title} loading="lazy"/><span>0{index + 1}</span><i>↗</i></button><div className="moment-meta"><h3>{item.title}</h3><span>{item.time}</span></div><p>{item.note}</p></article>)}</div><div className="experience-ribbon"><span>PRIVATE BEACH</span><i>✳</i><span>ISLAND HOPPING</span><i>✳</i><span>SUNSET SAILING</span><i>✳</i><span>BAREFOOT DINING</span><i>✳</i><span>PRIVATE PICNICS</span></div></section>

        <section className="split-feature" id="wellness"><div className="split-image"><img src={photo('photo-1540555700478-4be289fbecef', 1400)} alt="A serene spa retreat framed in tropical greenery" loading="lazy"/><span className="vertical-label">THE AZUREA WELLNESS HOUSE</span></div><div className="split-content"><p className="eyebrow">A LITTLE MORE SPACE TO BREATHE</p><h2>Return to<br /><em>yourself.</em></h2><p>Time slows in a garden sanctuary devoted to restoration. Thoughtful rituals, local botanicals and the quiet expertise of our therapists invite you to settle in.</p><ul className="feature-list"><li>Island-inspired massage</li><li>Private spa rituals for two</li><li>Morning yoga & meditation</li><li>Sauna, steam & stillness</li></ul><a className="text-link" href="#contact">Discover wellness <span>↗</span></a></div></section>

        <section className="dining-section" id="dining"><div className="dining-copy"><p className="eyebrow">GATHER AROUND THE TABLE</p><h2>Salt, fire<br />& <em>something good.</em></h2><p>At Aurelia, the abundance of the Philippine coast meets the generosity of a long island lunch. Familiar ingredients, seen in a new light.</p><div className="dining-details"><span>Breakfast · Lunch · Dinner</span><span>Coastal Filipino cuisine</span><span>Private dining by the sea</span></div><a className="button button-outline" href="#contact">Reserve a table <span>↗</span></a></div><div className="dining-image"><img src={photo('photo-1414235077428-338989a2e8c0', 1400)} alt="An intimate candlelit dining experience" loading="lazy"/><span className="image-caption">AURELIA · ISLAND TABLE</span></div></section>

        <section className="gallery-section section-pad" id="gallery"><div className="section-heading"><div><p className="eyebrow">A COLLECTION OF FEELINGS</p><h2>Postcards from <em>Azurea.</em></h2></div><span className="gallery-count">THE ISLAND, THROUGH OUR EYES · 2026</span></div><div className="gallery-grid">{gallery.map((item, index) => <button type="button" className={`gallery-item gallery-item-${index + 1}`} key={item.label} onClick={() => setActivePhoto(index)}><img src={photo(item.image, 1100)} alt={item.label.toLowerCase()} loading="lazy"/><span>{item.label}</span><i>↗</i></button>)}</div></section>

        <section className="celebrate-section" id="celebrate"><div className="celebrate-image"><img src={photo('photo-1519741497674-611481863552', 1800)} alt="An intimate ceremony set beside the sea" loading="lazy"/></div><div className="celebrate-shade"></div><div className="celebrate-content"><p className="eyebrow">FOR THE DAYS THAT MEAN THE MOST</p><h2>Your story,<br /><em>in island light.</em></h2><p>A barefoot ceremony, a long-table dinner beneath the palms, a celebration that feels entirely like you. We’ll take care of the details.</p><a className="button button-light" href="#contact">Begin planning <span>↗</span></a></div><span className="celebrate-note">WEDDINGS · GATHERINGS · THE BEAUTIFUL IN-BETWEEN</span></section>

        <section className="offers-section section-pad"><div className="section-heading"><div><p className="eyebrow">A REASON TO STAY A LITTLE LONGER</p><h2>Made for <em>getting away.</em></h2></div><a className="text-link" href="#booking">View all stays <span>↗</span></a></div><div className="offer-grid"><article><span className="offer-number">01 / THE LONG WEEKEND</span><h3>Island, at your pace.</h3><p>Three nights, daily breakfast, a private arrival and a bottle of something chilled.</p><a href="#booking">Explore the stay <span>↗</span></a></article><article><span className="offer-number">02 / JUST THE TWO OF YOU</span><h3>A little more romance.</h3><p>A private dinner by the sea, a couples ritual and an evening sail into the sunset.</p><a href="#booking">Explore the stay <span>↗</span></a></article><article><span className="offer-number">03 / YOUR OWN HORIZON</span><h3>The villa life.</h3><p>A private pool, a dedicated butler and all the room in the world to do nothing.</p><a href="#booking">Explore the stay <span>↗</span></a></article></div></section>

        <section className="quote-section"><span className="quote-mark">“</span><blockquote>We came for the sea.<br />We left with <em>a softer way of being.</em></blockquote><p>GUEST BOOK · PREMIER BEACHFRONT SUITE</p><div className="quote-stars">★★★★★</div></section>

        <section className="faq-contact section-pad" id="contact"><div className="faq-column"><p className="eyebrow">A FEW THINGS TO KNOW</p><h2>Before you <em>arrive.</em></h2><div className="faq-list">{faqs.map(([question, answer], index) => <div className={`faq-item ${faqOpen === index ? 'faq-active' : ''}`} key={question}><button type="button" aria-expanded={faqOpen === index} onClick={() => setFaqOpen(faqOpen === index ? -1 : index)}>{question}<span>{faqOpen === index ? '−' : '+'}</span></button>{faqOpen === index && <p>{answer}</p>}</div>)}</div><div className="location-note"><span className="eyebrow">FIND YOUR WAY HERE</span><p>Boracay Island<br />Malay, Aklan, Philippines</p><a className="text-link" href="https://maps.google.com/?q=Boracay+Island" target="_blank" rel="noreferrer">Open in maps <span>↗</span></a></div></div><div className="contact-column"><p className="eyebrow">A NOTE TO OUR TEAM</p><h2>Let’s make it <em>yours.</em></h2><p>Tell us a little about the escape you have in mind. We’ll take it from here.</p><form className="inquiry-form" onSubmit={(event) => submitLocal(event, 'azurea_inquiries', 'Thank you. Your Azurea experience begins here.')}><label>Your name<input required name="name" placeholder="Full name" autoComplete="name" /></label><div className="form-row"><label>Email address<input required type="email" name="email" placeholder="you@example.com" autoComplete="email" /></label><label>Arrival date<input type="date" name="arrival" /></label></div><label>What are you dreaming of?<select name="interest"><option>Choose an interest</option><option>A private island stay</option><option>A celebration or wedding</option><option>Dining & wellness</option><option>Something else</option></select></label><label>A note for us<textarea name="message" rows="3" placeholder="Anything you'd like us to know" /></label><button className="button button-dark" type="submit">Send an inquiry <span>↗</span></button></form></div></section>

        <section className="journal-section" id="journal"><div><p className="eyebrow">LET THE ISLAND FIND YOU</p><h2>The Azurea <em>journal.</em></h2><p>Island stories, thoughtful offers and occasional reasons to disappear for a while.</p></div><form className="newsletter-form" onSubmit={(event) => submitLocal(event, 'azurea_newsletter', 'You’re on the list. Look out for a little island light in your inbox.')}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" name="email" placeholder="Your email address" required/><button aria-label="Subscribe to the Azurea Journal" type="submit">Subscribe <span>↗</span></button></form></section>
      </main>

      <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><a className="wordmark" href="#home">AZUREA<span>BORACAY</span></a><p>Luxury, in step with the island.</p><span>BORACAY ISLAND · PHILIPPINES</span></div><div className="footer-links"><div><span className="eyebrow">DISCOVER</span><a href="#stay">Stay</a><a href="#experiences">Experiences</a><a href="#dining">Dining</a><a href="#wellness">Wellness</a></div><div><span className="eyebrow">CONNECT</span><a href="#celebrate">Weddings & events</a><a href="#contact">Contact</a><a href="mailto:reservations@azureaboracay.com">Email our team</a><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram ↗</a></div></div></div><div className="footer-bottom"><span>© 2026 Azurea Boracay. All rights reserved.</span><span>Malay, Aklan · Philippines</span><a href="#home">Back to the beginning ↑</a></div></footer>

      <button className="concierge-trigger" type="button" onClick={() => setConciergeOpen(true)}><span className="concierge-dot"></span>Concierge</button><a className="mobile-sticky-book" href="#booking">Book your stay <span>↗</span></a>

      {availability && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setAvailability(false)}><section className="availability-modal modal-panel" role="dialog" aria-modal="true" aria-labelledby="availability-title"><button className="modal-close" aria-label="Close" onClick={() => setAvailability(false)}>×</button><p className="eyebrow">YOUR ISLAND ESCAPE</p><h2 id="availability-title">A room for <em>you.</em></h2><p className="modal-intro">{booking.checkIn} — {booking.checkOut} · {booking.guests} guests · {booking.rooms} room{booking.rooms === '1' ? '' : 's'}</p><div className="availability-list">{stays.map((stay) => <article key={stay.name}><img src={photo(stay.image, 400)} alt=""/><div><h3>{stay.name}</h3><p>{stay.size} · Breakfast included · Flexible cancellation</p><span>From ${stay.price.toLocaleString()} / night</span></div><button className="button button-dark" onClick={() => reserve(stay)}>Reserve <span>↗</span></button></article>)}</div><p className="modal-footnote">Rates shown are indicative and include applicable taxes. Reservation requests are confirmed by our team.</p></section></div>}

      {selectedStay && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedStay(null)}><section className="room-modal modal-panel" role="dialog" aria-modal="true" aria-labelledby="room-title"><button className="modal-close" aria-label="Close" onClick={() => setSelectedStay(null)}>×</button><img className="room-modal-image" src={photo(selectedStay.image, 1400)} alt={selectedStay.name}/><div className="room-modal-copy"><p className="eyebrow">{selectedStay.size} · FROM ${selectedStay.price.toLocaleString()} / NIGHT</p><h2 id="room-title">{selectedStay.name}</h2><p>{selectedStay.details}</p><div className="amenity-list">{selectedStay.features.map((feature) => <span key={feature}>{feature}</span>)}</div><button className="button button-dark" onClick={() => { setSelectedStay(null); setAvailability(true) }}>Check dates & reserve <span>↗</span></button></div></section></div>}

      {activePhoto !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Resort image gallery" onClick={() => setActivePhoto(null)}><button className="lightbox-close" aria-label="Close gallery">×</button><button className="lightbox-prev" aria-label="Previous image" onClick={(event) => { event.stopPropagation(); setActivePhoto((activePhoto + gallery.length - 1) % gallery.length) }}>←</button><img src={photo(gallery[activePhoto % gallery.length].image, 2000)} alt={gallery[activePhoto % gallery.length].label} onClick={(event) => event.stopPropagation()}/><button className="lightbox-next" aria-label="Next image" onClick={(event) => { event.stopPropagation(); setActivePhoto((activePhoto + 1) % gallery.length) }}>→</button><span>{gallery[activePhoto % gallery.length].label} · {String(activePhoto % gallery.length + 1).padStart(2, '0')} / 06</span></div>}

      {conciergeOpen && <div className="modal-backdrop concierge-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setConciergeOpen(false)}><section className="concierge-panel" role="dialog" aria-modal="true" aria-labelledby="concierge-title"><div className="concierge-head"><div><span className="concierge-dot"></span><span className="eyebrow">HERE WHEN YOU NEED US</span></div><button aria-label="Close concierge" onClick={() => setConciergeOpen(false)}>×</button></div><h2 id="concierge-title">How may we<br/><em>make your day?</em></h2><p>Our island team is happy to help.</p><div className="concierge-options"><a href="#booking" onClick={() => setConciergeOpen(false)}>Plan a stay <span>↗</span></a><a href="#dining" onClick={() => setConciergeOpen(false)}>A table at Aurelia <span>↗</span></a><a href="#wellness" onClick={() => setConciergeOpen(false)}>Wellness & spa <span>↗</span></a><a href="#experiences" onClick={() => setConciergeOpen(false)}>Island experiences <span>↗</span></a><a href="#celebrate" onClick={() => setConciergeOpen(false)}>Weddings & events <span>↗</span></a></div><a className="concierge-contact" href="mailto:reservations@azureaboracay.com">Write to our concierge <span>↗</span></a></section></div>}
    </>
  )
}

export default App