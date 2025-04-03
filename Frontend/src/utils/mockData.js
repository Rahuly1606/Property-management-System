/**
 * Utility functions for mock data handling
 */

/**
 * Enable mock data mode for local development
 */
export const enableMockDataMode = () => {
  localStorage.setItem('MOCK_API', 'true');
  console.log('Mock data mode enabled. Refresh the page to see mock data.');
};

/**
 * Disable mock data mode
 */
export const disableMockDataMode = () => {
  localStorage.removeItem('MOCK_API');
  console.log('Mock data mode disabled. Refresh the page to use real API calls.');
};

/**
 * Check if mock data mode is enabled
 */
export const isMockDataModeEnabled = () => {
  return localStorage.getItem('MOCK_API') === 'true';
};

/**
 * Toggle mock data mode
 */
export const toggleMockDataMode = () => {
  if (isMockDataModeEnabled()) {
    disableMockDataMode();
    return false;
  } else {
    enableMockDataMode();
    return true;
  }
}; 