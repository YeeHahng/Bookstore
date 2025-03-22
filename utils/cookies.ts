/**
 * Set a secure cookie
 */
export function setSecureCookie(name: string, value: string, daysToExpire: number = 7) {
    // Calculate expiration
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysToExpire);
    
    // Set cookie with security flags
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict; Secure; HttpOnly`;
  }
  
  /**
   * Get a cookie value by name
   */
  export function getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null;
  }
  
  /**
   * Delete a cookie
   */
  export function deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure; HttpOnly`;
  }