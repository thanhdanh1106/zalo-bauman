/**
 * Utility functions for scrolling in Zalo MiniApp
 * Since window.scrollTo() is not available in ZMP, we use alternative methods
 */

/**
 * Scroll to top of the page in ZMP
 */
export const scrollToTop = () => {
  try {
    // Method 1: Try scrollIntoView on app container
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      return;
    }

    // Method 2: Try to find the main scrollable container
    const scrollableContainers = [
      document.querySelector('.zmp-page'),
      document.querySelector('.page'),
      document.querySelector('body'),
      document.documentElement
    ];

    for (const container of scrollableContainers) {
      if (container) {
        // Try modern scrollTo if available
        if ('scrollTo' in container && typeof (container as any).scrollTo === 'function') {
          (container as any).scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          return;
        }
        
        // Fallback to scrollTop
        if ('scrollTop' in container) {
          (container as any).scrollTop = 0;
          return;
        }
      }
    }

    // Method 3: Last resort - use a dummy element at top
    const topElement = document.createElement('div');
    topElement.style.position = 'absolute';
    topElement.style.top = '0';
    topElement.style.left = '0';
    topElement.style.width = '1px';
    topElement.style.height = '1px';
    topElement.style.visibility = 'hidden';
    
    document.body.insertBefore(topElement, document.body.firstChild);
    topElement.scrollIntoView({ behavior: 'smooth' });
    
    // Clean up after scroll
    setTimeout(() => {
      if (topElement.parentNode) {
        topElement.parentNode.removeChild(topElement);
      }
    }, 1000);

  } catch (error) {
    console.log('Scroll to top failed:', error);
  }
};

/**
 * Scroll to a specific element
 * @param elementId - The ID of the element to scroll to
 */
export const scrollToElement = (elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  } catch (error) {
    console.log('Scroll to element failed:', error);
  }
};

/**
 * Scroll to a specific position
 * @param top - The top position to scroll to
 */
export const scrollToPosition = (top: number) => {
  try {
    // Try to find the main scrollable container
    const scrollableContainers = [
      document.querySelector('.zmp-page'),
      document.querySelector('.page'),
      document.querySelector('body'),
      document.documentElement
    ];

    for (const container of scrollableContainers) {
      if (container && 'scrollTo' in container) {
        (container as any).scrollTo({
          top,
          behavior: 'smooth'
        });
        return;
      }
    }

    // Fallback
    document.documentElement.scrollTop = top;
  } catch (error) {
    console.log('Scroll to position failed:', error);
  }
};

/**
 * Check if we're in ZMP environment
 */
export const isZMPEnvironment = () => {
  return typeof window !== 'undefined' && 
         (window as any).ZaloJavaScriptInterface !== undefined;
};