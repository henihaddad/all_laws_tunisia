import React, { useEffect, useMemo, useRef, useState } from 'react';
import './LandingPage.css';
import LawsLibrary from './LawsLibrary';

const LandingPage = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const paletteInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const onKey = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      if ((isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        setTimeout(() => paletteInputRef.current?.focus(), 0);
      }
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const particles = useMemo(() => (
    Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${8 + Math.random() * 4}s`,
    }))
  ), []);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const q = new FormData(form).get('q');
    if (q && typeof q === 'string') {
      // For now, reflect the query in the hash and scroll to features
      const url = new URL(window.location.href);
      url.hash = `search=${encodeURIComponent(q)}`;
      window.history.replaceState({}, '', url.toString());
    }
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const suggestions = [
    'Lois de Finances 2020-2025',
    'Code des obligations et des contrats',
    'Droit des sociétés',
    'Procédure civile et commerciale',
    'Droit du travail',
    'Marchés publics',
    'Protection des données (RGPD/Tunisie)'
  ];

  return (
    <div className={`landing-page${isDark ? ' dark' : ''}`}>
      <a href="#main" className="skip-link">Aller au contenu principal</a>
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <div className="nav-logo">
            <h2>🇹🇳 Toutes les Lois Tunisiennes</h2>
          </div>
          <div className="nav-links">
            <a href="#laws">Bibliothèque</a>
            <a href="#features">Fonctionnalités</a>
            <a href="#about">À propos</a>
            <a href="#contact">Contact</a>
            <span className="kbd-hint" aria-hidden="true">⌘K</span>
            <button
              type="button"
              className="theme-toggle"
              aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
              onClick={() => setIsDark((v) => !v)}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" id="main" aria-label="En-tête de la page">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="gradient-mesh" aria-hidden="true"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Plateforme Complète pour Toutes les Lois Tunisiennes
          </h1>
          <p className="hero-subtitle">
            Découvrez et consultez toutes les législations et lois tunisiennes en un seul endroit.
            Facilité de recherche et d'accès aux informations juridiques fiables.
          </p>
          <form className="hero-search" role="search" onSubmit={onSearchSubmit} aria-label="Recherche dans les lois">
            <input
              type="search"
              name="q"
              placeholder="Rechercher une loi, un décret, un mot-clé…"
              aria-label="Votre requête de recherche"
              autoComplete="off"
            />
            <button className="btn btn-primary" type="submit">Rechercher</button>
          </form>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => setPaletteOpen(true)}>Commencer la Recherche</button>
            <button className="btn btn-secondary" onClick={() => document.getElementById('laws')?.scrollIntoView({ behavior: 'smooth' })}>Explorer les Lois</button>
          </div>
          <div className="hero-metrics" aria-label="Indicateurs clés">
            <div className="metric"><span>+1 200</span> textes consolidés</div>
            <div className="metric"><span>95%</span> couverture des domaines</div>
            <div className="metric"><span>≈2s</span> temps de réponse moyen</div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            <div className="book-icon">📚</div>
            <p>Bibliothèque Numérique des Lois</p>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trustbar" aria-label="Ils nous font confiance">
        <div className="container trustbar-inner">
          <span className="trustbar-title">Plébiscité par les cabinets et institutions</span>
          <div className="logo-row" aria-hidden="true">
            <div className="logo-pill">BARREAU</div>
            <div className="logo-pill">COUR DE CASSATION</div>
            <div className="logo-pill">CABINET PREMIUM</div>
            <div className="logo-pill">UNIVERSITÉ</div>
            <div className="logo-pill">MINISTÈRE</div>
          </div>
        </div>
      </section>

      {/* Laws Library Section */}
      <LawsLibrary isDark={isDark} />

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Fonctionnalités Principales</h2>
          <div className="features-grid">
            <div className="feature-card" style={{"--card-index": 0}}>
              <div className="feature-icon">🔍</div>
              <h3>Recherche Avancée</h3>
              <p>Recherchez dans les lois facilement grâce à un moteur de recherche intelligent qui vous aide à trouver ce que vous cherchez</p>
            </div>
            <div className="feature-card" style={{"--card-index": 1}}>
              <div className="feature-icon">📖</div>
              <h3>Lecture Facile</h3>
              <p>Parcourez les lois dans un format clair et organisé qui facilite la lecture et la compréhension</p>
            </div>
            <div className="feature-card" style={{"--card-index": 2}}>
              <div className="feature-icon">⚡</div>
              <h3>Vitesse Élevée</h3>
              <p>Accès rapide aux informations sans avoir besoin de rechercher dans plusieurs sources</p>
            </div>
            <div className="feature-card" style={{"--card-index": 3}}>
              <div className="feature-icon">🔄</div>
              <h3>Mise à Jour Continue</h3>
              <p>Nous vous tenons constamment informé des modifications et des nouvelles lois</p>
            </div>
            <div className="feature-card" style={{"--card-index": 4}}>
              <div className="feature-icon">📱</div>
              <h3>Réactif</h3>
              <p>Utilisez le site sur tous les appareils et plateformes facilement</p>
            </div>
            <div className="feature-card" style={{"--card-index": 5}}>
              <div className="feature-icon">🆓</div>
              <h3>Gratuit</h3>
              <p>Accès gratuit complet à toutes les lois et législations</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>À Propos du Site</h2>
              <p>
                La plateforme "Toutes les Lois Tunisiennes" est un projet numérique visant à unifier et organiser
                toutes les législations et lois tunisiennes en un seul endroit. Nous visons à faciliter l'accès
                aux informations juridiques pour les citoyens, les professionnels et les étudiants.
              </p>
              <p>
                Cette plateforme a été créée pour être une référence fiable et complète des lois tunisiennes
                avec possibilité de recherche avancée et de navigation facile.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Lois</div>
              </div>
              <div className="stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Domaines Juridiques</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Disponible</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" aria-label="Témoignages">
        <div className="container">
          <h2 className="section-title">Ce que disent les professionnels</h2>
          <div className="testimonials-grid">
            <figure className="testimonial">
              <blockquote>
                « Une référence fiable et rapide. Mes recherches sont 3x plus efficaces. »
              </blockquote>
              <figcaption>
                Me Amal K., Avocate en droit des affaires
              </figcaption>
            </figure>
            <figure className="testimonial">
              <blockquote>
                « L’UX est irréprochable. Les textes consolidés m’évitent des erreurs. »
              </blockquote>
              <figcaption>
                Me Hatem B., Juriste senior
              </figcaption>
            </figure>
            <figure className="testimonial">
              <blockquote>
                « Adoption facile dans mon cabinet. Les jeunes collaborateurs adorent. »
              </blockquote>
              <figcaption>
                Me Sana R., Managing Partner
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works" aria-label="Comment ça marche">
        <div className="container">
          <h2 className="section-title">En 3 étapes</h2>
          <ol className="steps">
            <li className="step"><span className="step-badge">1</span> Tapez un mot-clé (ex: « sociétés »)</li>
            <li className="step"><span className="step-badge">2</span> Filtrez par date, nature, domaine</li>
            <li className="step"><span className="step-badge">3</span> Ouvrez le texte consolidé et citez</li>
          </ol>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Contactez-Nous</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>info@laws-tunisia.tn</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Téléphone</h4>
                  <p>+216 XX XXX XXX</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Adresse</h4>
                  <p>Tunis, République Tunisienne</p>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <h3>Envoyez-nous un Message</h3>
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Votre Nom" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Votre Email" required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Votre Message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Envoyer</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Toutes les Lois Tunisiennes</h3>
              <p>Plateforme complète pour les législations tunisiennes</p>
              <div className="footer-badges">
                <span className="badge">🇹🇳 Officiel</span>
                <span className="badge">🔒 Sécurisé</span>
                <span className="badge">⚡ Rapide</span>
              </div>
            </div>
            <div className="footer-section">
              <h4>Liens Rapides</h4>
              <ul>
                <li><a href="#laws">Bibliothèque Juridique</a></li>
                <li><a href="#features">Fonctionnalités</a></li>
                <li><a href="#about">À Propos</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#">Politique de Confidentialité</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Suivez-nous</h4>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">📘</a>
                <a href="#" className="social-link" aria-label="Twitter">🐦</a>
                <a href="#" className="social-link" aria-label="LinkedIn">💼</a>
                <a href="#" className="social-link" aria-label="Instagram">📷</a>
              </div>
              <div className="newsletter">
                <h5>Restez Informé</h5>
                <div className="newsletter-input">
                  <input type="email" placeholder="Votre email" />
                  <button className="btn-newsletter">S'abonner</button>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-legal">
              <p>&copy; 2024 Toutes les Lois Tunisiennes. Tous droits réservés.</p>
              <div className="footer-links">
                <a href="#">Mentions Légales</a>
                <a href="#">CGU</a>
                <a href="#">Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll Indicator */}
      <div className="scroll-indicator" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}></div>

      {/* Particle Effects Container */}
      <div className="particles-container" aria-hidden="true">
        {particles.map((p, i) => (
          <div key={i} className="particle" style={p} />
        ))}
      </div>

      {/* CTA Banner */}
      <div className="cta-banner" role="region" aria-label="Inscription gratuite">
        <div className="container cta-inner">
          <div className="cta-text">
            <h3>Accélérez vos recherches juridiques</h3>
            <p>Essayez gratuitement. Sans carte. Annulable à tout moment.</p>
          </div>
          <div className="cta-actions">
            <button className="btn btn-primary" onClick={() => setPaletteOpen(true)}>Démarrer maintenant</button>
            <button className="btn btn-secondary">Voir une démo</button>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      {paletteOpen && (
        <div className="palette-overlay" role="dialog" aria-modal="true" aria-labelledby="palette-title">
          <div className="palette">
            <div className="palette-header">
              <div className="palette-title" id="palette-title">Recherche rapide</div>
              <button className="palette-close" aria-label="Fermer" onClick={() => setPaletteOpen(false)}>✕</button>
            </div>
            <div className="palette-search">
              <input
                ref={paletteInputRef}
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="Ex: Procédure civile, sociétés, marchés publics…"
                aria-label="Requête"
              />
              <div className="palette-hint">Entrée pour rechercher • Échap pour fermer</div>
            </div>
            <ul className="palette-list" role="listbox">
              {(paletteQuery ? suggestions.filter(s => s.toLowerCase().includes(paletteQuery.toLowerCase())) : suggestions).map((s, i) => (
                <li key={i} className="palette-item" role="option" onClick={() => {
                  setPaletteQuery(s);
                  setPaletteOpen(false);
                  const form = document.querySelector('.hero-search');
                  if (form) {
                    const input = form.querySelector('input[name="q"]');
                    if (input) input.value = s;
                    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                  }
                }}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <button
        type="button"
        className="back-to-top"
        aria-label="Revenir en haut de la page"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >↑</button>
    </div>
  );
};

export default LandingPage;
