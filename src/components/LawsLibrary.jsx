import React, { useState, useMemo, useEffect, useRef } from 'react';
import './LawsLibrary.css';
import allData from '../data/all_data.json';

const LawsLibrary = ({ isDark }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [globalSearchMode, setGlobalSearchMode] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({ section: 'all', year: 'all', status: 'all' });
  const [sortBy, setSortBy] = useState('year-desc');
  const [activeCategory, setActiveCategory] = useState('finance');
  const [previewModal, setPreviewModal] = useState({ isOpen: false, law: null });
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Create global documents list for search across all sections
  const allDocuments = useMemo(() => {
    const documents = [];
    Object.entries(allData.sections).forEach(([sectionKey, section]) => {
      const sectionDocuments = [];
      
      // Add main laws
      if (section.documents?.main_laws) {
        sectionDocuments.push(...section.documents.main_laws.map((law, index) => ({
          id: law.id || `${sectionKey}_main_${index}`,
          sectionKey,
          sectionTitle: section.title,
          sectionIcon: section.icon,
          year: law.year,
          title: law.title,
          title_ar: law.title_ar,
          status: law.status || 'active',
          publishDate: law.publish_date_formatted || law.year?.toString() || 'N/A',
          size: law.file_size || 'N/A',
          url: law.url,
          highlights: law.highlights || [],
          highlights_ar: law.highlights_ar || [],
          isNew: law.is_new || false,
          type: 'main_law'
        })));
      }
      
      // Add other document types
      if (section.documents?.related_reports) {
        sectionDocuments.push(...section.documents.related_reports.map((law, index) => ({
          id: law.id || `${sectionKey}_report_${index}`,
          sectionKey,
          sectionTitle: section.title,
          sectionIcon: section.icon,
          year: law.year,
          title: law.title,
          title_ar: law.title_ar,
          status: 'active',
          publishDate: law.year?.toString() || 'N/A',
          size: 'N/A',
          url: law.url,
          highlights: ['Rapport officiel'],
          isNew: false,
          type: 'report'
        })));
      }
      
      if (section.documents?.special_laws) {
        sectionDocuments.push(...section.documents.special_laws.map((law, index) => ({
          id: law.id || `${sectionKey}_special_${index}`,
          sectionKey,
          sectionTitle: section.title,
          sectionIcon: section.icon,
          year: law.year,
          title: law.title,
          title_ar: law.title_ar,
          status: 'active',
          publishDate: law.year?.toString() || 'N/A',
          size: 'N/A',
          url: law.url,
          highlights: ['Analyse internationale'],
          isNew: false,
          type: 'special_law'
        })));
      }

      if (section.documents?.international_reports) {
        sectionDocuments.push(...section.documents.international_reports.map((law, index) => ({
          id: law.id || `${sectionKey}_intl_${index}`,
          sectionKey,
          sectionTitle: section.title,
          sectionIcon: section.icon,
          year: law.year,
          title: law.title,
          title_ar: law.title_ar,
          status: 'active',
          publishDate: law.year?.toString() || 'N/A',
          size: 'N/A',
          url: law.url,
          highlights: ['Rapport international'],
          isNew: false,
          type: 'international_report'
        })));
      }
      
      documents.push(...sectionDocuments);
    });
    return documents;
  }, []);

  // Transform JSON data to component format
  const lawsData = useMemo(() => {
    const transformed = {};
    Object.entries(allData.sections).forEach(([key, section]) => {
      // Combine all document types into laws array
      const allDocuments = [];
      
      // Add main laws
      if (section.documents?.main_laws) {
        allDocuments.push(...section.documents.main_laws.map((law, index) => ({
          id: law.id || `${key}_main_${index}`,
          year: law.year,
          title: law.title,
          status: law.status || 'active',
          publishDate: law.publish_date_formatted || law.year?.toString() || 'N/A',
          size: law.file_size || 'N/A',
          url: law.url,
          highlights: law.highlights || [],
          isNew: law.is_new || false
        })));
      }
      
      // Add other document types as laws
      if (section.documents?.related_reports) {
        allDocuments.push(...section.documents.related_reports.map((law, index) => ({
          id: law.id || `${key}_report_${index}`,
          year: law.year,
          title: law.title,
          status: 'active',
          publishDate: law.year?.toString() || 'N/A',
          size: 'N/A',
          url: law.url,
          highlights: ['Rapport officiel'],
          isNew: false
        })));
      }
      
      // Add special laws (for penal code)
      if (section.documents?.special_laws) {
        allDocuments.push(...section.documents.special_laws.map((law, index) => ({
          id: law.id || `${key}_special_${index}`,
          year: law.year,
          title: law.title,
          status: 'active',
          publishDate: law.year?.toString() || 'N/A',
          size: 'N/A',
          url: law.url,
          highlights: ['Analyse internationale'],
          isNew: false
        })));
      }

      // Add international reports (for labor code)
      if (section.documents?.international_reports) {
        allDocuments.push(...section.documents.international_reports.map((law, index) => ({
          id: law.id || `${key}_intl_${index}`,
          year: law.year,
          title: law.title,
          status: 'active',
          publishDate: law.year?.toString() || 'N/A',
          size: 'N/A',
          url: law.url,
          highlights: ['Rapport international'],
          isNew: false
        })));
      }

      transformed[key] = {
        title: section.title,
        icon: section.icon,
        description: section.description,
        status: section.status || 'coming_soon',
        laws: allDocuments,
        supplementary: section.documents?.supplementary_laws?.map((law, index) => ({
          id: law.id || `${key}_supp_${index}`,
          year: law.year,
          title: law.title,
          url: law.url,
          publishDate: law.publish_date_formatted || law.year?.toString()
        })) || []
      };
    });
    return transformed;
  }, []);

  const categories = Object.entries(lawsData).map(([key, value]) => ({
    id: key,
    ...value
  }));

  // Set active category to first available category with laws
  useEffect(() => {
    const availableCategory = categories.find(cat => 
      cat.laws && cat.laws.length > 0 && cat.status !== 'coming_soon'
    );
    if (availableCategory && !lawsData[activeCategory]?.laws?.length) {
      setActiveCategory(availableCategory.id);
    }
  }, [categories, activeCategory, lawsData]);

  // Get search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const suggestions = new Set();
    const searchLower = searchTerm.toLowerCase();
    
    allDocuments.forEach(doc => {
      // Add title matches
      if (doc.title?.toLowerCase().includes(searchLower)) {
        suggestions.add(doc.title);
      }
      if (doc.title_ar?.includes(searchTerm)) {
        suggestions.add(doc.title_ar);
      }
      
      // Add year matches
      if (doc.year?.toString().includes(searchTerm)) {
        suggestions.add(doc.year.toString());
      }
      
      // Add section matches
      if (doc.sectionTitle?.toLowerCase().includes(searchLower)) {
        suggestions.add(doc.sectionTitle);
      }
    });
    
    return Array.from(suggestions).slice(0, 8);
  }, [searchTerm, allDocuments]);

  // Global search function
  const performGlobalSearch = useMemo(() => {
    if (!searchTerm || (!globalSearchMode && !searchTerm.length >= 3)) return [];
    
    const searchLower = searchTerm.toLowerCase();
    const results = [];
    
    allDocuments.forEach(doc => {
      let relevanceScore = 0;
      let matchType = '';
      
      // Exact title match (highest priority)
      if (doc.title?.toLowerCase() === searchLower) {
        relevanceScore = 100;
        matchType = 'exact';
      }
      // Title starts with search term
      else if (doc.title?.toLowerCase().startsWith(searchLower)) {
        relevanceScore = 90;
        matchType = 'starts_with';
      }
      // Title contains search term
      else if (doc.title?.toLowerCase().includes(searchLower)) {
        relevanceScore = 80;
        matchType = 'contains';
      }
      // Arabic title matches
      else if (doc.title_ar?.includes(searchTerm)) {
        relevanceScore = 75;
        matchType = 'arabic';
      }
      // Year match
      else if (doc.year?.toString().includes(searchTerm)) {
        relevanceScore = 60;
        matchType = 'year';
      }
      // Section match
      else if (doc.sectionTitle?.toLowerCase().includes(searchLower)) {
        relevanceScore = 50;
        matchType = 'section';
      }
      // Highlights match
      else if (doc.highlights?.some(h => h.toLowerCase().includes(searchLower))) {
        relevanceScore = 40;
        matchType = 'highlights';
      }
      
      if (relevanceScore > 0) {
        // Apply filters
        let passesFilters = true;
        
        if (selectedFilters.section !== 'all' && doc.sectionKey !== selectedFilters.section) {
          passesFilters = false;
        }
        
        if (selectedFilters.year !== 'all' && doc.year?.toString() !== selectedFilters.year) {
          passesFilters = false;
        }
        
        if (selectedFilters.status !== 'all' && doc.status !== selectedFilters.status) {
          passesFilters = false;
        }
        
        if (passesFilters) {
          results.push({ ...doc, relevanceScore, matchType });
        }
      }
    });
    
    // Sort by relevance, then by year
    return results.sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return b.year - a.year;
    });
  }, [searchTerm, globalSearchMode, selectedFilters, allDocuments]);

  // Get unique years and sections for filters
  const filterOptions = useMemo(() => {
    const years = new Set();
    const sections = new Set();
    const statuses = new Set();
    
    allDocuments.forEach(doc => {
      if (doc.year) years.add(doc.year);
      sections.add({ key: doc.sectionKey, title: doc.sectionTitle });
      if (doc.status) statuses.add(doc.status);
    });
    
    return {
      years: Array.from(years).sort((a, b) => b - a),
      sections: Array.from(sections),
      statuses: Array.from(statuses)
    };
  }, [allDocuments]);

  const currentCategory = lawsData[activeCategory] || { laws: [], supplementary: [] };

  const sortedLaws = useMemo(() => {
    // If in global search mode and we have search results, return those
    if (globalSearchMode && searchTerm) {
      const results = [...performGlobalSearch];
      
      // Apply additional sorting if needed
      switch (sortBy) {
        case 'year-desc':
          results.sort((a, b) => {
            if (a.relevanceScore !== b.relevanceScore) {
              return b.relevanceScore - a.relevanceScore;
            }
            return b.year - a.year;
          });
          break;
        case 'year-asc':
          results.sort((a, b) => {
            if (a.relevanceScore !== b.relevanceScore) {
              return b.relevanceScore - a.relevanceScore;
            }
            return a.year - b.year;
          });
          break;
        default:
          break;
      }
      
      return results;
    }
    
    // Regular category-based search
    if (!currentCategory.laws) return [];
    
    let filtered = currentCategory.laws;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(law => 
        law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        law.year.toString().includes(searchTerm) ||
        law.highlights.some(h => h.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'year-desc':
        sorted.sort((a, b) => b.year - a.year);
        break;
      case 'year-asc':
        sorted.sort((a, b) => a.year - b.year);
        break;
      case 'size':
        sorted.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
        break;
      default:
        break;
    }
    
    return sorted;
  }, [currentCategory, searchTerm, sortBy, globalSearchMode, performGlobalSearch]);

  const openDocument = (law) => {
    console.log(`Opening document: ${law.title}`);
    console.log(`URL: ${law.url}`);
    
    // Open PDF in new tab - browser handles preview/download
    const newWindow = window.open(law.url, '_blank');
    
    // Fallback if popup was blocked
    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
      alert(`Le popup a été bloqué. Veuillez autoriser les popups pour ce site ou cliquez ici pour accéder au document.`);
    }
  };

  const closePreviewModal = () => {
    setPreviewModal({ isOpen: false, law: null });
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Enable global search mode for searches of 3+ characters
    if (value.length >= 3) {
      setGlobalSearchMode(true);
      setShowSuggestions(true);
    } else {
      setGlobalSearchMode(false);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setGlobalSearchMode(true);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({ section: 'all', year: 'all', status: 'all' });
    setSearchTerm('');
    setGlobalSearchMode(false);
    setShowSuggestions(false);
  };

  // Highlight matching text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="search-highlight">{part}</mark> : part
    );
  };

  // Click outside handler for suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="laws-library" id="laws">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">📚</span>
            Bibliothèque Juridique
          </h2>
          <p className="section-subtitle">
            Accédez à la collection complète des lois tunisiennes officielles
          </p>
        </div>

        {/* Categories */}
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-tab ${activeCategory === category.id ? 'active' : ''} ${(!category.laws.length || category.status === 'coming_soon') ? 'disabled' : ''}`}
              onClick={() => (category.laws.length && category.status !== 'coming_soon') && setActiveCategory(category.id)}
              disabled={!category.laws.length || category.status === 'coming_soon'}
            >
              <span className="tab-icon">{category.icon}</span>
              <span className="tab-title">{category.title}</span>
              {category.id === activeCategory && category.laws.length > 0 && (
                <span className="tab-count">{category.laws.length}</span>
              )}
              {(category.laws.length === 0 || category.status === 'coming_soon') && (
                <span className="tab-badge">Bientôt</span>
              )}
              {category.status === 'limited' && category.laws.length > 0 && (
                <span className="tab-badge limited">Limité</span>
              )}
            </button>
          ))}
        </div>

        {/* Active Category Content */}
        {currentCategory && currentCategory.laws && currentCategory.laws.length > 0 ? (
          <>
            {/* Enhanced Search Bar */}
            <div className="search-section">
              <div className="search-container">
                <div className="search-box" ref={searchInputRef}>
                  <input
                    type="text"
                    placeholder={globalSearchMode ? "Recherche globale dans tous les documents..." : "Rechercher dans cette section..."}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                    className={`search-input ${globalSearchMode ? 'global-search' : ''}`}
                  />
                  <span className="search-icon">🔍</span>
                  {searchTerm && (
                    <button 
                      className="clear-search" 
                      onClick={clearFilters}
                      aria-label="Effacer la recherche"
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="search-suggestions" ref={suggestionsRef}>
                    <div className="suggestions-header">Suggestions</div>
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <span className="suggestion-icon">🔍</span>
                        {highlightText(suggestion, searchTerm)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Global Search Indicator */}
              {globalSearchMode && (
                <div className="global-search-indicator">
                  <span className="indicator-icon">🌐</span>
                  Recherche dans toutes les sections
                  <button 
                    className="exit-global-search"
                    onClick={() => {
                      setGlobalSearchMode(false);
                      setSearchTerm('');
                    }}
                  >
                    Revenir à la section
                  </button>
                </div>
              )}
            </div>

            {/* Advanced Filters */}
            {(globalSearchMode || searchTerm) && (
              <div className="filters-bar advanced">
                <div className="filter-group">
                  <label className="filter-label">Section:</label>
                  <select 
                    value={selectedFilters.section} 
                    onChange={(e) => handleFilterChange('section', e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Toutes les sections</option>
                    {filterOptions.sections.map(section => (
                      <option key={section.key} value={section.key}>
                        {section.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Année:</label>
                  <select 
                    value={selectedFilters.year} 
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Toutes les années</option>
                    {filterOptions.years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Statut:</label>
                  <select 
                    value={selectedFilters.status} 
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Tous les statuts</option>
                    {filterOptions.statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'active' ? 'En vigueur' : 'Archive'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="sort-dropdown">
                  <label className="filter-label">Tri:</label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="year-desc">Plus récent</option>
                    <option value="year-asc">Plus ancien</option>
                    <option value="size">Taille du fichier</option>
                  </select>
                </div>

                {(selectedFilters.section !== 'all' || selectedFilters.year !== 'all' || selectedFilters.status !== 'all') && (
                  <button className="clear-filters" onClick={clearFilters}>
                    Effacer les filtres
                  </button>
                )}
              </div>
            )}

            {/* Results Info */}
            <div className="results-info">
              <div className="results-count">
                {sortedLaws.length} {sortedLaws.length === 1 ? 'document' : 'documents'}
                {globalSearchMode && searchTerm && (
                  <span className="search-context"> correspondant à "{searchTerm}"</span>
                )}
              </div>
              {globalSearchMode && (
                <div className="search-tips">
                  💡 Astuce: Utilisez des termes spécifiques pour des résultats plus précis
                </div>
              )}
            </div>

            {/* Laws Grid */}
            {sortedLaws.length > 0 ? (
              <div className="laws-grid">
                {sortedLaws.map((law) => (
                  <div key={law.id} className={`law-card ${law.isNew ? 'new' : ''} ${law.relevanceScore ? 'search-result' : ''}`}>
                    {law.isNew && <span className="new-badge">NOUVEAU</span>}
                    {law.relevanceScore && (
                      <div className="relevance-indicator">
                        {law.matchType === 'exact' && '🎯'}
                        {law.matchType === 'starts_with' && '📍'}
                        {law.matchType === 'contains' && '🔍'}
                        {law.matchType === 'arabic' && '🔤'}
                        {law.matchType === 'year' && '📅'}
                        {law.matchType === 'section' && '📂'}
                        {law.matchType === 'highlights' && '🏷️'}
                      </div>
                    )}
                    
                    <div className="law-header">
                      <h3 className="law-title">
                        <span className="law-year">{law.year}</span>
                        {highlightText(law.title, searchTerm)}
                        {law.title_ar && (
                          <div className="title-arabic">
                            {highlightText(law.title_ar, searchTerm)}
                          </div>
                        )}
                      </h3>
                      <span className={`law-status ${law.status}`}>
                        {law.status === 'active' ? '✓ En vigueur' : 'Archive'}
                      </span>
                    </div>

                    {/* Section indicator for global search */}
                    {globalSearchMode && law.sectionTitle && (
                      <div className="section-indicator">
                        <span className="section-icon">{law.sectionIcon}</span>
                        <span className="section-name">{law.sectionTitle}</span>
                      </div>
                    )}

                    <div className="law-meta">
                      <span className="meta-item">
                        📅 {law.publishDate}
                      </span>
                      <span className="meta-item">
                        📄 {law.size}
                      </span>
                      {law.type && (
                        <span className="meta-item document-type">
                          📋 {law.type.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    <div className="law-highlights">
                      {law.highlights.map((highlight, idx) => (
                        <span key={`${law.id}-highlight-${idx}`} className="highlight-tag">
                          {highlightText(highlight, searchTerm)}
                        </span>
                      ))}
                    </div>

                    <div className="law-actions">
                      <button 
                        className="btn-open-document"
                        onClick={() => openDocument(law)}
                        aria-label={`Ouvrir ${law.title}`}
                        style={{ pointerEvents: 'all', zIndex: 10 }}
                      >
                        <span className="btn-icon">📄</span>
                        Ouvrir le Document
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* No Results State */
              <div className="no-results-state">
                <div className="no-results-icon">🔍</div>
                <h3 className="no-results-title">
                  {searchTerm ? `Aucun résultat pour "${searchTerm}"` : 'Aucun document trouvé'}
                </h3>
                <div className="no-results-suggestions">
                  <p>Suggestions pour améliorer votre recherche :</p>
                  <ul>
                    <li>Vérifiez l'orthographe de vos mots-clés</li>
                    <li>Utilisez des termes plus généraux</li>
                    <li>Essayez avec moins de filtres</li>
                    <li>Recherchez par année (ex: "2024", "2023")</li>
                    {!globalSearchMode && (
                      <li>
                        <button 
                          className="suggestion-button"
                          onClick={() => {
                            setGlobalSearchMode(true);
                            if (searchTerm.length < 3) {
                              setSearchTerm(searchTerm + ' ');
                            }
                          }}
                        >
                          Rechercher dans toutes les sections
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
                
                {/* Popular searches */}
                <div className="popular-searches">
                  <h4>Recherches populaires :</h4>
                  <div className="popular-tags">
                    {['Constitution', 'Finance', '2024', '2023', 'Commerce', 'Travail'].map(tag => (
                      <button 
                        key={tag}
                        className="popular-tag"
                        onClick={() => {
                          setSearchTerm(tag);
                          setGlobalSearchMode(true);
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Supplementary Laws Section */}
            {currentCategory.supplementary && currentCategory.supplementary.length > 0 && (
              <div className="supplementary-section">
                <h3 className="supplementary-title">
                  📎 Lois Complémentaires et Amendements
                </h3>
                <div className="supplementary-list">
                  {currentCategory.supplementary.map((law) => (
                    <a 
                      key={law.id}
                      href={law.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="supplementary-item"
                    >
                      <span className="supp-year">{law.year}</span>
                      <span className="supp-title">{law.title}</span>
                      <span className="supp-date">{law.publishDate}</span>
                      <span className="supp-icon">→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">{currentCategory?.icon || '📚'}</div>
            <h3>Cette section arrive bientôt</h3>
            <p>Nous travaillons à rassembler et numériser ces documents juridiques.</p>
            <div className="try-global-search">
              <button 
                className="global-search-button"
                onClick={() => {
                  setGlobalSearchMode(true);
                  setSearchTerm('');
                  searchInputRef.current?.focus();
                }}
              >
                🌐 Rechercher dans toutes les sections disponibles
              </button>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="info-banner">
          <div className="banner-icon">ℹ️</div>
          <div className="banner-content">
            <h4>Source Officielle</h4>
            <p>
              Tous les documents proviennent du 
              <a href={allData.api_config.base_urls.tunisia_finance} target="_blank" rel="noopener noreferrer"> Ministère des Finances de Tunisie</a> 
              et sont régulièrement mis à jour. Dernière mise à jour : {new Date(allData.metadata.last_updated).toLocaleDateString('fr-FR')}.
            </p>
            <div className="stats-mini">
              <span>📊 {allData.metadata.total_documents} documents</span>
              <span>🔄 Version {allData.metadata.version}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {previewModal.isOpen && previewModal.law && (
        <div className="modal-overlay" onClick={closePreviewModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{previewModal.law.title}</h3>
              <button className="modal-close" onClick={closePreviewModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="pdf-preview-container">
                <iframe
                  src={`${previewModal.law.url}#toolbar=1&navpanes=1&scrollbar=1`}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  title={`Aperçu: ${previewModal.law.title}`}
                />
                <div className="pdf-fallback">
                  <p>Impossible d'afficher l'aperçu PDF dans ce navigateur.</p>
                  <div className="pdf-fallback-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.open(previewModal.law.url, '_blank')}
                    >
                      Ouvrir dans un nouvel onglet
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => downloadLaw(previewModal.law)}
                    >
                      Télécharger le PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LawsLibrary;