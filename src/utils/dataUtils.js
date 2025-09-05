import allData from '../data/all_data.json';

/**
 * Utility functions for accessing and manipulating the legal documents data
 */

/**
 * Get all sections with their metadata
 * @returns {Object} All sections from the JSON data
 */
export const getAllSections = () => {
  return allData.sections;
};

/**
 * Get a specific section by ID
 * @param {string} sectionId - The section ID (e.g., 'finance', 'commercial')
 * @returns {Object|null} The section data or null if not found
 */
export const getSection = (sectionId) => {
  return allData.sections[sectionId] || null;
};

/**
 * Get all documents from a specific section
 * @param {string} sectionId - The section ID
 * @returns {Array} Array of all documents in the section
 */
export const getSectionDocuments = (sectionId) => {
  const section = getSection(sectionId);
  if (!section || !section.documents) return [];
  
  const documents = [];
  
  // Add main laws
  if (section.documents.main_laws) {
    documents.push(...section.documents.main_laws.map(doc => ({ ...doc, type: 'main' })));
  }
  
  // Add supplementary laws
  if (section.documents.supplementary_laws) {
    documents.push(...section.documents.supplementary_laws.map(doc => ({ ...doc, type: 'supplementary' })));
  }
  
  // Add related reports
  if (section.documents.related_reports) {
    documents.push(...section.documents.related_reports.map(doc => ({ ...doc, type: 'report' })));
  }
  
  return documents;
};

/**
 * Search documents across all sections
 * @param {string} query - The search query
 * @param {Object} options - Search options
 * @returns {Array} Array of matching documents with section info
 */
export const searchDocuments = (query, options = {}) => {
  const {
    sectionId = null,
    year = null,
    type = null,
    language = null,
    limit = 50
  } = options;
  
  const results = [];
  const searchTerm = query.toLowerCase();
  
  Object.entries(allData.sections).forEach(([secId, section]) => {
    // Filter by section if specified
    if (sectionId && secId !== sectionId) return;
    
    const documents = getSectionDocuments(secId);
    
    documents.forEach(doc => {
      // Filter by year
      if (year && doc.year !== year) return;
      
      // Filter by type
      if (type && doc.type !== type) return;
      
      // Filter by language
      if (language && doc.language !== language) return;
      
      // Search in document fields
      const searchFields = [
        doc.title,
        doc.title_ar,
        doc.description,
        ...(doc.highlights || []),
        ...(doc.highlights_ar || []),
        ...(doc.tags || [])
      ].filter(Boolean).map(field => field.toLowerCase());
      
      const matches = searchFields.some(field => field.includes(searchTerm));
      
      if (matches) {
        results.push({
          ...doc,
          sectionId: secId,
          sectionTitle: section.title,
          sectionIcon: section.icon
        });
      }
    });
  });
  
  return results.slice(0, limit);
};

/**
 * Get documents by year across all sections
 * @param {number} year - The year to filter by
 * @returns {Array} Array of documents from the specified year
 */
export const getDocumentsByYear = (year) => {
  const results = [];
  
  Object.entries(allData.sections).forEach(([secId, section]) => {
    const documents = getSectionDocuments(secId);
    
    documents
      .filter(doc => doc.year === year)
      .forEach(doc => {
        results.push({
          ...doc,
          sectionId: secId,
          sectionTitle: section.title,
          sectionIcon: section.icon
        });
      });
  });
  
  return results;
};

/**
 * Get the most recent documents across all sections
 * @param {number} limit - Number of documents to return
 * @returns {Array} Array of the most recent documents
 */
export const getRecentDocuments = (limit = 10) => {
  const allDocs = [];
  
  Object.entries(allData.sections).forEach(([secId, section]) => {
    const documents = getSectionDocuments(secId);
    
    documents.forEach(doc => {
      allDocs.push({
        ...doc,
        sectionId: secId,
        sectionTitle: section.title,
        sectionIcon: section.icon
      });
    });
  });
  
  // Sort by publish date (newest first)
  allDocs.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));
  
  return allDocs.slice(0, limit);
};

/**
 * Get statistics about the document collection
 * @returns {Object} Statistics object
 */
export const getCollectionStats = () => {
  const stats = {
    totalSections: 0,
    totalDocuments: 0,
    documentsByType: {},
    documentsByYear: {},
    documentsByLanguage: {},
    sectionStats: {}
  };
  
  Object.entries(allData.sections).forEach(([secId, section]) => {
    stats.totalSections++;
    stats.sectionStats[secId] = {
      title: section.title,
      icon: section.icon,
      totalDocuments: section.total_documents || 0,
      status: section.status
    };
    
    const documents = getSectionDocuments(secId);
    stats.totalDocuments += documents.length;
    
    documents.forEach(doc => {
      // Count by type
      stats.documentsByType[doc.type] = (stats.documentsByType[doc.type] || 0) + 1;
      
      // Count by year
      if (doc.year) {
        stats.documentsByYear[doc.year] = (stats.documentsByYear[doc.year] || 0) + 1;
      }
      
      // Count by language
      if (doc.language) {
        stats.documentsByLanguage[doc.language] = (stats.documentsByLanguage[doc.language] || 0) + 1;
      }
    });
  });
  
  return stats;
};

/**
 * Get available years from all documents
 * @returns {Array} Sorted array of unique years
 */
export const getAvailableYears = () => {
  const years = new Set();
  
  Object.values(allData.sections).forEach(section => {
    const documents = getSectionDocuments(section.id);
    documents.forEach(doc => {
      if (doc.year) years.add(doc.year);
    });
  });
  
  return Array.from(years).sort((a, b) => b - a);
};

/**
 * Get search suggestions based on content
 * @returns {Array} Array of search suggestions
 */
export const getSearchSuggestions = () => {
  const suggestions = new Set();
  
  // Add global keywords
  allData.search_config.global_keywords.forEach(keyword => {
    suggestions.add(keyword);
  });
  
  // Add section-specific keywords
  Object.values(allData.sections).forEach(section => {
    if (section.search_keywords) {
      section.search_keywords.forEach(keyword => {
        suggestions.add(keyword);
      });
    }
    
    // Add document titles and tags
    const documents = getSectionDocuments(section.id);
    documents.forEach(doc => {
      if (doc.tags) {
        doc.tags.forEach(tag => suggestions.add(tag));
      }
    });
  });
  
  return Array.from(suggestions).sort();
};

/**
 * Validate document URL accessibility
 * @param {string} url - The document URL
 * @returns {Promise<boolean>} Promise resolving to true if accessible
 */
export const validateDocumentUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn(`Document URL not accessible: ${url}`, error);
    return false;
  }
};

/**
 * Export metadata for external use
 * @returns {Object} Metadata object
 */
export const getMetadata = () => {
  return { ...allData.metadata };
};

export default {
  getAllSections,
  getSection,
  getSectionDocuments,
  searchDocuments,
  getDocumentsByYear,
  getRecentDocuments,
  getCollectionStats,
  getAvailableYears,
  getSearchSuggestions,
  validateDocumentUrl,
  getMetadata
};