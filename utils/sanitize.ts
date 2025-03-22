/**
 * Sanitize text input to prevent XSS attacks
 */
export function sanitizeText(input: string): string {
    if (!input) return '';
    
    // Replace HTML tags and entities
    return input
      .replace(/<[^>]*>?/gm, '') // Remove HTML tags
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  /**
   * Sanitize search query
   */
  export function sanitizeSearchQuery(query: string): string {
    if (!query) return '';
    
    // Remove potentially harmful characters but keep basic search functionality
    return query
      .replace(/[^\w\s.\'-]/g, '')  // Allow alphanumeric, spaces, dots, apostrophes, hyphens
      .trim()
      .substring(0, 100); // Limit length
  }
  
  /**
   * Sanitize email address
   */
  export function sanitizeEmail(email: string): string {
    if (!email) return '';
    
    // Basic email sanitization
    return email
      .replace(/<[^>]*>?/gm, '')
      .trim()
      .toLowerCase()
      .substring(0, 254); // RFC 5321 max length
  }
  
  /**
   * Sanitize URL input
   */
  export function sanitizeUrl(url: string): string {
    if (!url) return '';
    
    // Only allow http:// and https:// URLs
    if (!/^https?:\/\//i.test(url)) {
      return '';
    }
    
    try {
      // Use URL constructor to validate
      const parsed = new URL(url);
      return parsed.toString();
    } catch (e) {
      return '';
    }
  }