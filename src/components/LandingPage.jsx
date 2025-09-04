import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <div className="nav-logo">
            <h2>🇹🇳 Toutes les Lois Tunisiennes</h2>
          </div>
          <div className="nav-links">
            <a href="#features">Fonctionnalités</a>
            <a href="#about">À propos</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Plateforme Complète pour Toutes les Lois Tunisiennes
          </h1>
          <p className="hero-subtitle">
            Découvrez et consultez toutes les législations et lois tunisiennes en un seul endroit.
            Facilité de recherche et d'accès aux informations juridiques fiables.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Commencer la Recherche</button>
            <button className="btn btn-secondary">Explorer les Lois</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            <div className="book-icon">📚</div>
            <p>Bibliothèque Numérique des Lois</p>
          </div>
        </div>
      </section>

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
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
